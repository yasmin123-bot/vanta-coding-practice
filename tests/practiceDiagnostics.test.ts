// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { getPracticeDiagnostics, toCodeMirrorDiagnostics } from '../src/utils/practiceDiagnostics';
import { buildPracticePreviewDocument } from '../src/utils/practicePreviewDocument';
import type { PracticeValidationRule } from '../src/content/practiceTypes';

describe('practice diagnostics contracts', () => {
  it.each(['ar', 'en'] as const)('does not report false errors for empty starters in %s', (locale) => {
    for (const language of ['html', 'css', 'javascript'] as const) {
      expect(getPracticeDiagnostics('  \n ', language, locale)).toEqual([]);
    }
  });
  it.each(['ar', 'en'] as const)('accepts valid HTML, void tags, and optional paragraph closing in %s', (locale) => {
    expect(getPracticeDiagnostics('<h1>Hello</h1>\n<p>Text</p><img src="data:,x" alt="Small dot"><br>', 'html', locale)).toEqual([]);
    expect(getPracticeDiagnostics('<p>Text<figure><figcaption>Caption</figcaption></figure>', 'html', locale)).toEqual([]);
  });
  it.each(['ar', 'en'] as const)('locates an unclosed element with actionable copy in %s', (locale) => {
    const items = getPracticeDiagnostics('<h1>Hello</h1>\n<section>\n<p>Text</p>', 'html', locale);
    const issue = items.find((item) => item.kind === 'structure');
    expect(issue).toMatchObject({ severity: 'error', line: 2, column: 1 });
    expect(issue?.message).toBeTruthy();
    expect(issue?.suggestion).toBeTruthy();
  });
  it('reports JavaScript syntax errors without executing code', () => {
    expect(getPracticeDiagnostics('const value = 1;\nconsole.log(value);', 'javascript', 'en')).toEqual([]);
    expect(getPracticeDiagnostics('const value = ;', 'javascript', 'en').some((item) => item.kind === 'syntax')).toBe(true);
  });
  it.each(['ar', 'en'] as const)('locates CSS property/value mistakes and unmatched braces in %s', (locale) => {
    const typo = getPracticeDiagnostics('.card {\n  backgroun-color: #1f2937;\n}', 'css', locale).find((item) => item.kind === 'property');
    expect(typo).toMatchObject({ line: 2, column: 3, severity: 'error' });
    expect(typo?.suggestion).toContain('background-color');

    const colorTypo = getPracticeDiagnostics('.card {\n  colar: red;\n}', 'css', locale).find((item) => item.kind === 'property');
    expect(colorTypo).toMatchObject({ line: 2, column: 3, severity: 'error' });
    expect(colorTypo?.suggestion).toContain('color');

    const invalidValue = getPracticeDiagnostics('.card {\n  color: greeen;\n}', 'css', locale).find((item) => item.kind === 'value');
    expect(invalidValue).toMatchObject({ line: 2, column: 10 });
    expect(invalidValue?.suggestion).toContain('green');

    expect(getPracticeDiagnostics('.card {\n  color: red;\n', 'css', locale).some((item) => item.kind === 'syntax')).toBe(true);
  });
  it.each(['ar', 'en'] as const)('distinguishes missing colon and missing declaration terminator in %s', (locale) => {
    expect(getPracticeDiagnostics('.card {\n  color red;\n}', 'css', locale).some((item) => item.message.toLowerCase().includes(locale === 'ar' ? 'النقطتين' : 'colon'))).toBe(true);
    const missingTerminator = getPracticeDiagnostics('.card {\n  color: red\n  width: 100%;\n}', 'css', locale);
    expect(missingTerminator.some((item) => item.message.toLowerCase().includes(locale === 'ar' ? 'الفاصلة المنقوطة' : 'semicolon'))).toBe(true);
  });
  it.each(['ar', 'en'] as const)('labels an incomplete selector and points at its trailing comma in %s', (locale) => {
    const issue = getPracticeDiagnostics('.card, { color: red; }', 'css', locale).find((item) => item.message.toLowerCase().includes(locale === 'ar' ? 'محدد' : 'selector'));
    expect(issue).toMatchObject({ kind: 'syntax', severity: 'error', line: 1, column: 6 });
    expect(issue?.suggestion).toBeTruthy();
  });
  it('marks a semicolon required by the exercise as a non-syntax hint and does not auto-edit source', () => {
    const rule: PracticeValidationRule = {
      id: 'required-color-terminator', type: 'css-declaration', target: '.card', property: 'color', value: 'white', requireSemicolon: true,
      note_ar: 'أضف لون النص.', note_en: 'Set the text color.',
    };
    const source = '.card { color: white }';
    const finding = getPracticeDiagnostics(source, 'css', 'en', null, [rule]).find((item) => item.kind === 'format');
    expect(finding).toMatchObject({ severity: 'info', line: 1 });
    expect(finding?.suggestion).toContain('Add ;');
    expect(toCodeMirrorDiagnostics(finding ? [finding] : [])).toHaveLength(1);
    expect(source).toBe('.card { color: white }');
  });
  it('maps located runtime errors to the editor and keeps unknown locations honest', () => {
    const code = 'const value = 1;\nmissingFunction();';
    const located = getPracticeDiagnostics(code, 'javascript', 'ar', { message: 'missingFunction is not defined', line: 2, column: 1 });
    expect(located.find((item) => item.kind === 'runtime')).toMatchObject({ line: 2, column: 1 });
    expect(toCodeMirrorDiagnostics(located)).toHaveLength(1);
    const unknown = getPracticeDiagnostics(code, 'javascript', 'en', { message: 'Unknown runtime failure', line: null, column: null });
    expect(unknown[0]).toMatchObject({ line: null, column: null });
    expect(toCodeMirrorDiagnostics(unknown)).toEqual([]);
  });
});

describe('preview document boundaries (not a security proof)', () => {
  it('adds CSP before student content and guards the message source and token', () => {
    const document = buildPracticePreviewDocument('<h1>Student content</h1>', 'test-token');
    expect(document.indexOf('Content-Security-Policy')).toBeLessThan(document.indexOf('<h1>'));
    expect(document).toContain("connect-src 'none'");
    expect(document).toContain("frame-src 'none'");
    expect(document).toContain('event.source !== parent');
    expect(document).toContain('event.data.token !== token');
    expect(document).toContain('vanta-preview-complete');
  });
  it('preserves a complete student document instead of nesting a second document', () => {
    const document = buildPracticePreviewDocument('<!doctype html><html><head><title>My page</title></head><body><p>Content</p></body></html>', 'test-token');
    expect(document.match(/<html>/g)).toHaveLength(1);
    expect(document).toContain('<title>My page</title>');
    expect(document).toContain('<p>Content</p>');
  });
});
