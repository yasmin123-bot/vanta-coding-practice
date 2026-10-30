import type { User } from '@supabase/supabase-js';
import { getPathForLesson, type FoundationLessonId, type FoundationPathId } from '../content/learningSystem';
import { supabaseClient } from '../lib/supabaseClient';
import type { Database } from '../lib/database.types';

export type StudentProfile = Database['public']['Tables']['profiles']['Row'];
export type PathProgressRow = Database['public']['Tables']['path_progress']['Row'];
export type LessonProgressRow = Omit<Database['public']['Tables']['lesson_progress']['Row'], 'lesson_id'> & {
  lesson_id: FoundationLessonId;
};

export type StudentDataSnapshot = {
  profile: StudentProfile;
  paths: PathProgressRow[];
  lessons: LessonProgressRow[];
};

function requireClient() {
  if (!supabaseClient) throw new Error('Supabase is not configured.');
  return supabaseClient;
}

function requireUserId(user: User) {
  if (!user.id) throw new Error('An authenticated user is required.');
  return user.id;
}

function displayNameFromUser(user: User): string {
  const metadataName = user.user_metadata?.full_name ?? user.user_metadata?.name;
  const candidate = typeof metadataName === 'string' ? metadataName.trim() : '';
  if (candidate.length >= 2) return candidate.slice(0, 80);
  const emailName = user.email?.split('@')[0]?.trim();
  return (emailName || 'VANTA Learner').slice(0, 80);
}

async function ensureProfile(user: User): Promise<StudentProfile> {
  const client = requireClient();
  const userId = requireUserId(user);
  const profileColumns = 'user_id,display_name,created_at,updated_at';
  const { data, error } = await client
    .from('profiles')
    .select(profileColumns)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (data) return data;

  const inserted = await client
    .from('profiles')
    .insert({ user_id: userId, display_name: displayNameFromUser(user) })
    .select(profileColumns)
    .single();

  if (!inserted.error && inserted.data) return inserted.data;
  if (inserted.error?.code === '23505') {
    const retry = await client.from('profiles').select(profileColumns).eq('user_id', userId).single();
    if (retry.error) throw retry.error;
    return retry.data;
  }
  if (inserted.error) throw inserted.error;
  throw new Error('The student profile could not be created.');
}

export async function loadStudentData(user: User): Promise<StudentDataSnapshot> {
  const client = requireClient();
  const userId = requireUserId(user);
  const [profile, pathsResult, lessonsResult] = await Promise.all([
    ensureProfile(user),
    client
      .from('path_progress')
      .select('user_id,path_id,started_at,last_opened_at')
      .eq('user_id', userId)
      .order('last_opened_at', { ascending: false }),
    client
      .from('lesson_progress')
      .select('user_id,path_id,lesson_id,started_at,last_opened_at,completed_at,quiz_score,quiz_total')
      .eq('user_id', userId)
      .order('last_opened_at', { ascending: false }),
  ]);

  if (pathsResult.error) throw pathsResult.error;
  if (lessonsResult.error) throw lessonsResult.error;

  return {
    profile,
    paths: pathsResult.data ?? [],
    lessons: (lessonsResult.data ?? []) as unknown as LessonProgressRow[],
  };
}

async function openPath(user: User, pathId: FoundationPathId): Promise<void> {
  const client = requireClient();
  const userId = requireUserId(user);
  const { error } = await client.from('path_progress').upsert(
    {
      user_id: userId,
      path_id: pathId,
      last_opened_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,path_id' },
  );
  if (error) throw error;
}

export async function recordPathOpened(user: User, pathId: FoundationPathId): Promise<void> {
  await openPath(user, pathId);
}

export async function recordLessonOpened(user: User, lessonId: FoundationLessonId): Promise<void> {
  const client = requireClient();
  const userId = requireUserId(user);
  await openPath(user, getPathForLesson(lessonId));

  const { error } = await client.from('lesson_progress').upsert(
    {
      user_id: userId,
      path_id: getPathForLesson(lessonId),
      lesson_id: lessonId,
      last_opened_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,lesson_id' },
  );
  if (error) throw error;
}

export async function saveLessonQuizResult(
  user: User,
  lessonId: FoundationLessonId,
  score: number,
  total: number,
): Promise<void> {
  if (!Number.isInteger(score) || !Number.isInteger(total) || total < 1 || score < 0 || score > total) {
    throw new Error('Invalid quiz score.');
  }

  const client = requireClient();
  const userId = requireUserId(user);
  await recordLessonOpened(user, lessonId);

  const { data, error } = await client
    .from('lesson_progress')
    .select('completed_at')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single();
  if (error) throw error;

  const { error: updateError } = await client
    .from('lesson_progress')
    .update({
      completed_at: data.completed_at ?? new Date().toISOString(),
      quiz_score: score,
      quiz_total: total,
      last_opened_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .select('lesson_id')
    .single();
  if (updateError) throw updateError;
}

export async function updateStudentDisplayName(user: User, displayName: string): Promise<StudentProfile> {
  const client = requireClient();
  const userId = requireUserId(user);
  const normalizedName = displayName.trim();
  if (normalizedName.length < 2 || normalizedName.length > 80) {
    throw new Error('The display name must be between 2 and 80 characters.');
  }

  const { data, error } = await client
    .from('profiles')
    .update({ display_name: normalizedName, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select('user_id,display_name,created_at,updated_at')
    .single();

  if (error) throw error;
  return data;
}
