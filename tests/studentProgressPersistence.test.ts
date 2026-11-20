import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { User } from '@supabase/supabase-js';
import {
  CSS_PATH_ID,
  FOUNDATION_LESSON_IDS_BY_PATH,
  FOUNDATION_PATH_IDS,
  HTML_PATH_ID,
  JAVASCRIPT_PATH_ID,
} from '../src/content/learningSystem';
import { recordLessonOpened, recordPathOpened } from '../src/services/studentData';

const mocks = vi.hoisted(() => {
  const pathProgress = { upsert: vi.fn() };
  const lessonProgress = { upsert: vi.fn() };
  const client = { from: vi.fn() };
  return { client, pathProgress, lessonProgress };
});

vi.mock('../src/lib/supabaseClient', () => ({ supabaseClient: mocks.client }));

const user = { id: 'local-progress-test-user' } as User;
const pathCases = [
  [HTML_PATH_ID, 'html-first-page'],
  [CSS_PATH_ID, 'css-specificity-inheritance'],
  [JAVASCRIPT_PATH_ID, 'js-loops'],
] as const;

function extractSqlIds(sql: string) {
  return [...sql.matchAll(/'([^']+)'/g)].map((match) => match[1]);
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.client.from.mockImplementation((table: string) => {
    if (table === 'path_progress') return mocks.pathProgress;
    if (table === 'lesson_progress') return mocks.lessonProgress;
    throw new Error(`Unexpected table in local test: ${table}`);
  });
  mocks.pathProgress.upsert.mockResolvedValue({ error: null });
  mocks.lessonProgress.upsert.mockResolvedValue({ error: null });
});

describe('foundation path and lesson progress compatibility', () => {
  it.each(FOUNDATION_PATH_IDS)('writes path progress for %s', async (pathId) => {
    await recordPathOpened(user, pathId);
    expect(mocks.client.from).toHaveBeenCalledWith('path_progress');
    expect(mocks.pathProgress.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: user.id, path_id: pathId }),
      { onConflict: 'user_id,path_id' },
    );
  });

  it.each(pathCases)('writes the canonical %s lesson progress with the matching path', async (pathId, lessonId) => {
    await recordLessonOpened(user, lessonId);
    expect(mocks.client.from.mock.calls.map(([table]) => table)).toEqual(['path_progress', 'lesson_progress']);
    expect(mocks.pathProgress.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: user.id, path_id: pathId }),
      { onConflict: 'user_id,path_id' },
    );
    expect(mocks.lessonProgress.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: user.id, path_id: pathId, lesson_id: lessonId }),
      { onConflict: 'user_id,lesson_id' },
    );
  });

  it('keeps the local path_progress constraint aligned with all three active Foundation paths', () => {
    const migration = readFileSync('supabase/migrations/20261029222404_mabda_css_js_foundations.sql', 'utf8');
    const constraint = migration.match(/add constraint path_progress_path_id_check check \(path_id in \(([\s\S]*?)\)\);/i);
    expect(constraint, 'path_progress constraint exists in the local forward migration').not.toBeNull();
    expect(new Set(extractSqlIds(constraint?.[1] ?? ''))).toEqual(new Set(FOUNDATION_PATH_IDS));
  });

  it('keeps the pending expanded lesson constraint aligned with every canonical HTML, CSS, and JavaScript lesson', () => {
    const previousMigration = readFileSync('supabase/migrations/20261029222404_mabda_css_js_foundations.sql', 'utf8');
    const previousConstraint = previousMigration.match(/add constraint lesson_progress_lesson_id_check check \(lesson_id in \(([\s\S]*?)\)\);/i);
    expect(previousConstraint, 'previous lesson constraint exists in local migration history').not.toBeNull();
    const previouslyAllowed = new Set(extractSqlIds(previousConstraint?.[1] ?? ''));

    const migration = readFileSync('supabase/migrations/20261113190446_mabda_expanded_curriculum.sql', 'utf8');
    const lessonConstraint = migration.match(/add constraint lesson_progress_lesson_id_check check \(lesson_id in \(([\s\S]*?)\)\);/i);
    expect(lessonConstraint, 'expanded lesson constraint exists in the local unapplied migration').not.toBeNull();
    const expectedLessonIds = FOUNDATION_PATH_IDS.flatMap((pathId) => FOUNDATION_LESSON_IDS_BY_PATH[pathId]);
    expect(new Set(extractSqlIds(lessonConstraint?.[1] ?? ''))).toEqual(new Set(expectedLessonIds));
    expect(previouslyAllowed.size).toBe(22);
    expect(expectedLessonIds.filter((lessonId) => !previouslyAllowed.has(lessonId))).toHaveLength(32);
    expect(previouslyAllowed.has('css-specificity-inheritance')).toBe(false);
    expect(previouslyAllowed.has('js-loops')).toBe(false);
    expect(extractSqlIds(lessonConstraint?.[1] ?? '')).toEqual(expect.arrayContaining(['css-specificity-inheritance', 'js-loops']));

    const pathConstraint = migration.match(/add constraint lesson_progress_path_check check \(([\s\S]*?)\);/i);
    expect(pathConstraint, 'expanded per-path lesson constraint exists in the local unapplied migration').not.toBeNull();
    const perPath = [...(pathConstraint?.[1] ?? '').matchAll(/path_id\s*=\s*'([^']+)'\s+and\s+lesson_id\s+in\s*\(([\s\S]*?)\)/gi)];
    expect(perPath).toHaveLength(FOUNDATION_PATH_IDS.length);
    for (const match of perPath) {
      const pathId = match[1] as (typeof FOUNDATION_PATH_IDS)[number];
      expect(new Set(extractSqlIds(match[2]))).toEqual(new Set(FOUNDATION_LESSON_IDS_BY_PATH[pathId]));
    }
  });
});
