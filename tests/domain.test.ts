// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  HTML_LESSON_IDS,
  HTML_LESSON_ROUTES,
  FOUNDATION_LESSON_IDS,
  FOUNDATION_LESSON_IDS_BY_PATH,
  CSS_PATH_ID,
  JAVASCRIPT_PATH_ID,
  getHtmlLessonHref,
  getLearningPathHref,
  resolveVantaRoute,
  type HtmlLessonId,
} from '../src/content/learningSystem';
import { practiceExercises } from '../src/content/practiceExercises';
import { messages, type Locale } from '../src/i18n/messages';
import { summarizeFoundationLearningProgress, summarizeHtmlLearningProgress, type LessonProgressSummaryInput } from '../src/utils/learningProgress';
import { validatePractice } from '../src/utils/practiceValidation';
import { createQuizChoiceOrder, getOrderedQuizChoices } from '../src/utils/quizChoices';
import { safeReturnPath } from '../src/utils/safeReturnPath';

afterEach(() => {
  vi.restoreAllMocks();
});

function getQuestions(locale: Locale, lessonId: HtmlLessonId) {
  const copy = messages[locale];
  return lessonId === 'html-introduction'
    ? copy.lesson.questions
    : copy.learningSystem.lessons[lessonId].questions;
}

function getCheckMap(lessonId: HtmlLessonId, html: string): Record<string, boolean> {
  return Object.fromEntries(validatePractice(lessonId, html).map(({ id, passed }) => [id, passed]));
}

function parseWithJsdom(html: string): Document {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  expect(parsed.querySelector('parsererror')).toBeNull();
  return parsed;
}

describe('HTML learning catalog and localized quiz contracts', () => {
  it('keeps exactly five lesson IDs aligned across routes, exercises, and Arabic/English copy', () => {
    expect(HTML_LESSON_IDS).toHaveLength(5);
    expect(Object.keys(HTML_LESSON_ROUTES)).toEqual([...HTML_LESSON_IDS]);
    expect(Object.keys(practiceExercises)).toEqual([...FOUNDATION_LESSON_IDS]);
    expect(HTML_LESSON_IDS.every((lessonId) => lessonId in practiceExercises)).toBe(true);

    for (const lessonId of HTML_LESSON_IDS) {
      expect(getHtmlLessonHref(lessonId)).toBe(HTML_LESSON_ROUTES[lessonId]);
      expect(resolveVantaRoute(getHtmlLessonHref(lessonId))).toEqual({ kind: 'lesson', lessonId });

      const arabicQuestions = getQuestions('ar', lessonId);
      const englishQuestions = getQuestions('en', lessonId);
      expect(arabicQuestions.map(({ id }) => id)).toEqual(englishQuestions.map(({ id }) => id));
      expect(new Set(arabicQuestions.map(({ id }) => id)).size).toBe(arabicQuestions.length);
      expect(new Set(englishQuestions.map(({ id }) => id)).size).toBe(englishQuestions.length);
    }

    expect(getLearningPathHref('html-fundamentals')).toBe('/paths/html-fundamentals');
  });

  it('gives every Arabic and English question four unique choices and one correct choice', () => {
    for (const locale of ['ar', 'en'] as const) {
      for (const lessonId of HTML_LESSON_IDS) {
        for (const question of getQuestions(locale, lessonId)) {
          const choiceIds = question.choices.map(({ id }) => id);
          expect(choiceIds, `${locale}/${lessonId}/${question.id}`).toHaveLength(4);
          expect(new Set(choiceIds), `${locale}/${lessonId}/${question.id}`).toHaveProperty('size', 4);
          expect(choiceIds.filter((id) => id === question.correctChoiceId)).toHaveLength(1);
        }
      }
    }
  });

  it('rejects malformed quiz identities instead of silently producing unsafe answer orders', () => {
    const validQuestion = {
      id: 'valid-question',
      choices: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }],
      correctChoiceId: 'a',
    } as const;

    expect(() => createQuizChoiceOrder([validQuestion, validQuestion])).toThrow(/Duplicate quiz question id/);
    expect(() => createQuizChoiceOrder([{
      ...validQuestion,
      choices: [{ id: 'a' }, { id: 'b' }, { id: 'c' }],
    }])).toThrow(/four unique choices/);
    expect(() => createQuizChoiceOrder([{
      ...validQuestion,
      choices: [{ id: 'a' }, { id: 'a' }, { id: 'c' }, { id: 'd' }],
    }])).toThrow(/four unique choices/);
    expect(() => createQuizChoiceOrder([{
      ...validQuestion,
      correctChoiceId: 'missing',
    }])).toThrow(/exactly one correct choice/);
  });

  it('produces a repeatable shuffle for a fixed random stream and distributes correct positions', () => {
    const questions = getQuestions('en', 'html-introduction').map((question) => ({
      id: question.id,
      choices: question.choices.map(({ id }) => ({ id })),
      correctChoiceId: question.correctChoiceId,
    }));
    const randomValues = [0.12, 0.87, 0.34, 0.56, 0.78, 0.21, 0.43, 0.65, 0.91, 0.08, 0.29, 0.51, 0.73, 0.95, 0.17, 0.39, 0.61, 0.83, 0.04, 0.26, 0.48, 0.70, 0.92, 0.14, 0.36];
    const randomSpy = vi.spyOn(Math, 'random');
    const useFixedRandomStream = () => {
      let index = 0;
      randomSpy.mockImplementation(() => randomValues[index++ % randomValues.length]);
    };

    useFixedRandomStream();
    const firstOrder = createQuizChoiceOrder(questions);
    useFixedRandomStream();
    const secondOrder = createQuizChoiceOrder(questions);

    expect(secondOrder).toEqual(firstOrder);
    for (const question of questions) {
      const order = firstOrder[question.id];
      expect(order).toHaveLength(4);
      expect(new Set(order)).toHaveProperty('size', 4);
      expect(order).toEqual(expect.arrayContaining(question.choices.map(({ id }) => id)));
      expect(order.indexOf(question.correctChoiceId)).toBeGreaterThanOrEqual(0);
      expect(order.indexOf(question.correctChoiceId)).toBeLessThan(4);
    }

    const correctPositions = questions.map((question) => (
      firstOrder[question.id].indexOf(question.correctChoiceId)
    ));
    expect(new Set(correctPositions).size).toBeGreaterThan(1);
  });

  it('returns the stored order only when it is a complete, known permutation', () => {
    const choices = [
      { id: 'first', label: 'First' },
      { id: 'second', label: 'Second' },
      { id: 'third', label: 'Third' },
      { id: 'fourth', label: 'Fourth' },
    ];

    expect(getOrderedQuizChoices(choices, ['third', 'first', 'fourth', 'second']).map(({ id }) => id))
      .toEqual(['third', 'first', 'fourth', 'second']);
    expect(getOrderedQuizChoices(choices, ['third', 'first', 'unknown', 'second']).map(({ id }) => id))
      .toEqual(choices.map(({ id }) => id));
    expect(getOrderedQuizChoices(choices, ['third', 'first', 'third', 'second']).map(({ id }) => id))
      .toEqual(choices.map(({ id }) => id));
    expect(getOrderedQuizChoices(choices, undefined).map(({ id }) => id))
      .toEqual(choices.map(({ id }) => id));
  });

  it('keeps all exercise starters unresolved and safe to open as blank practice editors', () => {
    for (const lessonId of HTML_LESSON_IDS) {
      const exercise = practiceExercises[lessonId];
      expect(exercise.starterHtml.trim(), lessonId).toBe('');
      expect(exercise.starterCss.trim(), lessonId).not.toBe('');
      expect(exercise.starterJs.trim(), lessonId).not.toBe('');
    }
  });

  it('preserves the first exercise brand migration: Mabda is new, VANTA remains accepted', () => {
    const heading = '<h1>Hello, Developer!</h1>';
    const mabdaHtml = `${heading}<p>Welcome to Mabda.</p>`;
    const legacyVantaHtml = `${heading}<p>Welcome to VANTA.</p>`;
    const wrongBrandHtml = `${heading}<p>Welcome to another platform.</p>`;

    expect(getCheckMap('html-introduction', mabdaHtml)).toEqual({ heading: true, paragraph: true, 'paragraph-order': true });
    expect(getCheckMap('html-introduction', legacyVantaHtml)).toEqual({ heading: true, paragraph: true, 'paragraph-order': true });
    expect(getCheckMap('html-introduction', wrongBrandHtml)).toEqual({ heading: true, paragraph: false, 'paragraph-order': false });
  });

  it.each([
    {
      lessonId: 'html-introduction' as const,
      valid: '<h1>Hello, Developer!</h1><p>Welcome to Mabda.</p>',
      invalid: '<h1>Hello, Developer!</h1><p>Welcome to another platform.</p>',
      validChecks: { heading: true, paragraph: true, 'paragraph-order': true },
      invalidChecks: { heading: true, paragraph: false, 'paragraph-order': false },
    },
    {
      lessonId: 'html-headings-paragraphs' as const,
      valid: '<h1>Page title</h1><h2>Section title</h2><p>Readable body text.</p>',
      invalid: '<h1>Page title</h1><p>Readable body text.</p>',
      validChecks: { heading: true, subheading: true, paragraph: true },
      invalidChecks: { heading: true, subheading: false, paragraph: true },
    },
    {
      lessonId: 'html-links-navigation' as const,
      valid: '<a href="/about">About the project</a>',
      invalid: '<a href="javascript:alert(1)">click here</a>',
      validChecks: { 'link-element': true, 'link-href': true, 'link-text': true },
      invalidChecks: { 'link-element': true, 'link-href': false, 'link-text': false },
    },
    {
      lessonId: 'html-images-attributes' as const,
      valid: '<img src="/images/rose.jpg" alt="A red rose in a glass vase">',
      invalid: '<img src="" alt="Image">',
      validChecks: { 'image-src': true, 'image-alt': true },
      invalidChecks: { 'image-src': false, 'image-alt': false },
    },
    {
      lessonId: 'html-first-page' as const,
      valid: '<!doctype html><html><head><title>My first page</title></head><body><h1>Hello</h1><p>Welcome.</p></body></html>',
      invalid: '<html><head><title>Missing doctype</title></head><body>Visible content</body></html>',
      validChecks: { doctype: true, head: true, title: true, body: true },
      invalidChecks: { doctype: false, head: false, title: false, body: false },
    },
  ])('validates positive and negative $lessonId practice HTML through jsdom parsing', ({ lessonId, valid, invalid, validChecks, invalidChecks }) => {
    const validDocument = parseWithJsdom(valid);
    const invalidDocument = parseWithJsdom(invalid);
    expect(validDocument).toBeInstanceOf(Document);
    expect(invalidDocument).toBeInstanceOf(Document);
    expect(getCheckMap(lessonId, valid)).toEqual(validChecks);
    expect(getCheckMap(lessonId, invalid)).toEqual(invalidChecks);
  });
});

describe('pure learning progress summary', () => {
  it('returns an untouched empty-path state with the first lesson as the recommendation', () => {
    const summary = summarizeHtmlLearningProgress([], false);

    expect([...summary.completedLessonIds]).toEqual([]);
    expect(summary.completedLessonCount).toBe(0);
    expect(summary.pathStarted).toBe(false);
    expect(summary.pathCompleted).toBe(false);
    expect(summary.lastOpenedLessonId).toBeNull();
    expect(summary.resumeLessonId).toBe('html-introduction');
    expect(summary.recommendedLessonId).toBe('html-introduction');
  });

  it('deduplicates completed lessons, ignores unknown rows, and resumes the newest incomplete lesson', () => {
    const rows: LessonProgressSummaryInput[] = [
      {
        lesson_id: 'html-introduction',
        completed_at: '2026-10-01T10:00:00.000Z',
        last_opened_at: '2026-10-01T10:00:00.000Z',
      },
      {
        lesson_id: 'html-introduction',
        completed_at: null,
        last_opened_at: '2026-10-05T10:00:00.000Z',
      },
      {
        lesson_id: 'html-headings-paragraphs',
        completed_at: null,
        last_opened_at: '2026-10-04T10:00:00.000Z',
      },
      {
        lesson_id: 'unknown-lesson' as LessonProgressSummaryInput['lesson_id'],
        completed_at: '2026-10-06T10:00:00.000Z',
        last_opened_at: '2026-10-06T10:00:00.000Z',
      },
    ];

    const summary = summarizeHtmlLearningProgress(rows, true);

    expect([...summary.completedLessonIds]).toEqual(['html-introduction']);
    expect(summary.completedLessonCount).toBe(1);
    expect(summary.pathStarted).toBe(true);
    expect(summary.pathCompleted).toBe(false);
    expect(summary.lastOpenedLessonId).toBe('html-introduction');
    expect(summary.resumeLessonId).toBe('html-introduction');
    expect(summary.recommendedLessonId).toBe('html-headings-paragraphs');
  });

  it('marks the path complete only after all five lessons are completed', () => {
    const rows: LessonProgressSummaryInput[] = HTML_LESSON_IDS.map((lessonId, index) => ({
      lesson_id: lessonId,
      completed_at: `2026-10-0${index + 1}T10:00:00.000Z`,
      last_opened_at: `2026-10-0${index + 1}T10:00:00.000Z`,
    }));

    const summary = summarizeHtmlLearningProgress(rows, true);

    expect(summary.completedLessonCount).toBe(HTML_LESSON_IDS.length);
    expect(summary.pathCompleted).toBe(true);
    expect(summary.recommendedLessonId).toBeNull();
    expect(summary.lastOpenedLessonId).toBe('html-first-page');
    expect(summary.resumeLessonId).toBe('html-first-page');
  });

  it.each([
    [CSS_PATH_ID, 8],
    [JAVASCRIPT_PATH_ID, 9],
  ] as const)('summarizes an untouched and fully completed %s path with %i catalog lessons', (pathId, lessonCount) => {
    const lessonIds = FOUNDATION_LESSON_IDS_BY_PATH[pathId];
    const empty = summarizeFoundationLearningProgress(pathId, [], false);

    expect(lessonIds).toHaveLength(lessonCount);
    expect([...empty.completedLessonIds]).toEqual([]);
    expect(empty.completedLessonCount).toBe(0);
    expect(empty.pathStarted).toBe(false);
    expect(empty.pathCompleted).toBe(false);
    expect(empty.lastOpenedLessonId).toBeNull();
    expect(empty.resumeLessonId).toBe(lessonIds[0]);
    expect(empty.recommendedLessonId).toBe(lessonIds[0]);

    const completedRows: LessonProgressSummaryInput[] = lessonIds.map((lessonId, index) => ({
      lesson_id: lessonId,
      completed_at: `2026-10-${String(index + 1).padStart(2, '0')}T10:00:00.000Z`,
      last_opened_at: `2026-10-${String(index + 1).padStart(2, '0')}T10:00:00.000Z`,
    }));
    const complete = summarizeFoundationLearningProgress(pathId, completedRows, true);

    expect([...complete.completedLessonIds]).toEqual([...lessonIds]);
    expect(complete.completedLessonCount).toBe(lessonCount);
    expect(complete.pathStarted).toBe(true);
    expect(complete.pathCompleted).toBe(true);
    expect(complete.lastOpenedLessonId).toBe(lessonIds[lessonCount - 1]);
    expect(complete.resumeLessonId).toBe(lessonIds[lessonCount - 1]);
    expect(complete.recommendedLessonId).toBeNull();
  });
});

describe('safe return paths', () => {
  it('accepts known app routes while rejecting open redirects and auth-only routes', () => {
    expect(safeReturnPath('/')).toBe('/');
    expect(safeReturnPath('/lesson/start?from=practice')).toBe('/lesson/start');
    expect(safeReturnPath('/paths/html-fundamentals/')).toBe('/paths/html-fundamentals/');
    expect(safeReturnPath('/login')).toBe('/dashboard');
    expect(safeReturnPath('/not-a-real-route')).toBe('/dashboard');
    expect(safeReturnPath('//evil.example/path')).toBe('/dashboard');
    expect(safeReturnPath('https://evil.example/path')).toBe('/dashboard');
    expect(safeReturnPath('/lesson/start\\evil')).toBe('/dashboard');
    expect(safeReturnPath(null, '/')).toBe('/');
  });
});
