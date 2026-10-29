import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { type HtmlLessonId } from '../content/learningSystem';
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

const emptySnapshot: StudentDataSnapshot = {
  profile: { user_id: '', display_name: '', created_at: '', updated_at: '' },
  paths: [],
  lessons: [],
};

type LoadState = 'loading' | 'ready' | 'error';

type StudentProgressContextValue = StudentDataSnapshot & {
  loading: boolean;
  error: boolean;
  hasLoaded: boolean;
  refresh: () => Promise<boolean>;
  openPath: (pathId: 'html-fundamentals') => Promise<boolean>;
  openLesson: (lessonId: HtmlLessonId) => Promise<boolean>;
  completeLessonQuiz: (lessonId: HtmlLessonId, score: number, total: number) => Promise<boolean>;
  updateDisplayName: (displayName: string) => Promise<boolean>;
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

  const openPath = useCallback(async (pathId: 'html-fundamentals') => {
    if (pathId !== 'html-fundamentals') return false;
    return runWrite(recordPathOpened);
  }, [runWrite]);

  const openLesson = useCallback(async (lessonId: HtmlLessonId) => (
    runWrite((authenticatedUser) => recordLessonOpened(authenticatedUser, lessonId))
  ), [runWrite]);

  const completeLessonQuiz = useCallback(async (lessonId: HtmlLessonId, score: number, total: number) => (
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
  }), [visibleSnapshot, authLoading, identitySwitchPending, loadState, snapshotMatchesUser, hasLoadedForCurrentUser, refresh, openPath, openLesson, completeLessonQuiz, updateDisplayName]);

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
  return user?.email?.split('@')[0] || 'VANTA Learner';
}
