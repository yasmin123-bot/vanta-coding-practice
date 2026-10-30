import { describe, expect, it } from 'vitest';
import { practiceExercises } from '../src/content/practiceExercises';
import { HTML_LESSON_IDS } from '../src/content/learningSystem';
import { practiceStudioMessages } from '../src/i18n/practiceStudio';
import { getPracticeDiagnostics } from '../src/utils/practiceDiagnostics';
import { validatePractice } from '../src/utils/practiceValidation';

function checks(lessonId: Parameters<typeof validatePractice>[0], html: string) {
  return Object.fromEntries(validatePractice(lessonId, html).map(({ id, passed }) => [id, passed]));
}

describe('exercise-specific HTML validation', () => {
  it('keeps every HTML lesson checklist bilingual and aligned with its validator checks', () => {
    for (const lessonId of HTML_LESSON_IDS) {
      const checkIds = Object.keys(practiceStudioMessages.ar.exercises[lessonId].checks);
      expect(checkIds.length, `${lessonId}: checklist requirements`).toBeGreaterThan(0);
      expect(new Set(checkIds).size, `${lessonId}: duplicate checklist IDs`).toBe(checkIds.length);
      expect(validatePractice(lessonId, '').map(({ id }) => id), `${lessonId}: validator IDs`).toEqual(checkIds);
      for (const locale of ['ar', 'en'] as const) {
        const copy = practiceStudioMessages[locale].exercises[lessonId];
        expect(copy.task.trim(), `${lessonId}/${locale}: task`).not.toBe('');
        expect(copy.expected.trim(), `${lessonId}/${locale}: expected outcome`).not.toBe('');
        for (const [checkId, check] of Object.entries(copy.checks)) {
          expect(check?.label.trim(), `${lessonId}/${locale}/${checkId}: label`).not.toBe('');
          expect(check?.missing.trim(), `${lessonId}/${locale}/${checkId}: measurable instructions`).not.toBe('');
          expect(check?.passed.trim(), `${lessonId}/${locale}/${checkId}: feedback`).not.toBe('');
        }
      }
    }
  });

  it('requires the requested h1 and p for the introduction, not plain text', () => {
    expect(checks('html-introduction', 'Hello, Developer!\nWelcome to Mabda.')).toEqual({ heading: false, paragraph: false, 'paragraph-order': false });
    expect(checks('html-introduction', '<h1>Hello, Developer!</h1><p>Welcome to Mabda.</p>')).toEqual({ heading: true, paragraph: true, 'paragraph-order': true });
    expect(checks('html-introduction', '<h1>Hello, Developer!</h1>')).toEqual({ heading: true, paragraph: false, 'paragraph-order': false });
    expect(checks('html-introduction', '<p>Welcome to Mabda.</p>')).toEqual({ heading: false, paragraph: true, 'paragraph-order': false });
    expect(checks('html-introduction', '<p>Welcome to Mabda.</p><h1>Hello, Developer!</h1>')).toEqual({ heading: true, paragraph: true, 'paragraph-order': false });
    expect(checks('html-introduction', '<h1>Hello, Developer!</h1><p>Welcome to VANTA.</p>')).toEqual({ heading: true, paragraph: true, 'paragraph-order': true });
  });

  it('requires h1, h2, then p in the headings exercise', () => {
    expect(checks('html-headings-paragraphs', 'A topic with a section and explanation.')).toEqual({ heading: false, subheading: false, paragraph: false });
    expect(checks('html-headings-paragraphs', '<h1>Topic</h1><h2>Section</h2><p>Explanation.</p>')).toEqual({ heading: true, subheading: true, paragraph: true });
    // The closing p tag is optional in HTML and must not make a correct answer fail.
    expect(checks('html-headings-paragraphs', '<h1>Topic</h1><h2>Section</h2><p>Explanation.')).toEqual({ heading: true, subheading: true, paragraph: true });
    expect(checks('html-headings-paragraphs', '<h1>Topic</h1><p>Explanation.</p>')).toEqual({ heading: true, subheading: false, paragraph: true });
    expect(checks('html-headings-paragraphs', '<h2>Decoy</h2><p>Decoy text.</p><h1>Topic</h1>')).toEqual({ heading: true, subheading: false, paragraph: false });
  });

  it('requires a valid href and meaningful text on the same a element', () => {
    expect(checks('html-links-navigation', 'Read the documentation.')).toEqual({ 'link-element': false, 'link-href': false, 'link-text': false });
    expect(checks('html-links-navigation', '<a href="/docs">Read the HTML documentation</a>')).toEqual({ 'link-element': true, 'link-href': true, 'link-text': true });
    expect(checks('html-links-navigation', '<a href="/docs">click here</a>')).toEqual({ 'link-element': true, 'link-href': true, 'link-text': false });
    // Neither half may be borrowed from a different anchor.
    expect(checks('html-links-navigation', '<a href="/docs">click here</a><a href="#">Read the documentation</a>')).toEqual({ 'link-element': true, 'link-href': true, 'link-text': false });
    expect(checks('html-links-navigation', '<a href="/docs"><span>Read the docs</span></a>')).toEqual({ 'link-element': true, 'link-href': true, 'link-text': true });
    expect(checks('html-links-navigation', '<a href="/docs>Read the docs</a>')).toEqual({ 'link-element': false, 'link-href': false, 'link-text': false });
  });

  it('requires src and useful alt on the same img element', () => {
    expect(checks('html-images-attributes', 'A picture of a mountain.')).toEqual({ 'image-src': false, 'image-alt': false });
    expect(checks('html-images-attributes', '<img src="/mountain.jpg" alt="Snowy mountain at sunrise">')).toEqual({ 'image-src': true, 'image-alt': true });
    expect(checks('html-images-attributes', '<img src="/mountain.jpg" alt="image"><img src="" alt="Snowy mountain at sunrise">')).toEqual({ 'image-src': true, 'image-alt': false });
    expect(checks('html-images-attributes', '<img src="/mountain.jpg" alt="xxxx">')).toEqual({ 'image-src': true, 'image-alt': false });
    expect(checks('html-images-attributes', '<img src="/mountain.jpg" alt="Snowy mountain at sunrise"')).toEqual({ 'image-src': false, 'image-alt': false });
  });

  it('checks an explicit document structure without relying on DOMParser defaults', () => {
    expect(checks('html-first-page', 'Page title and visible content')).toEqual({ doctype: false, head: false, title: false, body: false });
    expect(checks('html-first-page', '<!doctype html><html><head><title>My first page</title></head><body><h1>Hello</h1></body></html>')).toEqual({ doctype: true, head: true, title: true, body: true });
    expect(checks('html-first-page', '<!doctype html><html><head></head><body>Content</body></html>')).toEqual({ doctype: true, head: true, title: false, body: true });
    // A browser-created/default title or body must not satisfy the source requirement.
    expect(checks('html-first-page', '<!doctype html><title>Decoy outside head</title><body>Content</body>')).toEqual({ doctype: true, head: false, title: false, body: false });
    expect(checks('html-first-page', '<!doctype html><body>Content</body><head><title>Late head</title></head>')).toEqual({ doctype: true, head: true, title: true, body: false });
  });
});

describe('localized checklist feedback', () => {
  it('explains the required tags for plain text and one-sided answers in both locales', () => {
    for (const locale of ['ar', 'en'] as const) {
      const intro = practiceStudioMessages[locale].exercises['html-introduction'].checks;
      const headings = practiceStudioMessages[locale].exercises['html-headings-paragraphs'].checks;
      expect(intro.heading?.missing).toContain('<h1>');
      expect(intro.paragraph?.missing).toContain('<p>');
      expect(headings.heading?.missing).toContain('<h1>');
      expect(headings.paragraph?.missing).toContain('<p>');
    }
  });

  it('returns localized HTML requirement status and the source location without changing its validator result', () => {
    const html = '<h2>Hello, Developer!</h2>\n<p>Welcome to Mabda.</p>';
    const [heading, paragraph] = validatePractice('html-introduction', html, 'ar');
    expect(heading).toMatchObject({ status: 'failed', reason: 'wrong-structure', location: { editor: 'html', line: 1 } });
    expect(heading.explanation).toContain('h1');
    expect(paragraph).toMatchObject({ status: 'passed', passed: true, location: { editor: 'html', line: 2 } });
    expect(validatePractice('html-introduction', html, 'ar')[2]).toMatchObject({ status: 'failed', passed: false, reason: 'wrong-structure' });
    const correctHeading = validatePractice('html-introduction', '<h1>Hello, Developer!</h1>\n<p>Welcome to Mabda.</p>', 'en')[0];
    expect(correctHeading).toMatchObject({ status: 'passed', passed: true, location: { line: 1 } });
  });

  it('reports CSS partial completion as separate, localized outcomes', () => {
    const results = validatePractice('css-colors-backgrounds', {
      html_code: '<div class="card"><p>Readable card</p></div>',
      css_code: '.card {\n  background-color: #1f2937;\n}',
      js_code: '',
    }, 'en');
    expect(results.map(({ status }) => status)).toEqual(['passed', 'missing']);
    expect(results[0]).toMatchObject({ label: 'Card background', concept: 'Background property and value', location: { line: 2 } });
    expect(results[1].explanation).toContain('not present yet');
  });

  it('keeps CSS typo diagnostics and exercise validation aligned without changing learner code', () => {
    const source = '.card {\n  backgroun-color: #1f2937;\n}';
    const results = validatePractice('css-colors-backgrounds', {
      html_code: '<div class="card">Readable card</div>',
      css_code: source,
      js_code: '',
    }, 'en');
    const diagnostic = getPracticeDiagnostics(source, 'css', 'en', null, practiceExercises['css-colors-backgrounds'].validationRules ?? [])
      .find((item) => item.kind === 'property');
    expect(results[0]).toMatchObject({ status: 'failed', reason: 'unknown-property', location: { line: 2, column: 3 } });
    expect(diagnostic).toMatchObject({ severity: 'error', line: 2, column: 3 });
    expect(diagnostic?.suggestion).toContain('background-color');
    expect(source).toContain('backgroun-color');
  });
});

describe('inert and literal-text markup is not an exercise answer', () => {
  it('ignores tag-looking content inside textarea, title, script, and templates', () => {
    const answer = '<h1>Hello Developer</h1><p>Welcome to Mabda</p>';
    for (const tag of ['textarea', 'title', 'script', 'style', 'template', 'iframe']) {
      expect(checks('html-introduction', `<${tag}>${answer}</${tag}>`)).toEqual({ heading: false, paragraph: false, 'paragraph-order': false });
    }
    expect(checks('html-introduction', `<template><template></template>${answer}</template>`)).toEqual({ heading: false, paragraph: false, 'paragraph-order': false });
    expect(checks('html-introduction', `<template>${answer}`)).toEqual({ heading: false, paragraph: false, 'paragraph-order': false });
    expect(checks('html-introduction', `<template>${answer}</template>${answer}`)).toEqual({ heading: true, paragraph: true, 'paragraph-order': true });
  });
});
