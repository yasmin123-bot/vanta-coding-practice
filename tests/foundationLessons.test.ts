import { describe, expect, it } from 'vitest';
import {
  CSS_LESSON_IDS,
  FOUNDATION_LESSON_IDS,
  JAVASCRIPT_LESSON_IDS,
} from '../src/content/learningSystem';
import {
  FOUNDATION_LESSONS_BY_ID,
  type FoundationLesson,
  type FoundationValidationRule,
} from '../src/content/foundationLessons';
import { validateAstPractice } from '../src/utils/astPracticeValidation';

const lesson = (id: string) => FOUNDATION_LESSONS_BY_ID[id as keyof typeof FOUNDATION_LESSONS_BY_ID];
const rule = (item: FoundationLesson, id: string): FoundationValidationRule => {
  const found = item.validation_rules.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`Missing validation rule ${id} in ${item.id}`);
  return found;
};
const hasArabic = (value: string) => /[\u0600-\u06ff]/u.test(value);
const removeInlineCode = (value: string) => value.replace(/`[^`]*`/gu, '');

describe('Foundation lesson content', () => {
  it('contains exactly all listed CSS and JavaScript lessons, in path order', () => {
    const ids = Object.keys(FOUNDATION_LESSONS_BY_ID);
    expect(ids).toHaveLength(17);
    expect(ids).toEqual([...CSS_LESSON_IDS, ...JAVASCRIPT_LESSON_IDS]);
    expect(ids).toEqual(FOUNDATION_LESSON_IDS.filter((id) => id.startsWith('css-') || id.startsWith('js-')));
    expect(CSS_LESSON_IDS).toHaveLength(8);
    expect(JAVASCRIPT_LESSON_IDS).toHaveLength(9);
    expect(Object.values(FOUNDATION_LESSONS_BY_ID).filter((item) => item.path_id === 'css-fundamentals')).toHaveLength(8);
    expect(Object.values(FOUNDATION_LESSONS_BY_ID).filter((item) => item.path_id === 'javascript-fundamentals')).toHaveLength(9);
  });

  it('provides independent Arabic and English learning copy and non-solution starters', () => {
    for (const item of Object.values(FOUNDATION_LESSONS_BY_ID)) {
      expect(item.steps.length, item.id).toBeGreaterThanOrEqual(3);
      expect(item.objective_ar).not.toBe(item.objective_en);
      expect(item.outcome_ar).not.toBe(item.outcome_en);
      expect(item.practice_ar).not.toBe(item.practice_en);
      expect(item.title_ar).not.toBe(item.title_en);
      for (const [ar, en] of [
        [item.title_ar, item.title_en],
        [item.objective_ar, item.objective_en],
        [item.outcome_ar, item.outcome_en],
        [item.practice_ar, item.practice_en],
      ]) {
        expect(hasArabic(ar), `${item.id}: Arabic copy missing Arabic`).toBe(true);
        expect(hasArabic(en), `${item.id}: Arabic leaked into English copy`).toBe(false);
      }
      for (const explanation of item.code_explanation) {
        expect(explanation.why_ar).not.toBe(explanation.why_en);
        expect(hasArabic(explanation.why_ar)).toBe(true);
        expect(hasArabic(explanation.why_en)).toBe(false);
      }
      const assertEnglishFieldsAreEnglish = (value: unknown): void => {
        if (Array.isArray(value)) value.forEach(assertEnglishFieldsAreEnglish);
        else if (value && typeof value === 'object') {
          for (const [key, nested] of Object.entries(value)) {
            if (key.endsWith('_en') && typeof nested === 'string') expect(hasArabic(nested), `${item.id}: Arabic in ${key}`).toBe(false);
            else assertEnglishFieldsAreEnglish(nested);
          }
        }
      };
      assertEnglishFieldsAreEnglish(item);
      for (const step of item.steps) {
        expect(step.title_ar, `${item.id}: Arabic step title`).not.toBe(step.title_en);
        expect(step.body_ar, `${item.id}: Arabic step body`).not.toBe(step.body_en);
        expect(hasArabic(step.title_ar), `${item.id}: Arabic title missing Arabic`).toBe(true);
        expect(hasArabic(step.body_ar), `${item.id}: Arabic body missing Arabic`).toBe(true);
        expect(hasArabic(step.title_en), `${item.id}: Arabic leaked into English title`).toBe(false);
        expect(hasArabic(step.body_en), `${item.id}: Arabic leaked into English body`).toBe(false);
        const arabicProse = removeInlineCode(`${step.title_ar} ${step.body_ar}`)
          .replace(/\b(?:CSS|HTML|JavaScript|Flexbox|box-sizing|mobile-first|min-width|max-width|padding|border|margin|display|selector|property|value|class|id|true|false|null|const|let|querySelector|textContent|addEventListener|callback|block|inline|none|row|column|gap|color|background-color|width|font-size|align-items|justify-content|px|h1|message|status)\b/giu, '');
        expect(arabicProse, `${item.id}: English prose leaked into Arabic steps`).not.toMatch(/\b(?:Learning|Understand|Practice|Apply|The|This|Then|with|from|when|which|is|are|you|your|and|for|to)\b/iu);
      }
      if (item.path_id === 'css-fundamentals') expect(item.starter_css, item.id).toBe('');
      if (item.path_id === 'javascript-fundamentals') expect(item.starter_js, item.id).toBe('');
    }
  });

  it('numbers one measurable practice instruction per validation requirement in both languages', () => {
    const numberedItems = (text: string) => [...text.matchAll(/(?:^|\s)(?:\d+|[٠-٩]+|[۰-۹]+|[٠-٩۰-۹]+)[.)](?!\d)/gu)].length;
    for (const item of Object.values(FOUNDATION_LESSONS_BY_ID)) {
      expect(new Set(item.validation_rules.map(({ id }) => id)).size, `${item.id}: duplicate rule ids`).toBe(item.validation_rules.length);
      expect(item.validation_rules.length, `${item.id}: no measurable requirements`).toBeGreaterThan(0);
      expect(numberedItems(item.practice_ar), `${item.id}: Arabic instruction count`).toBe(item.validation_rules.length);
      expect(numberedItems(item.practice_en), `${item.id}: English instruction count`).toBe(item.validation_rules.length);
      for (const requirement of item.validation_rules) {
        expect(requirement.note_ar.trim(), `${item.id}/${requirement.id}: Arabic instruction`).not.toBe('');
        expect(requirement.note_en.trim(), `${item.id}/${requirement.id}: English instruction`).not.toBe('');
      }
    }
  });

  it('has three four-choice quiz questions with one keyed correct answer per lesson', () => {
    for (const item of Object.values(FOUNDATION_LESSONS_BY_ID)) {
      expect(item.quiz, item.id).toHaveLength(3);
      for (const question of item.quiz) {
        expect(question.choices, `${item.id}/${question.id}`).toHaveLength(4);
        expect(new Set(question.choices.map((choice) => choice.id)).size).toBe(4);
        expect(question.choices.filter((choice) => choice.is_correct)).toHaveLength(1);
        expect(question.choices.find((choice) => choice.is_correct)?.id).toBe(question.correct_choice_id);
        for (const [ar, en] of [
          [question.prompt_ar, question.prompt_en],
          [question.correct_ar, question.correct_en],
          [question.incorrect_ar, question.incorrect_en],
          [question.review_ar, question.review_en],
        ]) {
          expect(ar).not.toBe(en);
          expect(hasArabic(en)).toBe(false);
        }
        for (const choice of question.choices) {
          if (hasArabic(choice.text_ar)) expect(choice.text_ar).not.toBe(choice.text_en);
          else expect(/^(?:\d+(?:\.\d+)?)$/u.test(choice.text_ar) || /^[A-Za-z][\w-]*$/u.test(choice.text_ar) || /[`{};=<>#.[\]()"']/u.test(choice.text_ar)).toBe(true);
          expect(hasArabic(choice.text_en)).toBe(false);
        }
      }
    }
  });

  it('encodes all ten audited exercise requirements as structured validation rules', () => {
    const responsive = lesson('css-responsive');
    expect(rule(responsive, 'card-mobile-width')).toMatchObject({ type: 'css-declaration', target: '.card', property: 'width', value: '100%' });
    expect(rule(responsive, 'card-mobile-padding')).toMatchObject({ type: 'css-declaration', target: '.card', property: 'padding', value: '16px' });
    expect(rule(responsive, 'card-breakpoint')).toMatchObject({ type: 'css-declaration-in-media', target: '.card', property: 'width', value: '60%', media: '(min-width: 600px)' });
    expect(responsive.validation_rules.map(({ id }) => id)).toEqual(['card-mobile-width', 'card-mobile-padding', 'card-breakpoint']);

    expect(rule(lesson('js-what-is-javascript'), 'js-query-selector')).toMatchObject({ type: 'js-selector-binding', variable: 'message', selector: '#message' });

    expect(rule(lesson('js-variables'), 'course-name-declaration')).toMatchObject({ type: 'js-declaration', target: 'courseName', property: 'const', expectedType: 'string', expectedValue: 'JavaScript' });
    expect(rule(lesson('js-variables'), 'lesson-count-declaration')).toMatchObject({ type: 'js-declaration', target: 'lessonCount', property: 'let', expectedType: 'number', expectedValue: 1 });
    expect(rule(lesson('js-variables'), 'lesson-count-reassignment')).toMatchObject({ type: 'js-assignment', target: 'lessonCount', expectedType: 'number', mustDifferFrom: 1, mustFollowVariable: 'lessonCount', mustFollowKind: 'let' });

    expect(rule(lesson('js-data-types'), 'score-is-const')).toMatchObject({ type: 'js-declaration', target: 'score', expectedType: 'number', expectedValue: 7 });
    expect(rule(lesson('js-data-types'), 'score-text-is-const')).toMatchObject({ type: 'js-declaration', target: 'scoreText', expectedType: 'string', expectedValue: '7' });
    expect(lesson('js-data-types').validation_rules.map(({ id }) => id)).toEqual(['score-is-const', 'score-text-is-const']);

    expect(rule(lesson('js-operators'), 'points-lower-bound')).toMatchObject({ type: 'js-comparison', variable: 'points', operator: '>=', value: 5 });
    expect(rule(lesson('js-operators'), 'points-upper-bound')).toMatchObject({ type: 'js-comparison', variable: 'points', operator: '<', value: 10 });
    expect(rule(lesson('js-operators'), 'points-combine')).toMatchObject({ type: 'js-comparison', combineWith: { logic: '&&', variable: 'points', operator: '<', value: 10 } });
    expect(rule(lesson('js-conditionals'), 'temperature-constant')).toMatchObject({ type: 'js-declaration', target: 'temperature', property: 'const', expectedType: 'number', expectedValue: 28 });
    expect(rule(lesson('js-conditionals'), 'temperature-if-condition')).toMatchObject({ type: 'js-condition-branches', variable: 'temperature', operator: '<', threshold: 25, branchCheck: 'condition' });
    expect(rule(lesson('js-conditionals'), 'temperature-if-message')).toMatchObject({ type: 'js-condition-branches', branchCheck: 'if-message', ifMessage: 'Cool' });
    expect(rule(lesson('js-conditionals'), 'temperature-else-message')).toMatchObject({ type: 'js-condition-branches', branchCheck: 'else-message', elseMessage: 'Warm' });

    expect(rule(lesson('js-functions'), 'double-number-function')).toMatchObject({ type: 'js-function', target: 'doubleNumber', parameter: 'number' });
    expect(rule(lesson('js-functions'), 'double-number-multiply')).toMatchObject({ type: 'js-function-behavior', functionName: 'doubleNumber', parameter: 'number', operator: '*', operand: 2 });
    expect(rule(lesson('js-functions'), 'double-number-call')).toMatchObject({ type: 'js-call', target: 'doubleNumber', argument: 4, argumentIndex: 0 });

    expect(rule(lesson('js-arrays'), 'colors-array')).toMatchObject({ type: 'js-array', target: 'colors', itemCount: 3, stringItems: true });
    expect(rule(lesson('js-arrays'), 'colors-array')).toMatchObject({ cssColorItems: true });
    expect(rule(lesson('js-arrays'), 'show-item')).toMatchObject({ type: 'js-array-access', arrayName: 'colors', index: 1, logger: 'console.log' });

    expect(rule(lesson('js-dom-basics'), 'select-status')).toMatchObject({ type: 'js-selector-binding', variable: 'status', selector: '#status' });
    expect(rule(lesson('js-dom-basics'), 'guard-selection')).toMatchObject({ type: 'js-guard', variable: 'status' });
    expect(rule(lesson('js-dom-basics'), 'update-status-text')).toMatchObject({ type: 'js-property-assignment', target: 'status.textContent', value: 'Ready!', withinGuardVariable: 'status' });

    expect(rule(lesson('js-events'), 'select-message-button')).toMatchObject({ type: 'js-selector-binding', variable: 'button', selector: '#messageButton', expectedTag: 'button' });
    expect(rule(lesson('js-events'), 'register-click-handler')).toMatchObject({ type: 'js-call', target: 'button.addEventListener', requireCallback: true });
    expect(rule(lesson('js-events'), 'click-event-name')).toMatchObject({ type: 'js-call', target: 'button.addEventListener', argument: 'click', argumentIndex: 0 });
    expect(rule(lesson('js-events'), 'change-button-text')).toMatchObject({ type: 'js-property-assignment', target: 'button.textContent', value: 'Done!', withinCall: { target: 'button.addEventListener', argument: 'click', argumentIndex: 0, callbackArgumentIndex: 1 } });
  });

  it('accepts correct solutions for every audited exercise through the existing AST validator', () => {
    const solutions: Array<{ id: string; language: 'css' | 'javascript'; code: string }> = [
      { id: 'css-responsive', language: 'css', code: '.card { width: 100%; padding: 16px; } @media (min-width: 600px) { .card { width: 60%; } }' },
      { id: 'js-what-is-javascript', language: 'javascript', code: 'const message = document.querySelector("#message"); message.textContent = "Hello";' },
      { id: 'js-variables', language: 'javascript', code: 'const courseName = "JavaScript"; let lessonCount = 1; lessonCount = 2;' },
      { id: 'js-data-types', language: 'javascript', code: 'const score = 7; const scoreText = "7";' },
      { id: 'js-operators', language: 'javascript', code: 'points >= 5 && points < 10;' },
      { id: 'js-conditionals', language: 'javascript', code: 'const temperature = 28; if (temperature < 25) { console.log("Cool"); } else { console.log("Warm"); }' },
      { id: 'js-functions', language: 'javascript', code: 'function doubleNumber(number) { return number * 2; } doubleNumber(4);' },
      { id: 'js-arrays', language: 'javascript', code: 'const colors = ["red", "green", "blue"]; console.log(colors[1]);' },
      { id: 'js-dom-basics', language: 'javascript', code: 'const status = document.querySelector("#status"); if (status) { status.textContent = "Ready!"; }' },
      { id: 'js-events', language: 'javascript', code: 'const button = document.querySelector("#messageButton"); button.addEventListener("click", () => { button.textContent = "Done!"; });' },
    ];

    for (const solution of solutions) {
      const item = lesson(solution.id);
      const results = validateAstPractice(solution.language, item.starter_html, solution.code, item.validation_rules);
      expect(results, solution.id).toHaveLength(item.validation_rules.length);
      expect(results.every((result) => result.passed), `${solution.id}: ${JSON.stringify(results)}`).toBe(true);
    }
  });
});
