import {
  FOUNDATION_LESSON_IDS_BY_PATH,
  getPathLessonIds,
  HTML_PATH_ID,
  type FoundationLessonId,
  type FoundationPathId,
  type HtmlLessonId,
} from '../content/learningSystem';

export type LessonProgressSummaryInput = {
  lesson_id: FoundationLessonId;
  completed_at: string | null;
  last_opened_at: string;
};

type LessonIdForPath<TPathId extends FoundationPathId> = (typeof FOUNDATION_LESSON_IDS_BY_PATH)[TPathId][number];

export type LearningProgressSummary<TLessonId extends FoundationLessonId = FoundationLessonId> = {
  completedLessonIds: ReadonlySet<TLessonId>;
  completedLessonCount: number;
  pathStarted: boolean;
  pathCompleted: boolean;
  lastOpenedLessonId: TLessonId | null;
  resumeLessonId: TLessonId;
  recommendedLessonId: TLessonId | null;
};

function newestFirst<T extends { last_opened_at: string }>(rows: readonly T[]): T[] {
  return [...rows].sort((left, right) => Date.parse(right.last_opened_at) - Date.parse(left.last_opened_at));
}

/** Derives one Foundation path's learner-facing state only from persisted progress rows. */
export function summarizeFoundationLearningProgress<TPathId extends FoundationPathId>(
  pathId: TPathId,
  lessonRows: readonly LessonProgressSummaryInput[],
  pathStarted: boolean,
): LearningProgressSummary<LessonIdForPath<TPathId>> {
  const pathLessonIds = getPathLessonIds(pathId);
  const catalogIds = new Set<string>(pathLessonIds);
  const validRows = lessonRows.filter((row) => catalogIds.has(row.lesson_id));
  const completedLessonIds = new Set<LessonIdForPath<TPathId>>(
    validRows.filter((row) => row.completed_at !== null).map((row) => row.lesson_id as LessonIdForPath<TPathId>),
  );
  const completedLessonCount = completedLessonIds.size;
  const pathCompleted = completedLessonCount === pathLessonIds.length;
  const lastOpenedLessonId = newestFirst(validRows)[0]?.lesson_id ?? null;
  const mostRecentIncomplete = newestFirst(validRows.filter((row) => row.completed_at === null))[0]?.lesson_id;
  const recommendedLessonId = pathLessonIds.find((lessonId) => !completedLessonIds.has(lessonId as LessonIdForPath<TPathId>)) ?? null;

  return {
    completedLessonIds,
    completedLessonCount,
    pathStarted,
    pathCompleted,
    lastOpenedLessonId,
    resumeLessonId: mostRecentIncomplete
      ?? recommendedLessonId
      ?? lastOpenedLessonId
      ?? pathLessonIds[pathLessonIds.length - 1] as LessonIdForPath<TPathId>,
    recommendedLessonId,
  };
}

/** Backwards-compatible HTML-specific entry point for existing callers. */
export function summarizeHtmlLearningProgress(
  lessonRows: readonly LessonProgressSummaryInput[],
  pathStarted: boolean,
): LearningProgressSummary<HtmlLessonId> {
  return summarizeFoundationLearningProgress(HTML_PATH_ID, lessonRows, pathStarted) as LearningProgressSummary<HtmlLessonId>;
}
