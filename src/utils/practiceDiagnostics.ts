import { cssLanguage } from '@codemirror/lang-css';
import { htmlLanguage } from '@codemirror/lang-html';
import { javascriptLanguage } from '@codemirror/lang-javascript';
import type { Diagnostic } from '@codemirror/lint';
import type { PracticeRequirementResult, PracticeValidationRule } from '../content/practiceTypes';
import { practiceStudioMessages } from '../i18n/practiceStudio';
import type { Locale } from '../i18n/messages';
import { cssValueSupport, getCssDeclarationFacts, getCssUnmatchedBraceOffsets, isKnownCssProperty, suggestCssColorValue, suggestCssProperty } from './cssAnalysis';

export type PracticeCodeLanguage = 'html' | 'css' | 'javascript';
export type DiagnosticKind = 'structure' | 'syntax' | 'value' | 'property' | 'format' | 'requirement' | 'runtime';

export type RuntimeCodeIssue = {
  message: string;
  detail?: string;
  line: number | null;
  column: number | null;
};

export type PracticeCodeDiagnostic = Diagnostic & {
  id: string;
  language: PracticeCodeLanguage;
  kind: DiagnosticKind;
  line: number | null;
  column: number | null;
  suggestion: string;
  detail?: string;
};

const htmlVoidElements = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'param', 'source', 'track', 'wbr',
]);

const htmlBlockElements = new Set([
  'address', 'article', 'aside', 'blockquote', 'details', 'dialog', 'div', 'dl',
  'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4',
  'h5', 'h6', 'header', 'hgroup', 'hr', 'main', 'menu', 'nav', 'ol', 'p', 'pre',
  'search', 'section', 'table', 'ul',
]);

const htmlImplicitClose: Record<string, Set<string>> = {
  p: htmlBlockElements,
  li: new Set(['li']),
  dt: new Set(['dt', 'dd']),
  dd: new Set(['dt', 'dd']),
  option: new Set(['option', 'optgroup']),
  optgroup: new Set(['optgroup']),
  tr: new Set(['tr']),
  th: new Set(['th', 'td']),
  td: new Set(['th', 'td']),
  thead: new Set(['tbody', 'tfoot']),
  tbody: new Set(['tbody', 'tfoot']),
  tfoot: new Set(['tbody']),
};

function locationAt(source: string, offset: number) {
  const safeOffset = Math.max(0, Math.min(offset, source.length));
  const prefix = source.slice(0, safeOffset);
  const lastNewline = prefix.lastIndexOf('\n');
  return { line: prefix.split('\n').length, column: safeOffset - lastNewline };
}

function offsetAt(source: string, line: number, column: number) {
  const lineStart = source.split('\n').slice(0, Math.max(0, line - 1)).reduce((sum, part) => sum + part.length + 1, 0);
  const lineText = source.split('\n')[Math.max(0, line - 1)] ?? '';
  return Math.min(lineStart + Math.max(0, column - 1), lineStart + lineText.length, source.length);
}

function makeDiagnostic(
  source: string,
  language: PracticeCodeLanguage,
  kind: DiagnosticKind,
  from: number,
  to: number,
  message: string,
  suggestion: string,
  detail?: string,
  severityOverride?: Diagnostic['severity'],
): PracticeCodeDiagnostic {
  const safeFrom = Math.max(0, Math.min(from, source.length));
  const safeTo = Math.max(safeFrom, Math.min(Math.max(to, safeFrom), source.length));
  const { line, column } = locationAt(source, safeFrom);
  const severity = severityOverride ?? (kind === 'value' || kind === 'property' || kind === 'format' ? 'warning' : 'error');
  return {
    id: `${language}:${kind}:${safeFrom}:${safeTo}:${message}`,
    from: safeFrom,
    to: safeTo,
    severity,
    source: 'Mabda Practice',
    markClass: severity === 'error' ? 'cm-vanta-code-error' : severity === 'info' ? 'cm-vanta-code-hint' : 'cm-vanta-code-warning',
    message,
    language,
    kind,
    line,
    column,
    suggestion,
    detail,
  };
}

function addParserErrors(
  source: string,
  language: PracticeCodeLanguage,
  diagnostics: PracticeCodeDiagnostic[],
  message: string,
  suggestion: string,
) {
  const parser = language === 'html'
    ? htmlLanguage.parser
    : language === 'css' ? cssLanguage.parser : javascriptLanguage.parser;
  const tree = parser.parse(source);
  tree.iterate({
    enter(node) {
      if (!node.type.isError) return;
      const from = node.from;
      const to = Math.max(node.to, Math.min(source.length, from + 1));
      const duplicate = diagnostics.some((item) => item.language === language
        && item.kind === 'syntax'
        && Math.abs(item.from - from) <= 2);
      if (!duplicate) diagnostics.push(makeDiagnostic(source, language, 'syntax', from, to, message, suggestion));
    },
  });
}

function findTagEnd(source: string, start: number): number {
  let quote = '';
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (char === quote) quote = '';
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === '>') {
      return index;
    }
  }
  return -1;
}

function scanHtmlStructure(source: string, locale: Locale): PracticeCodeDiagnostic[] {
  const copy = practiceStudioMessages[locale].diagnostics;
  const diagnostics: PracticeCodeDiagnostic[] = [];
  const stack: Array<{ name: string; from: number }> = [];
  let index = 0;

  while (index < source.length) {
    if (source.startsWith('<!--', index)) {
      const commentEnd = source.indexOf('-->', index + 4);
      if (commentEnd < 0) {
        diagnostics.push(makeDiagnostic(source, 'html', 'syntax', index, source.length, copy.htmlUnclosedComment, copy.htmlCommentSuggestion));
        break;
      }
      index = commentEnd + 3;
      continue;
    }

    if (source[index] !== '<') {
      index += 1;
      continue;
    }

    if (source.startsWith('<!', index) || source.startsWith('<?', index)) {
      const declarationEnd = findTagEnd(source, index + 2);
      if (declarationEnd < 0) {
        diagnostics.push(makeDiagnostic(source, 'html', 'syntax', index, source.length, copy.htmlMalformedTag, copy.htmlTagSuggestion));
        break;
      }
      index = declarationEnd + 1;
      continue;
    }

    const remaining = source.slice(index);
    const malformedSpacing = /^<\s+\/?\s*[A-Za-z]/.test(remaining);
    const opening = /^<([A-Za-z][A-Za-z0-9:-]*)/.exec(remaining);
    const closing = /^<\/([A-Za-z][A-Za-z0-9:-]*)/.exec(remaining);

    if (!opening && !closing) {
      if (malformedSpacing || /^<\/?\d[^>]*>/.test(remaining)) {
        const end = findTagEnd(source, index + 1);
        const stop = end < 0 ? Math.min(source.length, index + 2) : end + 1;
        diagnostics.push(makeDiagnostic(source, 'html', 'syntax', index, stop, copy.htmlMalformedTag, copy.htmlTagSuggestion));
        index = stop;
      } else {
        index += 1;
      }
      continue;
    }

    const tagMatch = (opening ?? closing)!;
    const name = (closing?.[1] ?? opening?.[1] ?? '').toLowerCase();
    const end = findTagEnd(source, index + tagMatch[0].length);
    if (end < 0) {
      const lineEnd = source.indexOf('\n', index);
      const stop = lineEnd < 0 ? source.length : lineEnd;
      diagnostics.push(makeDiagnostic(source, 'html', 'syntax', index, Math.max(index + 1, stop), copy.htmlMalformedTag, copy.htmlTagSuggestion));
      break;
    }

    const rawTag = source.slice(index, end + 1);
    const isClosing = Boolean(closing);
    if (isClosing) {
      if (htmlVoidElements.has(name)) {
        diagnostics.push(makeDiagnostic(source, 'html', 'structure', index, end + 1, copy.htmlVoidClosing(name), copy.htmlVoidSuggestion(name)));
      } else {
        const matchIndex = stack.map((item) => item.name).lastIndexOf(name);
        if (matchIndex < 0) {
          diagnostics.push(makeDiagnostic(source, 'html', 'structure', index, end + 1, copy.htmlUnexpectedClose(name), copy.htmlUnexpectedSuggestion(name)));
        } else {
          for (let openIndex = stack.length - 1; openIndex > matchIndex; openIndex -= 1) {
            const missing = stack[openIndex];
            diagnostics.push(makeDiagnostic(source, 'html', 'structure', index, end + 1, copy.htmlMissingBeforeClose(missing.name, name), copy.htmlCloseSuggestion(missing.name)));
          }
          stack.splice(matchIndex);
        }
      }
    } else if (!htmlVoidElements.has(name) && !/\/\s*>$/.test(rawTag)) {
      while (stack.length) {
        const top = stack[stack.length - 1];
        if (!htmlImplicitClose[top.name]?.has(name)) break;
        stack.pop();
      }
      stack.push({ name, from: index });
    }

    index = end + 1;
    if (!isClosing && (name === 'script' || name === 'style')) {
      const closePattern = new RegExp(`<\\/\\s*${name}\\b`, 'ig');
      closePattern.lastIndex = index;
      const closeMatch = closePattern.exec(source);
      if (closeMatch) index = closeMatch.index;
      else break;
    }
  }

  for (const open of stack) {
    diagnostics.push(makeDiagnostic(source, 'html', 'structure', open.from, open.from + open.name.length + 1, copy.htmlMissingClose(open.name), copy.htmlCloseSuggestion(open.name)));
  }
  return diagnostics;
}

function cssParserDiagnostics(source: string, locale: Locale): PracticeCodeDiagnostic[] {
  const diagnostics: PracticeCodeDiagnostic[] = [];
  const copy = practiceStudioMessages[locale].diagnostics;
  const tree = cssLanguage.parser.parse(source);
  const unmatched = getCssUnmatchedBraceOffsets(source);
  for (const offset of unmatched) {
    diagnostics.push(makeDiagnostic(source, 'css', 'syntax', offset, Math.min(source.length, offset + 1), copy.cssUnmatchedBrace, copy.cssBraceSuggestion));
  }
  tree.iterate({
    enter(node) {
      if (!node.type.isError || unmatched.some((offset) => Math.abs(offset - node.from) <= 1)) return;
      const lineStart = source.lastIndexOf('\n', Math.max(0, node.from - 1)) + 1;
      const lineEndIndex = source.indexOf('\n', node.from);
      const lineEnd = lineEndIndex < 0 ? source.length : lineEndIndex;
      const line = source.slice(lineStart, lineEnd);
      const boundary = Math.max(source.lastIndexOf('{', node.from), source.lastIndexOf(';', node.from), source.lastIndexOf('}', node.from)) + 1;
      const preceding = source.slice(boundary, node.from);
      const selectorBoundary = line.indexOf('{');
      const selectorHeader = (selectorBoundary < 0 ? line : line.slice(0, selectorBoundary)).trimEnd();
      let diagnosticFrom = node.from;
      let message = copy.cssSyntax;
      let suggestion = copy.cssSyntaxSuggestion;
      let kind: DiagnosticKind = 'syntax';
      if (/[,+~>]$/.test(selectorHeader.trim()) || (selectorBoundary < 0 && node.from >= lineEnd && /^\s*[.#][\w-]+\s*$/.test(line))) {
        diagnosticFrom = lineStart + Math.max(0, selectorHeader.length - 1);
        message = copy.cssMalformedSelector;
        suggestion = copy.cssSelectorSuggestion;
      } else if (!line.includes(':') && /^\s*[.#]?[\w-]+\s+[^{};]+;?\s*$/.test(line)) {
        message = copy.cssMissingColon;
        suggestion = copy.cssMissingColonSuggestion;
      } else if (/:\s*[^;{}]+\s*$/.test(preceding) && /[\w-]+/.test(source.slice(node.from, lineEnd))) {
        message = copy.cssMissingSemicolon;
        suggestion = copy.cssSemicolonSuggestion;
        kind = 'format';
      }
      diagnostics.push(makeDiagnostic(source, 'css', kind, diagnosticFrom, Math.max(node.to, Math.min(source.length, diagnosticFrom + 1)), message, suggestion));
    },
  });
  return diagnostics;
}

function parseCssDeclarations(source: string, locale: Locale, rules: readonly PracticeValidationRule[] = []): PracticeCodeDiagnostic[] {
  const diagnostics: PracticeCodeDiagnostic[] = [];
  const copy = practiceStudioMessages[locale].diagnostics;
  for (const declaration of getCssDeclarationFacts(source)) {
    if (!declaration.value && !declaration.property.startsWith('--')) {
      diagnostics.push(makeDiagnostic(source, 'css', 'syntax', declaration.propertyFrom, declaration.to, copy.cssMissingValue(declaration.property), copy.cssValueSuggestion(null)));
      continue;
    }
    if (!declaration.property.startsWith('--') && !isKnownCssProperty(declaration.property)) {
      const suggestion = suggestCssProperty(declaration.property);
      diagnostics.push(makeDiagnostic(source, 'css', 'property', declaration.propertyFrom, declaration.propertyTo, copy.cssUnknownProperty(declaration.property), copy.cssPropertySuggestion(suggestion), declaration.property, 'error'));
      continue;
    }
    const supported = cssValueSupport(declaration.property, declaration.value);
    if (supported === false && declaration.value) {
      const suggestion = suggestCssColorValue(declaration.value);
      diagnostics.push(makeDiagnostic(source, 'css', 'value', declaration.valueFrom, declaration.valueTo, copy.cssInvalidValue(declaration.property, declaration.value), copy.cssValueSuggestion(suggestion), `${declaration.property}: ${declaration.value}`));
    }
  }

  for (const rule of rules) {
    if ((rule.type !== 'css-declaration' && rule.type !== 'css-declaration-in-media') || !rule.requireSemicolon) continue;
    const declaration = getCssDeclarationFacts(source).find((item) => item.selector === rule.target.trim()
      && item.property === rule.property.toLowerCase()
      && item.value === rule.value.trim().replace(/\s+/g, ' ').toLowerCase()
      && (rule.type !== 'css-declaration-in-media' || (item.media ?? '').replace(/[()\s]/g, '').toLowerCase() === rule.media.replace(/[()\s]/g, '').toLowerCase()));
    if (declaration && !declaration.hasSemicolon) {
      diagnostics.push(makeDiagnostic(source, 'css', 'format', declaration.to, declaration.to, copy.cssMissingSemicolon, copy.cssSemicolonSuggestion, undefined, 'info'));
    }
  }
  return diagnostics;
}

function requirementDiagnostics(results: readonly PracticeRequirementResult[]): PracticeCodeDiagnostic[] {
  return results.flatMap((result) => {
    if (result.passed || !result.location) return [];
    const { from, to, line, column, editor } = result.location;
    const severity = result.severity === 'hint' ? 'info' : result.severity;
    return [{
      id: `requirement:${result.id}:${from}:${to}`,
      from,
      to,
      severity,
      source: 'Mabda Practice',
      markClass: severity === 'error' ? 'cm-vanta-code-error' : severity === 'info' ? 'cm-vanta-code-hint' : 'cm-vanta-code-warning',
      message: result.explanation,
      language: editor,
      kind: 'requirement' as const,
      line,
      column,
      suggestion: result.concept,
    }];
  });
}

function javascriptMessage(source: string, from: number, locale: Locale) {
  const copy = practiceStudioMessages[locale].diagnostics;
  const before = source.slice(Math.max(0, from - 24), from);
  if (/=\s*$/.test(before)) return copy.jsExpectedValue;
  if (/\(\s*$/.test(before)) return copy.jsExpectedExpression;
  return copy.jsSyntax;
}

export function getPracticeDiagnostics(
  source: string,
  language: PracticeCodeLanguage,
  locale: Locale,
  runtimeIssue: RuntimeCodeIssue | null = null,
  validationRules: readonly PracticeValidationRule[] = [],
): PracticeCodeDiagnostic[] {
  const copy = practiceStudioMessages[locale].diagnostics;
  const diagnostics: PracticeCodeDiagnostic[] = [];
  if (!source.trim() && !runtimeIssue) return diagnostics;

  if (language === 'html') {
    diagnostics.push(...scanHtmlStructure(source, locale));
    addParserErrors(source, 'html', diagnostics, copy.htmlMalformedTag, copy.htmlTagSuggestion);
  } else if (language === 'css') {
    diagnostics.push(...cssParserDiagnostics(source, locale));
    diagnostics.push(...parseCssDeclarations(source, locale, validationRules));
  } else {
    const parser = javascriptLanguage.parser;
    const tree = parser.parse(source);
    tree.iterate({
      enter(node) {
        if (!node.type.isError) return;
        const duplicate = diagnostics.some((item) => item.language === 'javascript' && item.kind === 'syntax' && Math.abs(item.from - node.from) <= 2);
        if (!duplicate) diagnostics.push(makeDiagnostic(source, 'javascript', 'syntax', node.from, Math.max(node.to, Math.min(source.length, node.from + 1)), javascriptMessage(source, node.from, locale), copy.jsSyntaxSuggestion));
      },
    });
    if (runtimeIssue) {
      const hasLocation = Number.isInteger(runtimeIssue.line) && Number.isInteger(runtimeIssue.column) && (runtimeIssue.line ?? 0) > 0 && (runtimeIssue.column ?? 0) > 0;
      const from = hasLocation ? offsetAt(source, runtimeIssue.line!, runtimeIssue.column!) : 0;
      const to = hasLocation ? Math.min(source.length, from + 1) : from;
      const item = makeDiagnostic(source, 'javascript', 'runtime', from, to, copy.runtimeMessage(runtimeIssue.message), copy.runtimeSuggestion, runtimeIssue.detail);
      diagnostics.push({ ...item, line: hasLocation ? item.line : null, column: hasLocation ? item.column : null });
    }
  }

  const unique = new Map<string, PracticeCodeDiagnostic>();
  for (const diagnostic of diagnostics) unique.set(diagnostic.id, diagnostic);
  return [...unique.values()].sort((left, right) => {
    if (left.from !== right.from) return left.from - right.from;
    return left.severity === 'error' ? -1 : 1;
  }).slice(0, 40);
}

export function getAllPracticeDiagnostics(
  html: string,
  css: string,
  javascript: string,
  locale: Locale,
) {
  return [
    ...getPracticeDiagnostics(html, 'html', locale),
    ...getPracticeDiagnostics(css, 'css', locale),
    ...getPracticeDiagnostics(javascript, 'javascript', locale),
  ];
}

export function getPracticeRequirementDiagnostics(results: readonly PracticeRequirementResult[]): PracticeCodeDiagnostic[] {
  return requirementDiagnostics(results);
}

export function toCodeMirrorDiagnostics(diagnostics: PracticeCodeDiagnostic[]): Diagnostic[] {
  return diagnostics
    .filter((diagnostic) => diagnostic.line !== null && diagnostic.column !== null)
    .map(({ id: _id, language: _language, kind: _kind, line: _line, column: _column, suggestion, detail: _detail, ...diagnostic }) => ({
      ...diagnostic,
      message: `${diagnostic.message} ${suggestion}`.trim(),
    }));
}
