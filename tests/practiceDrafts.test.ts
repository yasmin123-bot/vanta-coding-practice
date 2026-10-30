import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { User } from '@supabase/supabase-js';
import { loadPracticeDraft, savePracticeDraft, type PracticeDraft } from '../src/services/practiceDrafts';

const mocks = vi.hoisted(() => {
  const query: Record<string, any> = {};
  query.select = vi.fn(() => query);
  query.eq = vi.fn(() => query);
  query.maybeSingle = vi.fn();
  query.upsert = vi.fn(() => query);
  query.single = vi.fn();
  const client = { from: vi.fn(() => query) };
  return { client, query };
});

vi.mock('../src/lib/supabaseClient', () => ({ supabaseClient: mocks.client }));

const user = { id: 'test-user-id' } as User;
const content = { html_code: '<h1>Hello</h1>', css_code: 'h1 { color: teal; }', js_code: 'console.log("hello");' };
const timestamps = { created_at: '2026-01-01T00:00:00.000Z', updated_at: '2026-01-01T00:00:00.000Z' };

function storedDraft(exerciseId: PracticeDraft['exercise_id']): PracticeDraft {
  return {
    user_id: user.id,
    exercise_id: exerciseId,
    ...content,
    draft_version: 1,
    ...timestamps,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Practice draft persistence', () => {
  it.each([
    'html-introduction',
    'css-selectors',
    'js-functions',
  ] as const)('loads the user-owned draft for %s', async (exerciseId) => {
    const draft = storedDraft(exerciseId);
    mocks.query.maybeSingle.mockResolvedValue({ data: draft, error: null });

    await expect(loadPracticeDraft(user, exerciseId)).resolves.toEqual(draft);
    expect(mocks.client.from).toHaveBeenCalledWith('practice_drafts');
    expect(mocks.query.eq).toHaveBeenNthCalledWith(1, 'user_id', user.id);
    expect(mocks.query.eq).toHaveBeenNthCalledWith(2, 'exercise_id', exerciseId);
  });

  it.each([
    'html-first-page',
    'css-flexbox',
    'js-dom-basics',
  ] as const)('saves the user-owned draft for %s without changing its exercise key', async (exerciseId) => {
    const draft = storedDraft(exerciseId);
    mocks.query.single.mockResolvedValue({ data: draft, error: null });

    await expect(savePracticeDraft(user, exerciseId, content)).resolves.toEqual(draft);
    expect(mocks.client.from).toHaveBeenCalledWith('practice_drafts');
    expect(mocks.query.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: user.id, exercise_id: exerciseId, ...content, draft_version: 1 }),
      { onConflict: 'user_id,exercise_id' },
    );
  });

  it('requires an authenticated user rather than persisting through a guest path', async () => {
    await expect(loadPracticeDraft({ id: '' } as User, 'css-selectors')).rejects.toThrow('An authenticated user is required.');
    expect(mocks.client.from).not.toHaveBeenCalled();
  });
});
