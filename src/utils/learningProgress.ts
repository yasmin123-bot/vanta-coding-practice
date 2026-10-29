import { HTML_LESSON_IDS, type HtmlLessonId } from '../content/learningSystem';

export type LessonProgressSummaryInput = {
  lesson_id: HtmlLessonId;
  completed_at: string | null;
  last_opened_at: string;
};

export type LearningProgressSummary = {
  completedLessonIds: ReadonlySet<HtmlLessonId>;
  completedLessonCount: number;
  pathStarted: boolean;
  pathCompleted: boolean;
  lastOpenedLessonId: HtmlLessonId | null;
  resumeLessonId: HtmlLessonId;
  recommendedLessonId: HtmlLessonId | null;
};

function newestFirst<T extends { last_opened_at: string }>(rows: readonly T[]): T[] {
  return [...rows].sort((left, right) => Date.parse(right.last_opened_at) - Date.parse(left.last_opened_at));
}

/** Derives the learner-facing path state only from persisted progress rows. */
export function summarizeHtmlLearningProgress(
  lessonRows: readonly LessonProgressSummaryInput[],
  pathStarted: boolean,
): LearningProgressSummary {
  const catalogIds = new Set<string>(HTML_LESSON_IDS);
  const validRows = lessonRows.filter((row) => catalogIds.has(row.lesson_id));
  const completedLessonIds = new Set(
    validRows.filter((row) => row.completed_at !== null).map((row) => row.lesson_id),
  );
  const completedLessonCount = completedLessonIds.size;
  const pathCompleted = completedLessonCount === HTML_LESSON_IDS.length;
  const lastOpenedLessonId = newestFirst(validRows)[0]?.lesson_id ?? null;
  const mostRecentIncomplete = newestFirst(validRows.filter((row) => row.completed_at === null))[0]?.lesson_id;
  const recommendedLessonId = HTML_LESSON_IDS.find((lessonId) => !completedLessonIds.has(lessonId)) ?? null;

  return {
    completedLessonIds,
    completedLessonCount,
    pathStarted,
    pathCompleted,
    lastOpenedLessonId,
    resumeLessonId: mostRecentIncomplete
      ?? recommendedLessonId
      ?? lastOpenedLessonId
      ?? HTML_LESSON_IDS[HTML_LESSON_IDS.length - 1],
    recommendedLessonId,
  };
}
