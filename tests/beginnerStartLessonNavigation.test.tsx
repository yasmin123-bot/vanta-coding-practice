import { act, createElement, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import BeginnerLessonPage from '../src/components/BeginnerLessonPage';
import StartLesson from '../src/components/StartLesson';
import { getBeginnerLessons } from '../src/content/beginnerCurriculum';
import { getBeginnerCourseHref, HTML_PATH_ID } from '../src/content/learningSystem';
import { messages } from '../src/i18n/messages';
import { recordSessionLessonComplete } from '../src/utils/sessionBeginnerProgress';

vi.mock('../src/auth/AuthProvider', () => ({
  useAuth: () => ({ user: null, setupState: 'ready' }),
}));

vi.mock('../src/state/StudentProgressProvider', () => ({
  useStudentProgress: () => ({ lessons: [], error: null, completeLessonQuiz: vi.fn(async () => true) }),
}));

vi.mock('../src/components/LearningHeader', () => ({ default: () => null }));

vi.mock('../src/components/LazyPracticeStudio', async () => {
  const React = await import('react');
  return {
    default: ({ onContinueToQuiz }: { onContinueToQuiz: () => void }) => React.createElement(
      'button',
      { type: 'button', 'data-testid': 'mock-continue-to-quiz', onClick: onContinueToQuiz },
      'Continue to quiz',
    ),
  };
});

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let host: HTMLDivElement | undefined;

function mount(element: ReactElement) {
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  act(() => root!.render(element));
}

function unmount() {
  if (root) act(() => root!.unmount());
  root = undefined;
  host?.remove();
  host = undefined;
}

function click(selector: string) {
  const element = host?.querySelector<HTMLButtonElement>(selector);
  if (!element) throw new Error(`Could not find control: ${selector}`);
  act(() => element.click());
}

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  unmount();
  sessionStorage.clear();
  vi.restoreAllMocks();
});

describe('Beginner StartLesson return navigation', () => {
  it('uses the Beginner course destination in the lesson and result links', () => {
    const lessons = getBeginnerLessons(HTML_PATH_ID);
    const introIndex = lessons.findIndex((lesson) => lesson.existingLessonId === 'html-introduction');
    expect(introIndex).toBeGreaterThan(0);

    for (const lesson of lessons.slice(0, introIndex)) {
      expect(recordSessionLessonComplete(HTML_PATH_ID, lesson.id)).toBe(true);
    }

    mount(createElement(BeginnerLessonPage, {
      pathId: HTML_PATH_ID,
      lessonId: lessons[introIndex].id,
      locale: 'en',
      onSwitchLocale: vi.fn(),
    }));

    const courseHref = getBeginnerCourseHref(HTML_PATH_ID);
    expect(host!.querySelector('.lesson-back-link')?.getAttribute('href')).toBe(courseHref);

    for (let step = 0; step < messages.en.lesson.learningSteps.length; step += 1) {
      click('.lesson-flow-controls .button-primary');
    }
    click('[data-testid="mock-continue-to-quiz"]');

    for (const question of messages.en.lesson.questions) {
      const correctChoice = question.choices.find((choice) => choice.id === question.correctChoiceId);
      expect(correctChoice).toBeDefined();
      const option = Array.from(host!.querySelectorAll<HTMLButtonElement>('.lesson-choice'))
        .find((button) => button.textContent?.trim() === correctChoice!.label);
      expect(option).toBeDefined();
      act(() => option!.click());
      click('.lesson-question-actions .button-primary');
    }

    expect(host!.querySelector('.learning-result-navigation a')?.getAttribute('href')).toBe(courseHref);
    expect(host!.querySelector('.lesson-back-link')?.getAttribute('href')).toBe(courseHref);
  });

  it('keeps the existing HTML fundamentals fallback when no destination is passed', () => {
    mount(createElement(StartLesson, {
      locale: 'en',
      onSwitchLocale: vi.fn(),
      onComplete: vi.fn(async () => true),
    }));

    expect(host!.querySelector('.lesson-back-link')?.getAttribute('href')).toBe('/paths/html-fundamentals');
  });
});
