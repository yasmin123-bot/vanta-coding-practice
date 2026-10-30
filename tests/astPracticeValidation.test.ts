import { describe, expect, it } from 'vitest';
import { validateAstPractice } from '../src/utils/astPracticeValidation';
import type { PracticeValidationRule } from '../src/content/practiceTypes';
import { FOUNDATION_LESSONS_BY_ID } from '../src/content/foundationLessons';

const rule = (data: Partial<PracticeValidationRule> & Pick<PracticeValidationRule, 'type' | 'id'>) => ({
  note_ar: '',
  note_en: '',
  ...data,
}) as PracticeValidationRule;

const result = (language: 'css' | 'javascript', code: string, check: PracticeValidationRule, html = '') =>
  validateAstPractice(language, html, code, [check])[0].passed;
const passedResults = (results: ReturnType<typeof validateAstPractice>) => results.map(({ id, passed }) => ({ id, passed }));

describe('validateAstPractice', () => {
  it('checks the CSS selector separately from declarations that use it', () => {
    const selector = rule({ id: 'selector', type: 'css-selector', target: 'h1' });
    const declaration = rule({ id: 'declaration', type: 'css-declaration', target: 'h1', property: 'color', value: 'teal', valueMatch: 'semantic-color' });
    expect(validateAstPractice('css', '', 'h1 { color: #008080; }', [selector, declaration]).map(({ passed }) => passed)).toEqual([true, true]);
    expect(validateAstPractice('css', '', 'h1, .hero { color: hsl(180, 100%, 25%); }', [selector, declaration]).map(({ passed }) => passed)).toEqual([true, true]);
    expect(validateAstPractice('css', '', 'h1 { }', [selector, declaration]).map(({ passed }) => passed)).toEqual([true, false]);
    expect(validateAstPractice('css', '', '.title { color: teal; }', [selector, declaration]).map(({ passed }) => passed)).toEqual([false, false]);
  });

  it('accepts equivalent semantic white color formats without accepting altered alpha', () => {
    const check = rule({ id: 'white', type: 'css-declaration', target: '.card', property: 'color', value: 'white', valueMatch: 'semantic-color' });
    for (const color of ['white', '#fff', '#ffffff', 'rgb(255, 255, 255)', 'hsl(0, 0%, 100%)', 'rgb(100% 100% 100%)']) {
      expect(result('css', `.card { color: ${color}; }`, check), color).toBe(true);
    }
    expect(result('css', '.card { color: #ffffff80; }', check)).toBe(false);
  });

  it('matches a CSS selector, property, and value together and rejects wrong selectors/properties', () => {
    const correct = rule({ id: 'c', type: 'css-declaration', target: '.card', property: 'color', value: 'red' });
    const wrongSelector = rule({ id: 's', type: 'css-declaration', target: '.other', property: 'color', value: 'red' });
    const wrongProperty = rule({ id: 'p', type: 'css-declaration', target: '.card', property: 'background', value: 'red' });
    expect(passedResults(validateAstPractice('css', '', '.card { color: red; }', [correct, wrongSelector, wrongProperty]))).toEqual([
      { id: 'c', passed: true }, { id: 's', passed: false }, { id: 'p', passed: false },
    ]);
  });

  it('requires a declaration-in-media rule to be nested in the requested media query', () => {
    const check = rule({ id: 'media', type: 'css-declaration-in-media', target: '.card', property: 'display', value: 'none', media: '(max-width: 600px)' });
    expect(result('css', '.card { display: none; }', check)).toBe(false);
    expect(result('css', '@media (max-width: 600px) { .card { display: none; } }', check)).toBe(true);
    expect(result('css', '@media (min-width: 600px) { .card { display: none; } }', check)).toBe(false);
  });

  it('checks JavaScript declaration kind and literal value', () => {
    const check = rule({ id: 'v', type: 'js-declaration', target: 'count', property: 'const', expectedType: 'number', expectedValue: 3 });
    expect(result('javascript', 'const count = 3;', check)).toBe(true);
    expect(result('javascript', 'let count = 3;', check)).toBe(false);
    expect(result('javascript', 'const count = 4;', check)).toBe(false);
  });

  it('checks selector call argument and verifies selector binding exists in supplied HTML', () => {
    const call = rule({ id: 'call', type: 'js-call', target: 'document.querySelector', argument: '.action', argumentIndex: 0 });
    expect(result('javascript', 'document.querySelector(".action");', call)).toBe(true);
    expect(result('javascript', 'document.querySelector(".other");', call)).toBe(false);
    const binding = rule({ id: 'binding', type: 'js-selector-binding', variable: 'button', selector: '.action' });
    expect(result('javascript', 'const button = document.querySelector(".action");', binding, '<button class="action"></button>')).toBe(true);
    expect(result('javascript', 'const button = document.querySelector(".action");', binding, '<button class="other"></button>')).toBe(false);
  });

  it('checks assignment target and expected value without accepting an unrelated assignment', () => {
    const check = rule({ id: 'assign', type: 'js-assignment', target: 'score', expectedType: 'number', expectedValue: 10 });
    expect(result('javascript', 'score = 10;', check)).toBe(true);
    expect(result('javascript', 'other = 10;', check)).toBe(false);
    expect(result('javascript', 'score = 9;', check)).toBe(false);
  });

  it('checks a function behavior and a call argument in their respective AST nodes', () => {
    const behavior = rule({ id: 'behavior', type: 'js-function-behavior', functionName: 'double', parameter: 'n', operator: '*', operand: 2 });
    const call = rule({ id: 'arg', type: 'js-call', target: 'console.log', argument: 6, argumentIndex: 0 });
    expect(result('javascript', 'function double(n) { return n * 2; }', behavior)).toBe(true);
    expect(result('javascript', 'function double(n) { return n + 2; }', behavior)).toBe(false);
    expect(result('javascript', 'console.log(6);', call)).toBe(true);
    expect(result('javascript', 'console.log(7);', call)).toBe(false);
  });

  it('checks array access and logger within the same call expression', () => {
    const check = rule({ id: 'index', type: 'js-array-access', arrayName: 'items', index: 1, logger: 'console.log' });
    expect(result('javascript', 'console.log(items[1]);', check)).toBe(true);
    expect(result('javascript', 'console.log(items[0]);', check)).toBe(false);
    expect(result('javascript', 'console.log("items[1]"); items[0];', check)).toBe(false);
  });

  it('checks a direct positive guard independently from the property update', () => {
    const check = rule({ id: 'guard', type: 'js-guard', variable: 'element' });
    expect(result('javascript', 'if (element) { element.textContent = "ready"; }', check)).toBe(true);
    expect(result('javascript', 'if (other) { element.textContent = "ready"; }', check)).toBe(false);
    expect(result('javascript', 'if (!element) { element.textContent = "ready"; }', check)).toBe(false);
  });

  it('checks property-assignment value and optional callback scope', () => {
    const check = rule({ id: 'property', type: 'js-property-assignment', target: 'element.textContent', value: 'ready', withinCallback: true });
    expect(result('javascript', 'button.addEventListener("click", () => { element.textContent = "ready"; });', check)).toBe(true);
    expect(result('javascript', 'button.addEventListener("click", () => { element.textContent = "done"; });', check)).toBe(false);
    expect(result('javascript', 'element.textContent = "ready";', check)).toBe(false);
  });

  it('requires the responsive card width to be inside the min-width media query', () => {
    const base = rule({ id: 'card-mobile-width', type: 'css-declaration', target: '.card', property: 'width', value: '100%' });
    const breakpoint = rule({ id: 'card-breakpoint', type: 'css-declaration-in-media', target: '.card', property: 'width', value: '60%', media: '(min-width: 600px)' });
    const good = '.card { width: 100%; padding: 16px; } @media (min-width: 600px) { .card { width: 60%; } }';
    expect(passedResults(validateAstPractice('css', '', good, [base, breakpoint]))).toEqual([
      { id: 'card-mobile-width', passed: true }, { id: 'card-breakpoint', passed: true },
    ]);
    expect(result('css', '.card { width: 80%; } @media (min-width: 600px) { .card { width: 60%; } }', base)).toBe(false);
    expect(result('css', '.card { width: 100%; } @media (min-width: 600px) { .card { width: 50%; } }', breakpoint)).toBe(false);
    expect(result('css', '.card { width: 60%; } @media (min-width: 600px) { .other { width: 60%; } }', breakpoint)).toBe(false);
    expect(result('css', '.card { width: 100%; } @media (max-width: 600px) { .card { width: 60%; } }', breakpoint)).toBe(false);
  });

  it('binds the introductory querySelector and text update to #message', () => {
    const checks = FOUNDATION_LESSONS_BY_ID['js-what-is-javascript'].validation_rules;
    const html = '<p id="message">Ready</p>';
    const code = 'const message = document.querySelector("#message"); message.textContent = "A new message";';
    expect(validateAstPractice('javascript', html, code, checks).map(({ passed }) => passed)).toEqual([true, true, true]);
    const wrongSelector = 'const message = document.querySelector("#notice"); message.textContent = "A new message";';
    expect(validateAstPractice('javascript', html, wrongSelector, checks).map((item) => item.passed)).toEqual([true, false, true]);
    expect(result('javascript', 'const message = document.querySelector("#message"); other.textContent = "A new message";', checks[2], html)).toBe(false);
    expect(result('javascript', 'const message = document.querySelector("#message"); message.textContent = 7;', checks[2], html)).toBe(false);
  });

  it('checks variable declaration values, types, and a later numeric reassignment', () => {
    const checks = FOUNDATION_LESSONS_BY_ID['js-variables'].validation_rules;
    expect(validateAstPractice('javascript', '', 'const courseName = "JavaScript"; let lessonCount = 1; lessonCount = 2;', checks).map((item) => item.passed)).toEqual([true, true, true]);
    expect(result('javascript', 'const courseName = "Python"; let lessonCount = 1; lessonCount = 2;', checks[0])).toBe(false);
    expect(result('javascript', 'const courseName = "JavaScript"; let lessonCount = 2; lessonCount = 3;', checks[1])).toBe(false);
    expect(result('javascript', 'let lessonCount = 1; lessonCount = 1;', checks[2])).toBe(false);
    expect(result('javascript', 'let lessonCount = 1; lessonCount = "2";', checks[2])).toBe(false);
    expect(result('javascript', 'lessonCount = 2; let lessonCount = 1;', checks[2])).toBe(false);
  });

  it('distinguishes numeric 7 from string "7" and binds the string to scoreText', () => {
    const checks = FOUNDATION_LESSONS_BY_ID['js-data-types'].validation_rules;
    expect(validateAstPractice('javascript', '', 'const score = 7; const scoreText = "7";', checks).map((item) => item.passed)).toEqual([true, true]);
    expect(result('javascript', 'const score = "7"; const scoreText = "7";', checks[0])).toBe(false);
    expect(result('javascript', 'const score = 7; const scoreText = 7;', checks[1])).toBe(false);
    expect(validateAstPractice('javascript', '', 'const score = 7; const other = "7";', checks).map(({ passed }) => passed)).toEqual([true, false]);
  });

  it('requires the points comparisons to form one correctly ordered && expression', () => {
    const checks = FOUNDATION_LESSONS_BY_ID['js-operators'].validation_rules;
    expect(validateAstPractice('javascript', '', 'points >= 5 && points < 10;', checks).map((item) => item.passed)).toEqual([true, true, true]);
    expect(validateAstPractice('javascript', '', 'points >= 5; points < 10;', checks).map(({ passed }) => passed)).toEqual([true, true, false]);
    expect(validateAstPractice('javascript', '', 'points >= 5 && points < 9;', checks).map(({ passed }) => passed)).toEqual([true, false, false]);
    expect(validateAstPractice('javascript', '', 'points >= 5 || points < 10;', checks).map(({ passed }) => passed)).toEqual([true, true, false]);
    expect(validateAstPractice('javascript', '', 'points >= 5 && other < 10;', checks).map(({ passed }) => passed)).toEqual([true, false, false]);
  });

  it('checks the full temperature if/else condition and its branch messages', () => {
    const checks = FOUNDATION_LESSONS_BY_ID['js-conditionals'].validation_rules;
    const good = 'const temperature = 28; if (temperature < 25) { console.log("Cool"); } else { console.log("Warm"); }';
    expect(validateAstPractice('javascript', '', good, checks).map((item) => item.passed)).toEqual([true, true, true, true]);
    expect(validateAstPractice('javascript', '', 'const temperature = 24; if (temperature < 25) { console.log("Cool"); } else { console.log("Warm"); }', checks).map(({ passed }) => passed)).toEqual([false, true, true, true]);
    expect(validateAstPractice('javascript', '', 'const temperature = 28; if (temperature <= 25) { console.log("Cool"); } else { console.log("Warm"); }', checks).map(({ passed }) => passed)).toEqual([true, false, false, false]);
    expect(validateAstPractice('javascript', '', 'const temperature = 28; if (temperature < 25) { console.log("Cool"); }', checks).map(({ passed }) => passed)).toEqual([true, true, true, false]);
    expect(validateAstPractice('javascript', '', 'const temperature = 28; if (temperature < 25) { console.log("Warm"); } else { console.log("Cool"); }', checks).map(({ passed }) => passed)).toEqual([true, true, false, false]);
  });

  it('checks doubleNumber return behavior and the call with 4', () => {
    const checks = FOUNDATION_LESSONS_BY_ID['js-functions'].validation_rules;
    expect(validateAstPractice('javascript', '', 'function doubleNumber(number) { return number * 2; } doubleNumber(4);', checks).map((item) => item.passed)).toEqual([true, true, true]);
    expect(result('javascript', 'function doubleNumber(number) { return number + 2; } doubleNumber(4);', checks[1])).toBe(false);
    expect(result('javascript', 'function doubleNumber(number) { return number * 3; } doubleNumber(4);', checks[1])).toBe(false);
    expect(result('javascript', 'function doubleNumber(number) { return number * 2 + 1; } doubleNumber(4);', checks[1])).toBe(false);
    expect(result('javascript', 'function doubleNumber(number) { return number * 2; } doubleNumber(5);', checks[2])).toBe(false);
    expect(result('javascript', 'function doubleNumber(value) { return number * 2; } doubleNumber(4);', checks[0])).toBe(false);
  });

  it('requires three color strings and console.log(colors[1])', () => {
    const checks = FOUNDATION_LESSONS_BY_ID['js-arrays'].validation_rules;
    expect(validateAstPractice('javascript', '', 'const colors = ["red", "green", "blue"]; console.log(colors[1]);', checks).map((item) => item.passed)).toEqual([true, true, true]);
    expect(result('javascript', 'const colors = ["hsl(0, 100%, 50%)", "rgb(0, 128, 0)", "blue"];', checks[1])).toBe(true);
    expect(result('javascript', 'const colors = ["red", "green"]; console.log(colors[1]);', checks[1])).toBe(false);
    expect(result('javascript', 'const colors = ["red", 2, "blue"]; console.log(colors[1]);', checks[1])).toBe(false);
    expect(result('javascript', 'const colors = ["red", "green", "blue"]; console.log(colors[0]);', checks[2])).toBe(false);
    expect(result('javascript', 'const colors = ["red", "green", "blue"]; console.log("colors[1]"); colors[1];', checks[2])).toBe(false);
  });

  it('requires selecting #status, guarding it, and assigning Ready! inside the guard', () => {
    const checks = FOUNDATION_LESSONS_BY_ID['js-dom-basics'].validation_rules;
    const html = '<p id="status">Waiting...</p>';
    const good = 'const status = document.querySelector("#status"); if (status) { status.textContent = "Ready!"; }';
    expect(validateAstPractice('javascript', html, good, checks).map((item) => item.passed)).toEqual([true, true, true]);
    expect(validateAstPractice('javascript', html, 'const status = document.querySelector("#message"); if (status) { status.textContent = "Ready!"; }', checks).map((item) => item.passed)).toEqual([false, true, true]);
    expect(result('javascript', 'const status = document.querySelector("#status"); if (other) { status.textContent = "Ready!"; }', checks[1], html)).toBe(false);
    expect(result('javascript', 'const status = document.querySelector("#status"); if (status) { status.textContent = "Waiting"; }', checks[2], html)).toBe(false);
    expect(result('javascript', 'const status = document.querySelector("#status"); if (status) { console.log("Ready!"); }', checks[2], html)).toBe(false);
  });

  it('binds the click callback and Done! update to the HTML #messageButton', () => {
    const checks = FOUNDATION_LESSONS_BY_ID['js-events'].validation_rules;
    const html = '<button id="messageButton">Click me</button>';
    const good = 'const button = document.querySelector("#messageButton"); button.addEventListener("click", () => { button.textContent = "Done!"; });';
    expect(validateAstPractice('javascript', html, good, checks).map((item) => item.passed)).toEqual([true, true, true, true]);
    expect(validateAstPractice('javascript', html, 'const button = document.querySelector("#other"); button.addEventListener("click", () => { button.textContent = "Done!"; });', checks).map((item) => item.passed)).toEqual([false, true, true, true]);
    expect(result('javascript', 'const button = document.querySelector("#messageButton"); button.addEventListener("click", () => {}); setTimeout(() => { button.textContent = "Done!"; }, 0);', checks[3], html)).toBe(false);
    expect(result('javascript', 'const button = document.querySelector("#messageButton"); button.addEventListener("click", () => { button.textContent = "Done!"; });', checks[0], '<div id="messageButton">Click me</div>')).toBe(false);
    expect(result('javascript', 'const button = document.querySelector("#messageButton"); button.addEventListener("mouseover", () => { button.textContent = "Done!"; });', checks[2], html)).toBe(false);
    expect(result('javascript', 'const button = document.querySelector("#messageButton"); button.addEventListener("click", () => { button.textContent = "Done"; });', checks[3], html)).toBe(false);
    expect(result('javascript', 'const button = document.querySelector("#messageButton"); button.addEventListener("click", () => {}); button.textContent = "Done!";', checks[3], html)).toBe(false);
  });

  it('fails malformed or incomplete CSS and JavaScript safely', () => {
    const css = rule({ id: 'css', type: 'css-declaration', target: '.card', property: 'color', value: 'red' });
    const js = rule({ id: 'js', type: 'js-declaration', target: 'count', property: 'const', expectedType: 'number' });
    expect(result('css', '.card { color:', css)).toBe(false);
    expect(result('javascript', 'const count =', js)).toBe(false);
  });

  it('returns independent partial CSS results with labels, concepts, and editor locations', () => {
    const checks = [
      rule({ id: 'background', type: 'css-declaration', target: '.card', property: 'background-color', value: '#1f2937', label_en: 'Card background', concept_en: 'Background property and value' }),
      rule({ id: 'text', type: 'css-declaration', target: '.card', property: 'color', value: 'white', label_en: 'Text color' }),
    ];
    const results = validateAstPractice('css', '', '.card {\n  background-color: #1f2937;\n}', checks, 'en');
    expect(results.map(({ status }) => status)).toEqual(['passed', 'missing']);
    expect(results[0]).toMatchObject({ label: 'Card background', concept: 'Background property and value', reason: 'satisfied', location: { editor: 'css', line: 2, column: 3 } });
    expect(results[1]).toMatchObject({ label: 'Text color', reason: 'missing', location: null });
  });

  it('accepts all requested CSS outcomes while ignoring unrelated extra rules', () => {
    const checks = [
      rule({ id: 'background', type: 'css-declaration', target: '.card', property: 'background-color', value: '#1f2937' }),
      rule({ id: 'text', type: 'css-declaration', target: '.card', property: 'color', value: 'white' }),
    ];
    const source = '.card { background-color: #1f2937; color: white; }\n.footer { color: purple; }';
    expect(validateAstPractice('css', '', source, checks, 'en').map(({ status }) => status)).toEqual(['passed', 'passed']);
  });

  it('explains a misspelled property and locates it without revealing or changing learner code', () => {
    const check = rule({ id: 'background', type: 'css-declaration', target: '.card', property: 'background-color', value: '#1f2937', label_en: 'Card background' });
    const code = '.card {\n  backgroun-color: #1f2937;\n}';
    const finding = validateAstPractice('css', '', code, [check], 'en')[0];
    expect(finding).toMatchObject({ status: 'failed', reason: 'unknown-property', location: { line: 2, column: 3 } });
    expect(finding.explanation).toContain('background-color');
    expect(code).toContain('backgroun-color');
  });

  it('treats an exercise-required final semicolon as a located requirement, not generic CSS syntax failure', () => {
    const check = rule({ id: 'color', type: 'css-declaration', target: '.card', property: 'color', value: 'white', requireSemicolon: true });
    const finding = validateAstPractice('css', '', '.card {\n  color: white\n}', [check], 'ar')[0];
    expect(finding).toMatchObject({ status: 'failed', reason: 'missing-semicolon', severity: 'warning', location: { line: 2 } });
    expect(finding.explanation).toContain('الفاصلة المنقوطة');
  });
});
