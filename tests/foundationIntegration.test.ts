import { describe, expect, it } from 'vitest';
import {
  CSS_LESSON_IDS,
  FOUNDATION_LESSON_IDS,
  FOUNDATION_LESSON_IDS_BY_PATH,
  FOUNDATION_PATH_IDS,
  HTML_LESSON_IDS,
  JAVASCRIPT_LESSON_IDS,
} from '../src/content/learningSystem';
import { practiceExercises } from '../src/content/practiceExercises';
import { validatePractice } from '../src/utils/practiceValidation';
import { countCompletedFoundationLessons, summarizeFoundationLearningProgress } from '../src/utils/learningProgress';

describe('Foundation integration', () => {
  it('maps every active lesson to a language-specific practice exercise', () => {
    expect(FOUNDATION_PATH_IDS).toHaveLength(3);
    expect(FOUNDATION_LESSON_IDS).toHaveLength(22);
    expect(Object.keys(practiceExercises)).toHaveLength(22);
    expect(HTML_LESSON_IDS.every((id) => practiceExercises[id].language === 'html')).toBe(true);
    expect(CSS_LESSON_IDS.every((id) => practiceExercises[id].language === 'css')).toBe(true);
    expect(JAVASCRIPT_LESSON_IDS.every((id) => practiceExercises[id].language === 'javascript')).toBe(true);
  });

  it('keeps HTML validation working and validates CSS/JavaScript requirements structurally', () => {
    expect(validatePractice('html-headings-paragraphs', '<h1>Garden</h1><h2>Flowers</h2><p>Spring is here.</p>').every((item) => item.passed)).toBe(true);

    const css = '.card { width: 100%; padding: 16px; } @media (min-width: 600px) { .card { width: 60%; } }';
    expect(validatePractice('css-responsive', { html_code: '<article class="card">Card</article>', css_code: css, js_code: '' }).every((item) => item.passed)).toBe(true);
    expect(validatePractice('css-responsive', { html_code: '', css_code: '.card { width: 80%; }', js_code: '' }).some((item) => item.passed)).toBe(false);

    const js = 'const courseName = "JavaScript"; let lessonCount = 1; lessonCount = 2;';
    expect(validatePractice('js-variables', { html_code: '', css_code: '', js_code: js }).every((item) => item.passed)).toBe(true);
    expect(validatePractice('js-variables', { html_code: '', css_code: '', js_code: 'const courseName = "Python"; let lessonCount = 1; lessonCount = 2;' }).some((item) => !item.passed)).toBe(true);
  });

  it('derives started, resume, completion, and counts from only the selected persisted path rows', () => {
    const htmlRow = { lesson_id: 'html-introduction' as const, completed_at: '2026-10-29T10:00:00Z', last_opened_at: '2026-10-29T10:00:00Z' };
    const cssRow = { lesson_id: 'css-what-is-css' as const, completed_at: '2026-10-29T11:00:00Z', last_opened_at: '2026-10-29T11:00:00Z' };
    const jsRows = FOUNDATION_LESSON_IDS_BY_PATH['javascript-fundamentals'].map((lesson_id) => ({
      lesson_id,
      completed_at: '2026-10-29T12:00:00Z',
      last_opened_at: '2026-10-29T12:00:00Z',
    }));

    const freshCss = summarizeFoundationLearningProgress('css-fundamentals', [], false);
    expect(freshCss.pathStarted).toBe(false);
    expect(freshCss.completedLessonCount).toBe(0);
    expect(freshCss.resumeLessonId).toBe('css-what-is-css');

    const inProgressCss = summarizeFoundationLearningProgress('css-fundamentals', [htmlRow, cssRow], true);
    expect(inProgressCss.completedLessonCount).toBe(1);
    expect(inProgressCss.pathCompleted).toBe(false);
    expect(inProgressCss.resumeLessonId).toBe('css-selectors');

    const completedJs = summarizeFoundationLearningProgress('javascript-fundamentals', jsRows, true);
    expect(completedJs.completedLessonCount).toBe(9);
    expect(completedJs.pathCompleted).toBe(true);
    expect(completedJs.recommendedLessonId).toBeNull();
  });

  it('counts only distinct lessons with persisted completion timestamps for profile milestones', () => {
    const rows = [
      { lesson_id: 'html-introduction' as const, completed_at: '2026-10-29T10:00:00Z', last_opened_at: '2026-10-29T10:00:00Z' },
      { lesson_id: 'html-introduction' as const, completed_at: '2026-10-29T10:30:00Z', last_opened_at: '2026-10-29T10:30:00Z' },
      { lesson_id: 'css-what-is-css' as const, completed_at: null, last_opened_at: '2026-10-29T11:00:00Z' },
      { lesson_id: 'js-what-is-javascript' as const, completed_at: '2026-10-29T12:00:00Z', last_opened_at: '2026-10-29T12:00:00Z' },
    ];

    expect(countCompletedFoundationLessons(rows)).toBe(2);
  });
});
