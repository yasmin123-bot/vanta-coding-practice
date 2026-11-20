import { FOUNDATION_PATH_IDS, type FoundationPathId } from '../content/learningSystem';

export const BEGINNER_ASSESSMENT_QUESTION_COUNT = 10;
export const BEGINNER_ASSESSMENT_PASSING_SCORE = Math.ceil(BEGINNER_ASSESSMENT_QUESTION_COUNT * 0.8);

/**
 * New Beginner lessons are not part of the currently deployed Supabase schema.
 * This store is intentionally tab-scoped and never claims to be account/cloud progress.
 */
export type SessionBeginnerProgress = {
  version: 1;
  completedLessonIds: Partial<Record<FoundationPathId, string[]>>;
  completedExerciseIds: Partial<Record<FoundationPathId, string[]>>;
  placementStartIndex: Partial<Record<FoundationPathId, number>>;
  assessmentPassed: FoundationPathId[];
  assessmentScores: Partial<Record<FoundationPathId, number>>;
  projectCompleted: FoundationPathId[];
};

export type BeginnerLessonAccess = 'available' | 'locked' | 'review';

const storageKey = 'mabda-beginner-session-progress-v1';
const emptyProgress = (): SessionBeginnerProgress => ({
  version: 1,
  completedLessonIds: {},
  completedExerciseIds: {},
  placementStartIndex: {},
  assessmentPassed: [],
  assessmentScores: {},
  projectCompleted: [],
});

function getStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

function isPathId(value: unknown): value is FoundationPathId {
  return typeof value === 'string' && (FOUNDATION_PATH_IDS as readonly string[]).includes(value);
}

function readStringLists(value: unknown): Partial<Record<FoundationPathId, string[]>> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const result: Partial<Record<FoundationPathId, string[]>> = {};
  for (const [pathId, ids] of Object.entries(value)) {
    if (!isPathId(pathId) || !Array.isArray(ids)) continue;
    result[pathId] = [...new Set(ids.filter((id): id is string => (
      typeof id === 'string' && /^[a-z0-9][a-z0-9-]{0,95}$/.test(id)
    )))].slice(0, 50);
  }
  return result;
}

function readIndices(value: unknown): Partial<Record<FoundationPathId, number>> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const result: Partial<Record<FoundationPathId, number>> = {};
  for (const [pathId, index] of Object.entries(value)) {
    if (isPathId(pathId) && Number.isInteger(index) && (index as number) >= 0 && (index as number) < 50) {
      result[pathId] = index as number;
    }
  }
  return result;
}

function readPathList(value: unknown): FoundationPathId[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter(isPathId))];
}

function readAssessmentScores(
  value: unknown,
  passedPaths: readonly FoundationPathId[],
): Partial<Record<FoundationPathId, number>> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const result: Partial<Record<FoundationPathId, number>> = {};
  for (const [pathId, score] of Object.entries(value)) {
    if (
      isPathId(pathId) &&
      passedPaths.includes(pathId) &&
      Number.isInteger(score) &&
      (score as number) >= BEGINNER_ASSESSMENT_PASSING_SCORE &&
      (score as number) <= BEGINNER_ASSESSMENT_QUESTION_COUNT
    ) {
      result[pathId] = score as number;
    }
  }
  return result;
}

export function getSessionBeginnerProgress(): SessionBeginnerProgress {
  const storage = getStorage();
  if (!storage) return emptyProgress();
  try {
    const raw = storage.getItem(storageKey);
    if (!raw) return emptyProgress();
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return emptyProgress();
    const candidate = parsed as Record<string, unknown>;
    if (candidate.version !== 1) return emptyProgress();
    const assessmentPassed = readPathList(candidate.assessmentPassed);
    return {
      version: 1,
      completedLessonIds: readStringLists(candidate.completedLessonIds),
      completedExerciseIds: readStringLists(candidate.completedExerciseIds),
      placementStartIndex: readIndices(candidate.placementStartIndex),
      assessmentPassed,
      assessmentScores: readAssessmentScores(candidate.assessmentScores, assessmentPassed),
      projectCompleted: readPathList(candidate.projectCompleted),
    };
  } catch {
    return emptyProgress();
  }
}

function updateProgress(update: (current: SessionBeginnerProgress) => SessionBeginnerProgress): boolean {
  const storage = getStorage();
  if (!storage) return false;
  try {
    const next = update(getSessionBeginnerProgress());
    storage.setItem(storageKey, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}

export function setSessionPlacementStart(pathId: FoundationPathId, index: number): boolean {
  if (!Number.isInteger(index) || index < 0 || index >= 50) return false;
  return updateProgress((current) => ({
    ...current,
    placementStartIndex: { ...current.placementStartIndex, [pathId]: index },
  }));
}

function recordId(
  pathId: FoundationPathId,
  id: string,
  field: 'completedLessonIds' | 'completedExerciseIds',
): boolean {
  if (!/^[a-z0-9][a-z0-9-]{0,95}$/.test(id)) return false;
  return updateProgress((current) => {
    const currentIds = current[field][pathId] ?? [];
    return {
      ...current,
      [field]: {
        ...current[field],
        [pathId]: currentIds.includes(id) ? currentIds : [...currentIds, id].slice(0, 50),
      },
    };
  });
}

export function recordSessionLessonComplete(pathId: FoundationPathId, lessonId: string): boolean {
  return recordId(pathId, lessonId, 'completedLessonIds');
}

export function recordSessionExerciseComplete(pathId: FoundationPathId, lessonId: string): boolean {
  return recordId(pathId, lessonId, 'completedExerciseIds');
}

export function recordSessionAssessmentPassed(pathId: FoundationPathId, score: number): boolean {
  if (
    !Number.isInteger(score) ||
    score < BEGINNER_ASSESSMENT_PASSING_SCORE ||
    score > BEGINNER_ASSESSMENT_QUESTION_COUNT
  ) return false;
  return updateProgress((current) => ({
    ...current,
    assessmentPassed: current.assessmentPassed.includes(pathId)
      ? current.assessmentPassed
      : [...current.assessmentPassed, pathId],
    assessmentScores: { ...current.assessmentScores, [pathId]: score },
  }));
}

export function recordSessionProjectCompleted(pathId: FoundationPathId): boolean {
  return updateProgress((current) => ({
    ...current,
    projectCompleted: current.projectCompleted.includes(pathId)
      ? current.projectCompleted
      : [...current.projectCompleted, pathId],
  }));
}

export function getBeginnerLessonAccess(
  pathId: FoundationPathId,
  orderedLessonIds: readonly string[],
  lessonId: string,
  persistedCompletedIds: ReadonlySet<string> = new Set(),
  sessionProgress: SessionBeginnerProgress = getSessionBeginnerProgress(),
): BeginnerLessonAccess {
  const targetIndex = orderedLessonIds.indexOf(lessonId);
  if (targetIndex < 0) return 'locked';
  const startIndex = Math.min(
    sessionProgress.placementStartIndex[pathId] ?? 0,
    Math.max(orderedLessonIds.length - 1, 0),
  );
  if (targetIndex < startIndex) return 'review';
  for (let index = startIndex; index < targetIndex; index += 1) {
    const priorId = orderedLessonIds[index];
    const sessionComplete = sessionProgress.completedLessonIds[pathId]?.includes(priorId) ?? false;
    if (!sessionComplete && !persistedCompletedIds.has(priorId)) return 'locked';
  }
  return 'available';
}

export function getBeginnerUnlockableIndex(
  pathId: FoundationPathId,
  orderedLessonIds: readonly string[],
  persistedCompletedIds: ReadonlySet<string> = new Set(),
  sessionProgress: SessionBeginnerProgress = getSessionBeginnerProgress(),
): number {
  if (!orderedLessonIds.length) return -1;
  const startIndex = Math.min(
    sessionProgress.placementStartIndex[pathId] ?? 0,
    orderedLessonIds.length - 1,
  );
  for (let index = startIndex; index < orderedLessonIds.length; index += 1) {
    const id = orderedLessonIds[index];
    const sessionComplete = sessionProgress.completedLessonIds[pathId]?.includes(id) ?? false;
    if (!sessionComplete && !persistedCompletedIds.has(id)) return index;
  }
  return orderedLessonIds.length;
}

export function clearSessionBeginnerProgress(): boolean {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.removeItem(storageKey);
    return true;
  } catch {
    return false;
  }
}
