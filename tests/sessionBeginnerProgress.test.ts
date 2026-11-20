import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  clearSessionBeginnerProgress,
  BEGINNER_ASSESSMENT_PASSING_SCORE,
  BEGINNER_ASSESSMENT_QUESTION_COUNT,
  getBeginnerLessonAccess,
  getBeginnerUnlockableIndex,
  getSessionBeginnerProgress,
  recordSessionAssessmentPassed,
  recordSessionExerciseComplete,
  recordSessionLessonComplete,
  recordSessionProjectCompleted,
  setSessionPlacementStart,
} from '../src/utils/sessionBeginnerProgress';
import { HTML_PATH_ID } from '../src/content/learningSystem';

const lessons = ['html-01', 'html-02', 'html-03', 'html-04'];

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  sessionStorage.clear();
});

describe('session-only beginner progress', () => {
  it('starts empty and records completions only in tab-scoped sessionStorage', () => {
    expect(getSessionBeginnerProgress().completedLessonIds[HTML_PATH_ID]).toBeUndefined();
    expect(recordSessionLessonComplete(HTML_PATH_ID, lessons[0])).toBe(true);
    expect(getSessionBeginnerProgress().completedLessonIds[HTML_PATH_ID]).toEqual([lessons[0]]);
    expect(localStorage.length).toBe(0);
  });

  it('unlocks lessons sequentially and keeps an incomplete prerequisite locked', () => {
    expect(getBeginnerLessonAccess(HTML_PATH_ID, lessons, lessons[0])).toBe('available');
    expect(getBeginnerLessonAccess(HTML_PATH_ID, lessons, lessons[1])).toBe('locked');
    expect(recordSessionLessonComplete(HTML_PATH_ID, lessons[0])).toBe(true);
    expect(getBeginnerLessonAccess(HTML_PATH_ID, lessons, lessons[1])).toBe('available');
    expect(getBeginnerLessonAccess(HTML_PATH_ID, lessons, lessons[2])).toBe('locked');
  });

  it('uses only a consecutive mastered placement band as the starting point', () => {
    expect(setSessionPlacementStart(HTML_PATH_ID, 2)).toBe(true);
    const progress = getSessionBeginnerProgress();
    expect(getBeginnerLessonAccess(HTML_PATH_ID, lessons, lessons[0], new Set(), progress)).toBe('review');
    expect(getBeginnerLessonAccess(HTML_PATH_ID, lessons, lessons[2], new Set(), progress)).toBe('available');
    expect(getBeginnerLessonAccess(HTML_PATH_ID, lessons, lessons[3], new Set(), progress)).toBe('locked');
    expect(getBeginnerUnlockableIndex(HTML_PATH_ID, lessons, new Set(), progress)).toBe(2);
  });

  it('does not unlock the next lesson when only the practical exercise is checked', () => {
    expect(recordSessionExerciseComplete(HTML_PATH_ID, lessons[0])).toBe(true);
    expect(getSessionBeginnerProgress().completedExerciseIds[HTML_PATH_ID]).toEqual([lessons[0]]);
    expect(getSessionBeginnerProgress().completedLessonIds[HTML_PATH_ID]).toBeUndefined();
    expect(getBeginnerLessonAccess(HTML_PATH_ID, lessons, lessons[1])).toBe('locked');
    expect(getBeginnerUnlockableIndex(HTML_PATH_ID, lessons)).toBe(0);
  });

  it('combines server-confirmed legacy completion with tab progress without writing server state', () => {
    const persisted = new Set([lessons[0]]);
    expect(getBeginnerLessonAccess(HTML_PATH_ID, lessons, lessons[1], persisted)).toBe('available');
    expect(getBeginnerUnlockableIndex(HTML_PATH_ID, lessons, persisted)).toBe(1);
  });

  it('records end-of-level checks idempotently in the current tab only', () => {
    expect(recordSessionAssessmentPassed(HTML_PATH_ID, 9)).toBe(true);
    expect(recordSessionAssessmentPassed(HTML_PATH_ID, 9)).toBe(true);
    expect(recordSessionProjectCompleted(HTML_PATH_ID)).toBe(true);
    const progress = getSessionBeginnerProgress();
    expect(progress.assessmentPassed).toEqual([HTML_PATH_ID]);
    expect(progress.assessmentScores[HTML_PATH_ID]).toBe(9);
    expect(progress.projectCompleted).toEqual([HTML_PATH_ID]);
    expect(localStorage.length).toBe(0);
  });

  it('rejects passing scores outside the assessment range or below its passing threshold', () => {
    expect(recordSessionAssessmentPassed(HTML_PATH_ID, BEGINNER_ASSESSMENT_PASSING_SCORE - 1)).toBe(false);
    expect(recordSessionAssessmentPassed(HTML_PATH_ID, BEGINNER_ASSESSMENT_QUESTION_COUNT + 1)).toBe(false);
    expect(recordSessionAssessmentPassed(HTML_PATH_ID, 8.5)).toBe(false);
    expect(getSessionBeginnerProgress().assessmentPassed).toEqual([]);
    expect(getSessionBeginnerProgress().assessmentScores[HTML_PATH_ID]).toBeUndefined();
  });

  it('keeps legacy pass status but does not invent a score when old session data lacks one', () => {
    sessionStorage.setItem('mabda-beginner-session-progress-v1', JSON.stringify({
      version: 1,
      assessmentPassed: [HTML_PATH_ID],
    }));
    const progress = getSessionBeginnerProgress();
    expect(progress.assessmentPassed).toEqual([HTML_PATH_ID]);
    expect(progress.assessmentScores[HTML_PATH_ID]).toBeUndefined();
  });

  it('rejects corrupt storage and invalid placement indices safely', () => {
    sessionStorage.setItem('mabda-beginner-session-progress-v1', '{invalid');
    expect(getSessionBeginnerProgress().assessmentPassed).toEqual([]);
    expect(setSessionPlacementStart(HTML_PATH_ID, -1)).toBe(false);
    expect(setSessionPlacementStart(HTML_PATH_ID, 50)).toBe(false);
  });

  it('clears only the explicit session progress key', () => {
    sessionStorage.setItem('unrelated', 'preserve');
    recordSessionLessonComplete(HTML_PATH_ID, lessons[0]);
    expect(clearSessionBeginnerProgress()).toBe(true);
    expect(getSessionBeginnerProgress().completedLessonIds[HTML_PATH_ID]).toBeUndefined();
    expect(sessionStorage.getItem('unrelated')).toBe('preserve');
  });
});
