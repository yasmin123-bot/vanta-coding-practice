import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { type FoundationLessonId, type FoundationPathId } from '../content/learningSystem';
import { useAuth } from '../auth/AuthProvider';
import { supabaseClient } from '../lib/supabaseClient';
import {
  loadStudentData,
  recordLessonOpened,
  recordPathOpened,
  saveLessonQuizResult,
  updateStudentDisplayName,
  type StudentDataSnapshot,
} from '../services/studentData';
import { replaceProfileAvatar, type ProfileAvatarErrorCode } from '../services/profileAvatar';

const emptySnapshot: StudentDataSnapshot = {
  profile: { user_id: '', display_name: '', avatar_path: null, created_at: '', updated_at: '' },
  paths: [],
  lessons: [],
};

type LoadState = 'loading' | 'ready' | 'error';

type StudentProgressContextValue = StudentDataSnapshot & {
  loading: boolean;
  error: boolean;
  hasLoaded: boolean;
  refresh: () => Promise<boolean>;
  openPath: (pathId: FoundationPathId) => Promise<boolean>;
  openLesson: (lessonId: FoundationLessonId) => Promise<boolean>;
  completeLessonQuiz: (lessonId: FoundationLessonId, score: number, total: number) => Promise<boolean>;
  updateDisplayName: (displayName: string) => Promise<boolean>;
  updateAvatar: (file: File) => Promise<'saved' | 'cleanup-warning' | ProfileAvatarErrorCode | 'error'>;
};

const StudentProgressContext = createContext<StudentProgressContextValue | null>(null);

export function StudentProgressProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [snapshot, setSnapshot] = useState<StudentDataSnapshot>(emptySnapshot);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [hasLoaded, setHasLoaded] = useState(false);
  const requestId = useRef(0);
  const currentUserId = useRef<string | null>(user?.id ?? null);
  const snapshotUserId = useRef<string | null>(null);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());
  currentUserId.current = user?.id ?? null;

  const refresh = useCallback(async (): Promise<boolean> => {
    const currentRequest = ++requestId.current;
    if (authLoading) {
      setLoadState('loading');
      return false;
    }
    if (!user || !supabaseClient) {
      snapshotUserId.current = null;
      setSnapshot(emptySnapshot);
      setHasLoaded(false);
      setLoadState('ready');
      return true;
    }

    if (snapshotUserId.current !== user.id) {
      snapshotUserId.current = user.id;
      setSnapshot(emptySnapshot);
      setHasLoaded(false);
    }

    setLoadState('loading');
    try {
      const nextSnapshot = await loadStudentData(user);
      if (requestId.current !== currentRequest || currentUserId.current !== user.id) return false;
      setSnapshot(nextSnapshot);
      setHasLoaded(true);
      setLoadState('ready');
      return true;
    } catch {
      if (requestId.current !== currentRequest || currentUserId.current !== user.id) return false;
      setLoadState('error');
      return false;
    }
  }, [authLoading, user]);

  useEffect(() => {
    void refresh();
    return () => {
      requestId.current += 1;
    };
  }, [refresh]);

  const runWrite = useCallback((action: (authenticatedUser: User) => Promise<void>): Promise<boolean> => {
    const requestedUser = user;
    if (!requestedUser || !supabaseClient) return Promise.resolve(false);

    const queuedWrite = writeQueue.current.catch(() => undefined).then(async () => {
      if (currentUserId.current !== requestedUser.id) return false;
      try {
        await action(requestedUser);
      } catch {
        if (currentUserId.current === requestedUser.id) setLoadState('error');
        return false;
      }
      if (currentUserId.current !== requestedUser.id) return false;
      await refresh();
      return currentUserId.current === requestedUser.id;
    });

    writeQueue.current = queuedWrite.then(() => undefined, () => undefined);
    return queuedWrite;
  }, [refresh, user]);

  const openPath = useCallback(async (pathId: FoundationPathId) => (
    runWrite((authenticatedUser) => recordPathOpened(authenticatedUser, pathId))
  ), [runWrite]);

  const openLesson = useCallback(async (lessonId: FoundationLessonId) => (
    runWrite((authenticatedUser) => recordLessonOpened(authenticatedUser, lessonId))
  ), [runWrite]);

  const completeLessonQuiz = useCallback(async (lessonId: FoundationLessonId, score: number, total: number) => (
    runWrite((authenticatedUser) => saveLessonQuizResult(authenticatedUser, lessonId, score, total))
  ), [runWrite]);

  const updateDisplayName = useCallback(async (displayName: string) => (
    runWrite(async (authenticatedUser) => {
      const updatedProfile = await updateStudentDisplayName(authenticatedUser, displayName);
      if (currentUserId.current === authenticatedUser.id) {
        setSnapshot((current) => ({ ...current, profile: updatedProfile }));
      }
    })
  ), [runWrite]);

  const updateAvatar = useCallback(async (file: File): Promise<'saved' | 'cleanup-warning' | ProfileAvatarErrorCode | 'error'> => {
    const requestedUser = user;
    if (!requestedUser || !supabaseClient) return 'error';
    try {
      const result = await replaceProfileAvatar(requestedUser, file, snapshot.profile.avatar_path);
      if (currentUserId.current !== requestedUser.id) return 'error';
      setSnapshot((current) => ({ ...current, profile: result.profile }));
      return result.cleanupWarning ? 'cleanup-warning' : 'saved';
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string') {
        return error.code as ProfileAvatarErrorCode;
      }
      return 'error';
    }
  }, [user, snapshot.profile.avatar_path]);

  const snapshotMatchesUser = snapshotUserId.current === (user?.id ?? null);
  const visibleSnapshot = snapshotMatchesUser ? snapshot : emptySnapshot;
  const hasLoadedForCurrentUser = Boolean(user) && hasLoaded && snapshotMatchesUser;
  const identitySwitchPending = Boolean(user) && !snapshotMatchesUser;

  const value = useMemo<StudentProgressContextValue>(() => ({
    ...visibleSnapshot,
    loading: authLoading || identitySwitchPending || loadState === 'loading',
    error: snapshotMatchesUser && loadState === 'error',
    hasLoaded: hasLoadedForCurrentUser,
    refresh,
    openPath,
    openLesson,
    completeLessonQuiz,
    updateDisplayName,
    updateAvatar,
  }), [visibleSnapshot, authLoading, identitySwitchPending, loadState, snapshotMatchesUser, hasLoadedForCurrentUser, refresh, openPath, openLesson, completeLessonQuiz, updateDisplayName, updateAvatar]);

  return <StudentProgressContext.Provider value={value}>{children}</StudentProgressContext.Provider>;
}

export function useStudentProgress() {
  const context = useContext(StudentProgressContext);
  if (!context) throw new Error('useStudentProgress must be used inside StudentProgressProvider.');
  return context;
}

export function getStudentProgressName(user: User | null, storedName: string) {
  if (storedName.trim()) return storedName.trim();
  const fromMetadata = user?.user_metadata?.full_name ?? user?.user_metadata?.name;
  if (typeof fromMetadata === 'string' && fromMetadata.trim()) return fromMetadata.trim();
  return user?.email?.split('@')[0] || 'Mabda Learner';
}
