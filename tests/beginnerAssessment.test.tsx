import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import BeginnerAssessmentPage from '../src/components/BeginnerAssessmentPage';
import { getBeginnerLessons } from '../src/content/beginnerCurriculum';
import { HTML_PATH_ID } from '../src/content/learningSystem';
import { getSessionBeginnerProgress, recordSessionAssessmentPassed, recordSessionLessonComplete, BEGINNER_ASSESSMENT_QUESTION_COUNT } from '../src/utils/sessionBeginnerProgress';

vi.mock('../src/state/StudentProgressProvider', () => ({
  useStudentProgress: () => ({ lessons: [] }),
}));

vi.mock('../src/components/LearningHeader', () => ({
  default: () => null,
}));

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const progressKey = 'mabda-beginner-session-progress-v1';
let root: Root | undefined;
let host: HTMLDivElement | undefined;

function sampledQuizzes() {
  const lessons = getBeginnerLessons(HTML_PATH_ID).filter((lesson) => lesson.newContent);
  return Array.from({ length: BEGINNER_ASSESSMENT_QUESTION_COUNT }, (_, index) => {
    const lessonIndex = Math.min(
      lessons.length - 1,
      Math.floor(((index + 0.5) * lessons.length) / BEGINNER_ASSESSMENT_QUESTION_COUNT),
    );
    return lessons[lessonIndex].newContent!.quiz;
  });
}

function completeCourseInSession() {
  getBeginnerLessons(HTML_PATH_ID).forEach((lesson) => {
    expect(recordSessionLessonComplete(HTML_PATH_ID, lesson.id)).toBe(true);
  });
}

function mountAssessment() {
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  act(() => root!.render(createElement(BeginnerAssessmentPage, {
    pathId: HTML_PATH_ID,
    locale: 'en',
    onSwitchLocale: vi.fn(),
  })));
}

function unmountAssessment() {
  if (root) act(() => root!.unmount());
  root = undefined;
  host?.remove();
  host = undefined;
}

function answerAndAdvance(quiz: ReturnType<typeof sampledQuizzes>[number], choiceId: string) {
  const choice = quiz.choices.find((item) => item.id === choiceId);
  if (!choice) throw new Error(`Missing test choice: ${choiceId}`);
  const option = Array.from(host!.querySelectorAll<HTMLButtonElement>('.learning-question-options button'))
    .find((button) => button.textContent?.trim() === choice.en);
  if (!option) throw new Error(`Could not find assessment option: ${choice.en}`);
  act(() => option.click());
  const next = host!.querySelector<HTMLButtonElement>('.learning-quiz-feedback button');
  if (!next) throw new Error('Assessment did not show its next-question control.');
  act(() => next.click());
}

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  unmountAssessment();
  sessionStorage.clear();
  vi.restoreAllMocks();
});

describe('Beginner assessment result persistence', () => {
  it('stores a passing score and shows that same score after reopening the assessment', () => {
    completeCourseInSession();
    mountAssessment();

    const quizzes = sampledQuizzes();
    for (const quiz of quizzes) {
      expect(host!.querySelector('#final-question-title')?.textContent).toBe(quiz.promptEn);
      answerAndAdvance(quiz, quiz.correctChoiceId);
    }

    expect(getSessionBeginnerProgress().assessmentPassed).toContain(HTML_PATH_ID);
    expect(getSessionBeginnerProgress().assessmentScores[HTML_PATH_ID]).toBe(BEGINNER_ASSESSMENT_QUESTION_COUNT);
    expect(host!.textContent).toContain(`Score: ${BEGINNER_ASSESSMENT_QUESTION_COUNT} of ${BEGINNER_ASSESSMENT_QUESTION_COUNT}.`);

    unmountAssessment();
    mountAssessment();

    expect(host!.textContent).toContain(`Score: ${BEGINNER_ASSESSMENT_QUESTION_COUNT} of ${BEGINNER_ASSESSMENT_QUESTION_COUNT}.`);
    expect(host!.textContent).not.toContain('Score: 0 of 10.');
    expect(host!.querySelector('a.button-primary')?.getAttribute('href')).toBe('/levels/html-fundamentals/beginner/project');
  });

  it('keeps legacy pass status without displaying a fabricated zero score', () => {
    const completedLessonIds = getBeginnerLessons(HTML_PATH_ID).map((lesson) => lesson.id);
    sessionStorage.setItem(progressKey, JSON.stringify({
      version: 1,
      completedLessonIds: { [HTML_PATH_ID]: completedLessonIds },
      assessmentPassed: [HTML_PATH_ID],
    }));

    mountAssessment();

    expect(host!.textContent).toContain('You passed the final assessment.');
    expect(host!.textContent).toContain('You passed earlier, but this saved session does not include the score.');
    expect(host!.textContent).not.toContain('Score: 0 of 10.');
    expect(getSessionBeginnerProgress().assessmentPassed).toContain(HTML_PATH_ID);
    expect(getSessionBeginnerProgress().assessmentScores[HTML_PATH_ID]).toBeUndefined();
  });

  it('starts a failed retake from question one with a fresh answer set', () => {
    completeCourseInSession();
    mountAssessment();

    const quizzes = sampledQuizzes();
    for (const quiz of quizzes) {
      expect(host!.querySelector('#final-question-title')?.textContent).toBe(quiz.promptEn);
      const incorrectChoice = quiz.choices.find((item) => item.id !== quiz.correctChoiceId);
      expect(incorrectChoice).toBeDefined();
      answerAndAdvance(quiz, incorrectChoice!.id);
    }

    expect(host!.textContent).toContain('Score: 0 of 10 (0%).');
    const retry = Array.from(host!.querySelectorAll<HTMLButtonElement>('button'))
      .find((button) => button.textContent?.trim() === 'Retry assessment');
    expect(retry).toBeDefined();
    act(() => retry!.click());

    expect(host!.querySelector('#final-question-title')?.textContent).toBe(quizzes[0].promptEn);
    expect(host!.querySelector('.learning-quiz-feedback')).toBeNull();
    expect(getSessionBeginnerProgress().assessmentPassed).not.toContain(HTML_PATH_ID);
    expect(getSessionBeginnerProgress().assessmentScores[HTML_PATH_ID]).toBeUndefined();
  });
});
