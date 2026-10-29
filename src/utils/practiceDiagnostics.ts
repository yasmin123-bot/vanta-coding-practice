import { cssLanguage } from '@codemirror/lang-css';
import { htmlLanguage } from '@codemirror/lang-html';
import { javascriptLanguage } from '@codemirror/lang-javascript';
import type { Diagnostic } from '@codemirror/lint';
import { practiceStudioMessages } from '../i18n/practiceStudio';
import type { Locale } from '../i18n/messages';

export type PracticeCodeLanguage = 'html' | 'css' | 'javascript';
export type DiagnosticKind = 'structure' | 'syntax' | 'value' | 'property' | 'runtime';

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
): PracticeCodeDiagnostic {
  const safeFrom = Math.max(0, Math.min(from, source.length));
  const safeTo = Math.max(safeFrom, Math.min(Math.max(to, safeFrom), source.length));
  const { line, column } = locationAt(source, safeFrom);
  const severity = kind === 'value' || kind === 'property' ? 'warning' : 'error';
  return {
    id: `${language}:${kind}:${safeFrom}:${safeTo}:${message}`,
    from: safeFrom,
    to: safeTo,
    severity,
    source: 'VANTA Practice',
    markClass: kind === 'value' || kind === 'property' ? 'cm-vanta-code-warning' : 'cm-vanta-code-error',
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

function parseCssDeclarations(source: string, locale: Locale): PracticeCodeDiagnostic[] {
  const diagnostics: PracticeCodeDiagnostic[] = [];
  const tree = cssLanguage.parser.parse(source);
  const syntaxRanges: Array<{ from: number; to: number }> = [];
  tree.iterate({ enter(node) { if (node.type.isError) syntaxRanges.push({ from: node.from, to: node.to }); } });
  const cursor = tree.cursor();
  const copy = practiceStudioMessages[locale].diagnostics;
  const supports = typeof CSS !== 'undefined' && typeof CSS.supports === 'function' ? CSS.supports.bind(CSS) : null;

  const visit = () => {
    if (cursor.name === 'Declaration') {
      const node = cursor.node;
      const propertyNode = node.getChild('PropertyName');
      if (propertyNode && supports) {
        const property = source.slice(propertyNode.from, propertyNode.to).trim();
        const declaration = source.slice(cursor.from, cursor.to);
        const colon = declaration.indexOf(':');
        const rawValue = colon < 0 ? '' : declaration.slice(colon + 1).replace(/;\s*$/, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
        const value = rawValue.replace(/\s*!important\s*$/i, '').trim();
        const valueOffset = rawValue ? cursor.from + colon + 1 + declaration.slice(colon + 1).indexOf(rawValue) : cursor.to;
        const hasParserError = syntaxRanges.some((range) => range.from <= cursor.to && range.to >= cursor.from);
        if (!hasParserError && !property.startsWith('--') && !value) {
          diagnostics.push(makeDiagnostic(source, 'css', 'syntax', propertyNode.from, Math.max(propertyNode.to, cursor.to), copy.cssMissingValue(property), copy.cssValueSuggestion));
        } else if (!hasParserError && !property.startsWith('--') && !supports(property, 'initial')) {
          diagnostics.push(makeDiagnostic(source, 'css', 'property', propertyNode.from, propertyNode.to, copy.cssUnknownProperty(property), copy.cssPropertySuggestion, property));
        } else if (!hasParserError && !property.startsWith('--') && value && !supports(property, value)) {
          diagnostics.push(makeDiagnostic(source, 'css', 'value', valueOffset, valueOffset + value.length, copy.cssInvalidValue(property, value), copy.cssValueSuggestion, `${property}: ${value}`));
        }
      }
    }
    if (cursor.firstChild()) {
      do { visit(); } while (cursor.nextSibling());
      cursor.parent();
    }
  };
  visit();
  return diagnostics;
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
): PracticeCodeDiagnostic[] {
  const copy = practiceStudioMessages[locale].diagnostics;
  const diagnostics: PracticeCodeDiagnostic[] = [];
  if (!source.trim() && !runtimeIssue) return diagnostics;

  if (language === 'html') {
    diagnostics.push(...scanHtmlStructure(source, locale));
    addParserErrors(source, 'html', diagnostics, copy.htmlMalformedTag, copy.htmlTagSuggestion);
  } else if (language === 'css') {
    addParserErrors(source, 'css', diagnostics, copy.cssSyntax, copy.cssSyntaxSuggestion);
    diagnostics.push(...parseCssDeclarations(source, locale));
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

export function toCodeMirrorDiagnostics(diagnostics: PracticeCodeDiagnostic[]): Diagnostic[] {
  return diagnostics
    .filter((diagnostic) => diagnostic.line !== null && diagnostic.column !== null)
    .map(({ id: _id, language: _language, kind: _kind, line: _line, column: _column, suggestion, detail: _detail, ...diagnostic }) => ({
      ...diagnostic,
      message: `${diagnostic.message} ${suggestion}`.trim(),
    }));
}
