import { HTML_LESSON_IDS, type HtmlLessonId } from '../content/learningSystem';

const STORAGE_KEY = 'vanta-learning-progress-v1';
const validLessonIds = new Set<string>(HTML_LESSON_IDS);

export type SessionProgress = {
  completedLessonIds: HtmlLessonId[];
};

function emptyProgress(): SessionProgress {
  return { completedLessonIds: [] };
}

export function readSessionProgress(): SessionProgress {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !('completedLessonIds' in parsed)) {
      return emptyProgress();
    }

    const candidate = (parsed as { completedLessonIds?: unknown }).completedLessonIds;
    if (!Array.isArray(candidate)) return emptyProgress();

    const completedLessonIds = [...new Set(candidate.filter(
      (id): id is HtmlLessonId => typeof id === 'string' && validLessonIds.has(id),
    ))];

    return { completedLessonIds };
  } catch {
    return emptyProgress();
  }
}

export function markLessonCompleted(lessonId: HtmlLessonId): SessionProgress {
  const current = readSessionProgress();
  const completedLessonIds = current.completedLessonIds.includes(lessonId)
    ? current.completedLessonIds
    : [...current.completedLessonIds, lessonId];
  const progress = { completedLessonIds };

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Learning still completes for the current screen when session storage is unavailable.
  }

  return progress;
}
