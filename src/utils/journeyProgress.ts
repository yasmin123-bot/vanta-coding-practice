import { FOUNDATION_PATH_IDS, type FoundationPathId } from '../content/learningSystem';
import { getBeginnerLessons } from '../content/beginnerCurriculum';
import { JOURNEY_COURSES, type JourneyLevel } from '../content/journeyCurriculum';
import type { SessionBeginnerProgress } from './sessionBeginnerProgress';

export type JourneyCourseProgress = {
  completedLessonIds: string[];
  assessmentPassed: boolean;
  assessmentBestScore: number | null;
  assessmentLastScore: number | null;
};
export type JourneyProjectProgress = {
  completedStageIds: string[];
  rubricChecked: boolean;
  completed: boolean;
};
export type JourneyProgress = {
  version: 1;
  courses: Partial<Record<string, JourneyCourseProgress>>;
  projects: Partial<Record<JourneyLevel, JourneyProjectProgress>>;
};
export type JourneyProjectDraft = Record<string, string>;
export type JourneyRequirement = { id: string; met: boolean; href: string };
export type JourneyGate = { unlocked: boolean; requirements: JourneyRequirement[] };

const progressStorageKey = 'mabda-learning-journey-progress-v1';
const draftStorageKey = 'mabda-learning-journey-project-drafts-v1';
const levels: JourneyLevel[] = ['intermediate', 'professional'];
const idPattern = /^[a-z0-9][a-z0-9-]{0,95}$/;

function emptyProgress(): JourneyProgress {
  return { version: 1, courses: {}, projects: {} };
}
function storage(): Storage | null {
  try { return typeof window === 'undefined' ? null : window.localStorage; }
  catch { return null; }
}
function validCourseKey(value: string): boolean {
  const [level, pathId, extra] = value.split(':');
  return !extra && levels.includes(level as JourneyLevel) && FOUNDATION_PATH_IDS.includes(pathId as FoundationPathId);
}
function normalizedIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is string => typeof id === 'string' && idPattern.test(id)))].slice(0, 100);
}

export function getJourneyProgress(): JourneyProgress {
  const target = storage();
  if (!target) return emptyProgress();
  try {
    const raw = target.getItem(progressStorageKey);
    if (!raw) return emptyProgress();
    const candidate: unknown = JSON.parse(raw);
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return emptyProgress();
    const record = candidate as Record<string, unknown>;
    if (record.version !== 1) return emptyProgress();
    const courses: JourneyProgress['courses'] = {};
    if (record.courses && typeof record.courses === 'object' && !Array.isArray(record.courses)) {
      for (const [key, value] of Object.entries(record.courses as Record<string, unknown>)) {
        if (!validCourseKey(key) || !value || typeof value !== 'object' || Array.isArray(value)) continue;
        const item = value as Record<string, unknown>;
        const best = item.assessmentBestScore;
        const last = item.assessmentLastScore;
        const validScore = (score: unknown): score is number => Number.isInteger(score) && (score as number) >= 0 && (score as number) <= 5;
        courses[key] = {
          completedLessonIds: normalizedIds(item.completedLessonIds),
          assessmentPassed: item.assessmentPassed === true,
          assessmentBestScore: validScore(best) ? best : null,
          // Older records only stored the best score; keep it separate from a known latest attempt.
          assessmentLastScore: validScore(last) ? last : null,
        };
      }
    }
    const projects: JourneyProgress['projects'] = {};
    if (record.projects && typeof record.projects === 'object' && !Array.isArray(record.projects)) {
      for (const level of levels) {
        const value = (record.projects as Record<string, unknown>)[level];
        if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
        const item = value as Record<string, unknown>;
        projects[level] = {
          completedStageIds: normalizedIds(item.completedStageIds),
          rubricChecked: item.rubricChecked === true,
          completed: item.completed === true,
        };
      }
    }
    return { version: 1, courses, projects };
  } catch {
    return emptyProgress();
  }
}
function updateProgress(update: (current: JourneyProgress) => JourneyProgress): boolean {
  const target = storage();
  if (!target) return false;
  try {
    target.setItem(progressStorageKey, JSON.stringify(update(getJourneyProgress())));
    return true;
  } catch {
    return false;
  }
}
export function journeyCourseKey(level: JourneyLevel, pathId: FoundationPathId): string {
  return `${level}:${pathId}`;
}
export function getJourneyCourseProgress(level: JourneyLevel, pathId: FoundationPathId, progress = getJourneyProgress()): JourneyCourseProgress {
  return progress.courses[journeyCourseKey(level, pathId)] ?? { completedLessonIds: [], assessmentPassed: false, assessmentBestScore: null, assessmentLastScore: null };
}
export function recordJourneyLessonComplete(level: JourneyLevel, pathId: FoundationPathId, lessonId: string): boolean {
  if (!idPattern.test(lessonId) || !JOURNEY_COURSES[level][pathId].lessons.some((lesson) => lesson.id === lessonId)) return false;
  return updateProgress((current) => {
    const key = journeyCourseKey(level, pathId);
    const course = current.courses[key] ?? { completedLessonIds: [], assessmentPassed: false, assessmentBestScore: null, assessmentLastScore: null };
    return { ...current, courses: { ...current.courses, [key]: { ...course, completedLessonIds: normalizedIds([...course.completedLessonIds, lessonId]) } } };
  });
}
export function recordJourneyAssessmentResult(level: JourneyLevel, pathId: FoundationPathId, score: number): boolean {
  const course = JOURNEY_COURSES[level][pathId];
  if (!Number.isInteger(score) || score < 0 || score > course.assessment.length) return false;
  return updateProgress((current) => {
    const key = journeyCourseKey(level, pathId);
    const prior = current.courses[key] ?? { completedLessonIds: [], assessmentPassed: false, assessmentBestScore: null, assessmentLastScore: null };
    const previousScore = prior.assessmentBestScore;
    const best = previousScore === null ? score : Math.max(previousScore, score);
    return { ...current, courses: { ...current.courses, [key]: {
      ...prior,
      assessmentPassed: prior.assessmentPassed || score >= course.passingScore,
      assessmentBestScore: best,
      assessmentLastScore: score,
    } } };
  });
}
export function recordJourneyProjectStageComplete(level: JourneyLevel, stageId: string): boolean {
  if (!idPattern.test(stageId)) return false;
  return updateProgress((current) => {
    const prior = current.projects[level] ?? { completedStageIds: [], rubricChecked: false, completed: false };
    return { ...current, projects: { ...current.projects, [level]: { ...prior, completedStageIds: normalizedIds([...prior.completedStageIds, stageId]) } } };
  });
}
export function recordJourneyProjectReview(level: JourneyLevel, rubricChecked: boolean, complete: boolean): boolean {
  return updateProgress((current) => {
    const prior = current.projects[level] ?? { completedStageIds: [], rubricChecked: false, completed: false };
    return { ...current, projects: { ...current.projects, [level]: { ...prior, rubricChecked, completed: prior.completed || complete } } };
  });
}

function courseLessonsComplete(level: JourneyLevel, pathId: FoundationPathId, progress: JourneyProgress): boolean {
  const course = JOURNEY_COURSES[level][pathId];
  const completed = new Set(getJourneyCourseProgress(level, pathId, progress).completedLessonIds);
  return course.lessons.every((lesson) => completed.has(lesson.id));
}
function allPathsAtLevelComplete(level: JourneyLevel, progress: JourneyProgress, requireAssessment: boolean): boolean {
  return FOUNDATION_PATH_IDS.every((pathId) => {
    const course = getJourneyCourseProgress(level, pathId, progress);
    return courseLessonsComplete(level, pathId, progress) && (!requireAssessment || course.assessmentPassed);
  });
}
export function getBeginnerPathCompletion(
  pathId: FoundationPathId,
  beginner: SessionBeginnerProgress,
  persistedCompletedIds: ReadonlySet<string>,
): JourneyGate {
  const lessons = getBeginnerLessons(pathId);
  const start = Math.max(0, Math.min(beginner.placementStartIndex[pathId] ?? 0, lessons.length - 1));
  const completed = new Set([
    ...(beginner.completedLessonIds[pathId] ?? []),
    ...persistedCompletedIds,
  ]);
  const lessonsComplete = lessons.slice(start).every((lesson) => completed.has(lesson.id));
  const assessmentPassed = beginner.assessmentPassed.includes(pathId);
  const projectComplete = beginner.projectCompleted.includes(pathId);
  const requirements = [
    { id: 'lessons', met: lessonsComplete, href: `/levels/${pathId}/beginner` },
    { id: 'assessment', met: assessmentPassed, href: `/assessment/${pathId}?level=beginner` },
    { id: 'project', met: projectComplete, href: `/levels/${pathId}/beginner/project` },
  ];
  return { unlocked: requirements.every((requirement) => requirement.met), requirements };
}
export function getJourneyCourseGate(
  level: JourneyLevel,
  pathId: FoundationPathId,
  beginner: SessionBeginnerProgress,
  persistedCompletedIds: ReadonlySet<string>,
  progress: JourneyProgress,
): JourneyGate {
  if (level === 'intermediate') return getBeginnerPathCompletion(pathId, beginner, persistedCompletedIds);
  const priorCourse = getJourneyCourseProgress('intermediate', pathId, progress);
  const requirements = [
    { id: 'prior-lessons', met: courseLessonsComplete('intermediate', pathId, progress), href: `/levels/${pathId}/intermediate` },
    { id: 'prior-assessment', met: priorCourse.assessmentPassed, href: `/levels/${pathId}/intermediate/assessment` },
    { id: 'level-project', met: allPathsAtLevelComplete('intermediate', progress, true) && (progress.projects.intermediate?.completed ?? false), href: '/levels/intermediate/project' },
  ];
  return { unlocked: requirements.every((requirement) => requirement.met), requirements };
}
export function getJourneyProjectGate(level: JourneyLevel, progress: JourneyProgress): JourneyGate {
  const requirements = FOUNDATION_PATH_IDS.flatMap((pathId) => {
    const course = getJourneyCourseProgress(level, pathId, progress);
    return [
      { id: `${pathId}:lessons`, met: courseLessonsComplete(level, pathId, progress), href: `/levels/${pathId}/${level}` },
      { id: `${pathId}:assessment`, met: course.assessmentPassed, href: `/levels/${pathId}/${level}/assessment` },
    ];
  });
  return { unlocked: requirements.every((requirement) => requirement.met), requirements };
}

export function getJourneyProjectDraft(level: JourneyLevel, initial: JourneyProjectDraft): JourneyProjectDraft {
  const target = storage();
  if (!target) return initial;
  try {
    const allRaw = target.getItem(draftStorageKey);
    if (!allRaw) return initial;
    const all: unknown = JSON.parse(allRaw);
    if (!all || typeof all !== 'object' || Array.isArray(all)) return initial;
    const candidate = (all as Record<string, unknown>)[level];
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return initial;
    const draft: JourneyProjectDraft = { ...initial };
    for (const [file, source] of Object.entries(candidate as Record<string, unknown>)) {
      if (Object.hasOwn(initial, file) && typeof source === 'string' && source.length <= 200_000) draft[file] = source;
    }
    return draft;
  } catch {
    return initial;
  }
}
export function saveJourneyProjectDraft(level: JourneyLevel, draft: JourneyProjectDraft): boolean {
  const target = storage();
  if (!target || Object.values(draft).some((source) => source.length > 200_000)) return false;
  try {
    const raw = target.getItem(draftStorageKey);
    const all = raw ? JSON.parse(raw) as Record<string, unknown> : {};
    if (!all || typeof all !== 'object' || Array.isArray(all)) return false;
    target.setItem(draftStorageKey, JSON.stringify({ ...all, [level]: draft }));
    return true;
  } catch {
    return false;
  }
}
