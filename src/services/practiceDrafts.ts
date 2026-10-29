import type { User } from '@supabase/supabase-js';
import type { HtmlLessonId } from '../content/learningSystem';
import { supabaseClient } from '../lib/supabaseClient';
import type { Database } from '../lib/database.types';

export type PracticeDraft = Database['public']['Tables']['practice_drafts']['Row'];
export type PracticeDraftContent = Pick<PracticeDraft, 'html_code' | 'css_code' | 'js_code'>;

const draftColumns = 'user_id,exercise_id,html_code,css_code,js_code,draft_version,created_at,updated_at';
const maxDraftBytes = 131072;
const maxDraftFieldBytes = 65536;

function requireClient() {
  if (!supabaseClient) throw new Error('Supabase is not configured.');
  return supabaseClient;
}

function requireUserId(user: User) {
  if (!user.id) throw new Error('An authenticated user is required.');
  return user.id;
}

function validateDraftSize(draft: PracticeDraftContent) {
  const encoder = new TextEncoder();
  const fields = [draft.html_code, draft.css_code, draft.js_code];
  if (fields.some((field) => encoder.encode(field).byteLength > maxDraftFieldBytes)) {
    throw new Error('A practice draft field exceeds the allowed size.');
  }
  const bytes = encoder.encode(fields.join('')).byteLength;
  if (bytes > maxDraftBytes) throw new Error('Practice draft exceeds the allowed size.');
}

export async function loadPracticeDraft(user: User, exerciseId: HtmlLessonId): Promise<PracticeDraft | null> {
  const client = requireClient();
  const userId = requireUserId(user);
  const { data, error } = await client
    .from('practice_drafts')
    .select(draftColumns)
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function savePracticeDraft(
  user: User,
  exerciseId: HtmlLessonId,
  draft: PracticeDraftContent,
): Promise<PracticeDraft> {
  const client = requireClient();
  const userId = requireUserId(user);
  validateDraftSize(draft);
  const { data, error } = await client
    .from('practice_drafts')
    .upsert({
      user_id: userId,
      exercise_id: exerciseId,
      ...draft,
      draft_version: 1,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,exercise_id' })
    .select(draftColumns)
    .single();

  if (error) throw error;
  if (!data || data.user_id !== userId || data.exercise_id !== exerciseId) {
    throw new Error('Supabase did not confirm the expected practice draft.');
  }
  return data;
}
