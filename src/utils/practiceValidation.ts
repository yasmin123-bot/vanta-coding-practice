import { practiceExercises, type PracticeValidatorId } from '../content/practiceExercises';
import { HTML_LESSON_IDS, type FoundationLessonId, type HtmlLessonId } from '../content/learningSystem';
import type { PracticeRequirementResult, PracticeValidationRule } from '../content/practiceTypes';
import type { Locale } from '../i18n/messages';
import { practiceStudioMessages } from '../i18n/practiceStudio';
import { validateAstPractice } from './astPracticeValidation';
import { editorLocation } from './practiceResults';

export type PracticeCheckId = string;
export type PracticeCheckResult = PracticeRequirementResult;
export type PracticeSource = string | { html_code: string; css_code: string; js_code: string };

type HtmlToken =
  | { kind: 'doctype'; start: number; end: number }
  | { kind: 'open' | 'void' | 'close'; tag: string; attrs: string; start: number; end: number };

type HtmlElement = {
  tag: string;
  attrs: string;
  openStart: number;
  openEnd: number;
  contentStart: number;
  closeStart: number;
  closeEnd: number;
};

type OpenElement = {
  tag: string;
  attrs: string;
  start: number;
  end: number;
};

const htmlVoidElements = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'param', 'source', 'track', 'wbr',
]);

const htmlLiteralTextElements = new Set([
  'script', 'style', 'textarea', 'title', 'iframe', 'xmp', 'noembed', 'noframes', 'noscript',
]);

const htmlBlockElements = new Set([
  'address', 'article', 'aside', 'blockquote', 'details', 'dialog', 'div', 'dl',
  'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4',
  'h5', 'h6', 'header', 'hgroup', 'hr', 'main', 'menu', 'nav', 'ol', 'p', 'pre',
  'search', 'section', 'table', 'ul',
]);

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

/**
 * Scan only complete, recognizable tags. This is intentionally not DOMParser:
 * browser-inserted html/head/body elements must never satisfy the exercise.
 */
function scanHtml(source: string): HtmlToken[] {
  const tokens: HtmlToken[] = [];
  let index = 0;

  while (index < source.length) {
    const start = source.indexOf('<', index);
    if (start < 0) break;
    index = start + 1;

    if (source.startsWith('<!--', start)) {
      const commentEnd = source.indexOf('-->', start + 4);
      index = commentEnd < 0 ? source.length : commentEnd + 3;
      continue;
    }

    const end = findTagEnd(source, start + 1);
    if (end < 0) break;
    const rawTag = source.slice(start, end + 1);
    const doctype = /^<!doctype\s+html\s*>$/i.test(rawTag);
    if (doctype) {
      tokens.push({ kind: 'doctype', start, end: end + 1 });
      index = end + 1;
      continue;
    }
    if (/^<!|^<\?/.test(rawTag)) {
      index = end + 1;
      continue;
    }

    const closeMatch = /^<\/([A-Za-z][A-Za-z0-9:-]*)/.exec(rawTag);
    const openMatch = /^<([A-Za-z][A-Za-z0-9:-]*)/.exec(rawTag);
    if (!closeMatch && !openMatch) continue;

    const isClosing = Boolean(closeMatch);
    const tag = (closeMatch?.[1] ?? openMatch?.[1] ?? '').toLowerCase();
    const tagNameEnd = (isClosing ? closeMatch?.[0] : openMatch?.[0])?.length ?? 0;
    const attrs = isClosing ? '' : rawTag.slice(tagNameEnd, -1);
    const selfClosing = !isClosing && /\/\s*$/.test(attrs);
    const kind: HtmlToken['kind'] = isClosing
      ? 'close'
      : htmlVoidElements.has(tag) || selfClosing ? 'void' : 'open';
    tokens.push({ kind, tag, attrs, start, end: end + 1 });
    index = end + 1;

    // The browser displays these contents as text (or does not render them).
    // A literal "<h1>" in them is not a heading created by the learner.
    if (kind === 'open' && tag === 'plaintext') break;
    if (kind === 'open' && htmlLiteralTextElements.has(tag)) {
      const closePattern = new RegExp(`<\\/\\s*${tag}\\b`, 'ig');
      closePattern.lastIndex = index;
      const closeMatch = closePattern.exec(source);
      if (!closeMatch) break;
      index = closeMatch.index;
    }
  }

  return tokens;
}

function implicitParagraphClose(openTag: string, nextTag: string): boolean {
  return openTag === 'p' && (htmlBlockElements.has(nextTag) || nextTag === 'body' || nextTag === 'html' || nextTag === 'head');
}

function pairElements(source: string): HtmlElement[] {
  const stack: OpenElement[] = [];
  const elements: HtmlElement[] = [];

  const closeParagraphsBefore = (tag: string, closeStart: number) => {
    while (stack.length && stack[stack.length - 1].tag === 'p' && (htmlBlockElements.has(tag) || tag === 'body' || tag === 'html' || tag === 'head')) {
      const paragraph = stack.pop()!;
      elements.push({
        tag: paragraph.tag,
        attrs: paragraph.attrs,
        openStart: paragraph.start,
        openEnd: paragraph.end,
        contentStart: paragraph.end,
        closeStart,
        closeEnd: closeStart,
      });
    }
  };

  for (const token of scanHtml(source)) {
    if (token.kind === 'doctype') continue;
    if (token.kind === 'void') {
      elements.push({
        tag: token.tag,
        attrs: token.attrs,
        openStart: token.start,
        openEnd: token.end,
        contentStart: token.end,
        closeStart: token.end,
        closeEnd: token.end,
      });
      continue;
    }

    if (token.kind === 'open') {
      while (stack.length && implicitParagraphClose(stack[stack.length - 1].tag, token.tag)) {
        const paragraph = stack.pop()!;
        elements.push({
          tag: paragraph.tag,
          attrs: paragraph.attrs,
          openStart: paragraph.start,
          openEnd: paragraph.end,
          contentStart: paragraph.end,
          closeStart: token.start,
          closeEnd: token.start,
        });
      }
      stack.push({ tag: token.tag, attrs: token.attrs, start: token.start, end: token.end });
      continue;
    }

    closeParagraphsBefore(token.tag, token.start);
    const matchingIndex = stack.map(({ tag }) => tag).lastIndexOf(token.tag);
    if (matchingIndex < 0) continue;
    const opening = stack[matchingIndex];
    elements.push({
      tag: opening.tag,
      attrs: opening.attrs,
      openStart: opening.start,
      openEnd: opening.end,
      contentStart: opening.end,
      closeStart: token.start,
      closeEnd: token.end,
    });
    // A mismatched close is syntax territory; do not invent paired child elements.
    stack.splice(matchingIndex);
  }

  // </p> is optional at the end of a valid HTML document.
  for (let index = stack.length - 1; index >= 0; index -= 1) {
    const opening = stack[index];
    if (opening.tag !== 'p') continue;
    elements.push({
      tag: opening.tag,
      attrs: opening.attrs,
      openStart: opening.start,
      openEnd: opening.end,
      contentStart: opening.end,
      closeStart: source.length,
      closeEnd: source.length,
    });
  }

  // Template descendants, including nested/unclosed templates, are inert.
  const templates = [
    ...elements.filter(({ tag }) => tag === 'template'),
    ...stack.filter(({ tag }) => tag === 'template').map((opening) => ({ openStart: opening.start, closeStart: source.length })),
  ];
  return elements
    .filter((element) => !templates.some((template) => element.openStart > template.openStart && element.openStart < template.closeStart))
    .sort((left, right) => left.openStart - right.openStart);
}

function rawAttributeValue(attributes: string, name: string): string | null {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const normalizedAttributes = attributes.replace(/\/\s*$/, '');
  const match = normalizedAttributes.match(new RegExp(`(?:^|\\s)${escapedName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return match ? (match[1] ?? match[2] ?? match[3] ?? '') : null;
}

function attributeValue(attributes: string, name: string): string | null {
  return rawAttributeValue(attributes, name)?.trim() ?? null;
}

function textContent(source: string, element: HtmlElement): string {
  const rawText = source.slice(element.contentStart, element.closeStart)
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, ' ')
    .replace(/<[^>]*>/g, ' ');
  const decoder = document.createElement('textarea');
  decoder.innerHTML = rawText.replace(/</g, '&lt;');
  return decoder.value.replace(/\s+/g, ' ').trim();
}

function elementsWithText(source: string, elements: HtmlElement[], tag: string): Array<HtmlElement & { text: string }> {
  return elements
    .filter((element) => element.tag === tag)
    .map((element) => ({ ...element, text: textContent(source, element) }));
}

function hasUsefulLinkText(text: string): boolean {
  const normalized = text.replace(/[.!?…،,]+$/u, '').replace(/\s+/g, ' ').trim();
  if (normalized.length < 3) return false;
  return !/^(?:here|click\s+(?:here|this)|learn\s+more|read\s+more|more|link|اضغط\s+هنا|انقر\s+هنا|هنا|المزيد|رابط)$/i.test(normalized);
}

function hasUsefulAltText(value: string | null): boolean {
  if (!value) return false;
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length < 4 || /^(.)\1{3,}$/u.test(normalized)) return false;
  return !/^(?:image|photo|picture|img|placeholder|test|sample|none|n\/?a|unknown|alt|صورة|صوره|اختبار|عينة|بدون وصف|نص بديل)(?:\s+\d+)?$/iu.test(normalized);
}

function hasUsableHref(value: string | null): boolean {
  if (!value) return false;
  const normalized = value.trim();
  return Boolean(normalized) && normalized !== '#' && !/^javascript\s*:/i.test(normalized);
}

function orderedDocumentChecks(source: string) {
  const tokens = scanHtml(source);
  const firstContent = source.search(/\S/);
  const doctypeToken = tokens.find((token): token is Extract<HtmlToken, { kind: 'doctype' }> => token.kind === 'doctype');
  const doctype = Boolean(doctypeToken && doctypeToken.start === (firstContent < 0 ? 0 : firstContent));
  const elements = pairElements(source);
  const heads = elements.filter((element) => element.tag === 'head');
  const bodies = elements.filter((element) => element.tag === 'body');
  const titles = elements.filter((element) => element.tag === 'title');
  const headElement = heads.find((head) => Boolean(doctypeToken && head.openStart >= doctypeToken.end));
  const head = Boolean(doctype && headElement);
  const bodyElement = bodies.find((body) => Boolean(headElement && body.openStart >= headElement.closeEnd));
  const body = Boolean(bodyElement);
  const title = Boolean(headElement && titles.some((candidate) => (
    candidate.openStart >= headElement.openEnd
    && candidate.closeEnd <= headElement.closeStart
    && textContent(source, candidate).length > 0
  )));
  return { doctype, head, title: Boolean(head && title), body: Boolean(head && body) };
}

function runValidator(validator: PracticeValidatorId, html: string): Record<PracticeCheckId, boolean> {
  const elements = pairElements(html);
  switch (validator) {
    case 'intro': {
      const headings = elementsWithText(html, elements, 'h1');
      const paragraphs = elementsWithText(html, elements, 'p');
      const heading = headings.find(({ text }) => {
        const normalized = text.toLowerCase();
        return normalized.includes('hello') && normalized.includes('developer');
      });
      const paragraph = paragraphs.find(({ text }) => {
        const normalized = text.toLowerCase();
        return normalized.includes('welcome') && /\b(?:mabda|vanta)\b/.test(normalized);
      });
      return {
        heading: Boolean(heading),
        paragraph: Boolean(paragraph),
        'paragraph-order': Boolean(heading && paragraph && paragraph.openStart > heading.openStart),
        subheading: false,
        'link-element': false,
        'link-href': false,
        'link-text': false,
        'image-src': false,
        'image-alt': false,
        doctype: false,
        head: false,
        title: false,
        body: false,
      };
    }
    case 'headings': {
      const heading = elementsWithText(html, elements, 'h1').find(({ text }) => text.length > 0);
      const subheading = elementsWithText(html, elements, 'h2').find(({ text, openStart }) => text.length > 0 && Boolean(heading && openStart > heading.openStart));
      const paragraph = elementsWithText(html, elements, 'p').find(({ text, openStart }) => text.length > 0 && Boolean(
        heading
        && openStart > heading.openStart
        && (!subheading || openStart > subheading.openStart)
      ));
      return {
        heading: Boolean(heading),
        subheading: Boolean(subheading),
        paragraph: Boolean(paragraph),
        'paragraph-order': false,
        'link-element': false,
        'link-href': false,
        'link-text': false,
        'image-src': false,
        'image-alt': false,
        doctype: false,
        head: false,
        title: false,
        body: false,
      };
    }
    case 'links': {
      const links = elementsWithText(html, elements, 'a');
      return {
        heading: false,
        paragraph: false,
        subheading: false,
        'paragraph-order': false,
        'link-element': links.length > 0,
        'link-href': links.some((link) => hasUsableHref(attributeValue(link.attrs, 'href'))),
        'link-text': links.some((link) => hasUsableHref(attributeValue(link.attrs, 'href')) && hasUsefulLinkText(link.text)),
        'image-src': false,
        'image-alt': false,
        doctype: false,
        head: false,
        title: false,
        body: false,
      };
    }
    case 'images': {
      const images = elements.filter((element) => element.tag === 'img');
      return {
        heading: false,
        paragraph: false,
        subheading: false,
        'paragraph-order': false,
        'link-element': false,
        'link-href': false,
        'link-text': false,
        'image-src': images.some((image) => hasUsableHref(attributeValue(image.attrs, 'src'))),
        'image-alt': images.some((image) => hasUsableHref(attributeValue(image.attrs, 'src'))
          && hasUsefulAltText(attributeValue(image.attrs, 'alt'))),
        doctype: false,
        head: false,
        title: false,
        body: false,
      };
    }
    case 'first-page': {
      const { doctype, head, title, body } = orderedDocumentChecks(html);
      return {
        heading: false,
        paragraph: false,
        subheading: false,
        'link-href': false,
        'link-text': false,
        'image-src': false,
        'image-alt': false,
        doctype,
        head,
        title,
        body,
      };
    }
  }
}

function hasBooleanAttribute(attributes: string, name: string): boolean {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:^|\\s)${escaped}(?:\\s|=|$)`, 'i').test(attributes.replace(/\/$/, ''));
}

function isNestedWithin(element: HtmlElement, parent: HtmlElement): boolean {
  return element.openStart > parent.openStart && element.openStart < parent.closeStart;
}

function isDirectlyWithin(element: HtmlElement, parent: HtmlElement, elements: HtmlElement[]): boolean {
  return isNestedWithin(element, parent) && !elements.some((candidate) => candidate !== element && candidate !== parent
    && isNestedWithin(candidate, parent) && isNestedWithin(element, candidate));
}

function hasAncestorTag(element: HtmlElement, ancestorTag: string, elements: HtmlElement[]): boolean {
  return elements.some((candidate) => candidate.tag === ancestorTag.toLowerCase() && isNestedWithin(element, candidate));
}

function evaluateHtmlRule(source: string, elements: HtmlElement[], rule: Extract<PracticeValidationRule, { type: 'html-element' | 'html-document' | 'html-list' | 'html-label-control' }>): boolean {
  if (rule.type === 'html-element') {
    const matches = elements.filter((element) => element.tag === rule.tag.toLowerCase()
      && (!rule.parentTag || elements.some((parent) => parent.tag === rule.parentTag?.toLowerCase() && isNestedWithin(element, parent)))
      && (!rule.ancestorTag || hasAncestorTag(element, rule.ancestorTag, elements))
      && (!rule.requiredAttributes || rule.requiredAttributes.every((attribute) => hasBooleanAttribute(element.attrs, attribute)))
      && (!rule.minimumAttributeLengths || Object.entries(rule.minimumAttributeLengths).every(([attribute, length]) => {
        const value = attributeValue(element.attrs, attribute);
        return Boolean(value && value.length >= length && (attribute.toLowerCase() !== 'alt' || hasUsefulAltText(value)));
      }))
      && (!rule.attributeValues || Object.entries(rule.attributeValues).every(([attribute, value]) => {
        const actual = attributeValue(element.attrs, attribute);
        if (element.tag === 'button' && attribute.toLowerCase() === 'type' && value.toLowerCase() === 'submit') {
          const rawType = rawAttributeValue(element.attrs, attribute);
          return rawType === null || !['button', 'reset'].includes(rawType.toLowerCase());
        }
        return (['lang', 'dir'].includes(attribute) ? actual?.toLowerCase() === value.toLowerCase() : actual === value);
      }))
      && (!rule.attributePrefixes || Object.entries(rule.attributePrefixes).every(([attribute, prefix]) => attributeValue(element.attrs, attribute)?.startsWith(prefix)))
      && (!rule.minimumTextLength || textContent(source, element).length >= rule.minimumTextLength)
      && (!rule.textIncludes || textContent(source, element).toLocaleLowerCase().includes(rule.textIncludes.toLocaleLowerCase())));
    const perParentCount = rule.minimumPerParent
      ? elements.filter((parent) => parent.tag === rule.minimumPerParent?.parentTag.toLowerCase())
        .filter((parent) => matches.filter((child) => isNestedWithin(child, parent)).length >= (rule.minimumPerParent?.count ?? 1)).length
      : Number.POSITIVE_INFINITY;
    const minimumPerParentPassed = !rule.minimumPerParent || perParentCount >= (rule.minimumCount ?? 1);
    const sameContainerPassed = !rule.sameContainerAs || elements
      .filter((container) => container.tag === rule.sameContainerAs?.containerTag.toLowerCase())
      .some((container) => {
        const hasOwnMatch = matches.some((match) => isNestedWithin(match, container));
        const requirementsMet = rule.sameContainerAs?.requiredChildren.every(({ tag, count }) => (
          elements.filter((child) => child.tag === tag.toLowerCase() && isNestedWithin(child, container)).length >= count
        )) ?? false;
        return hasOwnMatch && requirementsMet;
      });
    return matches.length >= (rule.minimumCount ?? 1) && minimumPerParentPassed && sameContainerPassed;
  }

  if (rule.type === 'html-document') {
    const root = elements.find((element) => element.tag === 'html');
    if (rule.check === 'doctype') {
      const firstContent = source.search(/\S/);
      return scanHtml(source).some((token) => token.kind === 'doctype' && token.start === (firstContent < 0 ? 0 : firstContent));
    }
    if (rule.check === 'lang') return Boolean(root && attributeValue(root.attrs, 'lang')?.toLowerCase() === rule.expected?.toLowerCase());
    if (rule.check === 'direction') return Boolean(root && attributeValue(root.attrs, 'dir')?.toLowerCase() === rule.expected?.toLowerCase());
    if (rule.check === 'html-root') {
      const head = elements.find((element) => element.tag === 'head' && root && isNestedWithin(element, root));
      const body = elements.find((element) => element.tag === 'body' && root && isNestedWithin(element, root));
      return Boolean(root && head && body && head.openStart < body.openStart);
    }
    if (rule.check === 'title') return elements.some((element) => element.tag === 'title'
      && textContent(source, element).length > 0
      && elements.some((head) => head.tag === 'head' && isNestedWithin(element, head)));
    if (rule.check === 'charset') return elements.some((element) => element.tag === 'meta'
      && Boolean(attributeValue(element.attrs, 'charset'))
      && (!rule.expected || attributeValue(element.attrs, 'charset')?.toLowerCase() === rule.expected.toLowerCase())
      && elements.some((head) => head.tag === 'head' && isNestedWithin(element, head)));
    return elements.some((element) => element.tag === 'meta'
      && attributeValue(element.attrs, 'name')?.toLowerCase() === 'viewport'
      && Boolean(attributeValue(element.attrs, 'content'))
      && elements.some((head) => head.tag === 'head' && isNestedWithin(element, head)));
  }

  if (rule.type === 'html-list') {
    const lists = elements.filter((element) => element.tag === rule.tag);
    const listsWithEnoughItems = lists.filter((list) => elements.filter((element) => element.tag === 'li'
      && (rule.directChildren ? isDirectlyWithin(element, list, elements) : isNestedWithin(element, list))).length >= rule.minimumItems);
    return listsWithEnoughItems.length >= (rule.minimumLists ?? 1);
  }

  const inputs = elements.filter((element) => element.tag === 'input'
    && (!rule.inputType || attributeValue(element.attrs, 'type')?.toLowerCase() === rule.inputType.toLowerCase())
    && (!rule.requireRequired || hasBooleanAttribute(element.attrs, 'required')));
  const forms = elements.filter((element) => element.tag === 'form');
  const idCounts = new Map<string, number>();
  for (const element of elements) {
    const id = attributeValue(element.attrs, 'id');
    if (id) idCounts.set(id, (idCounts.get(id) ?? 0) + 1);
  }
  const pairs = inputs.filter((input) => {
    const id = attributeValue(input.attrs, 'id');
    if (!id || idCounts.get(id) !== 1) return false;
    const matchingLabels = elements.filter((element) => element.tag === 'label' && attributeValue(element.attrs, 'for') === id);
    if (!matchingLabels.length) return false;
    return !rule.formScoped || forms.some((form) => isNestedWithin(input, form) && matchingLabels.some((label) => isNestedWithin(label, form)));
  });
  const validPairs = rule.fieldsetScoped
    ? pairs.filter((input) => {
      const id = attributeValue(input.attrs, 'id');
      const matchingLabels = id ? elements.filter((element) => element.tag === 'label' && attributeValue(element.attrs, 'for') === id) : [];
      return elements.some((fieldset) => fieldset.tag === 'fieldset'
        && isNestedWithin(input, fieldset) && matchingLabels.some((label) => isNestedWithin(label, fieldset))
        && forms.some((form) => isNestedWithin(fieldset, form)));
    })
    : pairs;
  return validPairs.length >= (rule.minimumPairs ?? 1);
}

function htmlRuleLocation(html: string, rule: PracticeValidationRule) {
  const tag = rule.type === 'html-element' ? rule.tag
    : rule.type === 'html-list' ? rule.tag
      : rule.type === 'html-label-control' ? 'input'
        : rule.type === 'html-document' ? rule.check === 'title' ? 'title' : rule.check === 'doctype' ? '!doctype' : rule.check === 'charset' || rule.check === 'viewport' ? 'meta' : 'html'
          : null;
  const matcher = tag === '!doctype' ? /<!doctype\b/i : tag ? new RegExp(`<${tag}\\b`, 'i') : null;
  const index = matcher ? html.search(matcher) : -1;
  return index < 0 ? null : editorLocation(html, 'html', index, Math.min(html.length, index + Math.max(2, (tag?.length ?? 1) + 1)));
}

function validateHtmlRules(html: string, rules: readonly PracticeValidationRule[], locale: Locale): PracticeRequirementResult[] {
  const elements = pairElements(html);
  const hasMarkup = /<[a-z][a-z0-9:-]*\b/i.test(html);
  const htmlRules = rules.filter((rule) => rule.type === 'html-element' || rule.type === 'html-document' || rule.type === 'html-list' || rule.type === 'html-label-control') as Array<Extract<PracticeValidationRule, { type: 'html-element' | 'html-document' | 'html-list' | 'html-label-control' }>>;
  return htmlRules.map((rule) => {
    const passed = evaluateHtmlRule(html, elements, rule);
    const label = locale === 'ar' ? rule.label_ar ?? rule.note_ar : rule.label_en ?? rule.note_en;
    const explanation = passed
      ? (locale === 'ar' ? 'تم استيفاء هذا المتطلب.' : 'This requirement is satisfied.')
      : (locale === 'ar' ? rule.note_ar : rule.note_en);
    const status = passed ? 'passed' : hasMarkup ? 'failed' : 'missing';
    return {
      id: rule.id,
      status,
      passed,
      label,
      explanation,
      concept: locale === 'ar' ? rule.concept_ar ?? 'بنية HTML' : rule.concept_en ?? 'HTML structure',
      reason: passed ? 'satisfied' : status === 'failed' ? 'wrong-structure' : 'missing',
      severity: passed ? 'hint' : status === 'failed' ? 'warning' : 'hint',
      location: htmlRuleLocation(html, rule),
    } satisfies PracticeRequirementResult;
  });
}

/**
 * Validate a reusable set of practice rules without binding them to a
 * FoundationLessonId. Journey courses and capstones use this adapter while
 * sharing the same HTML and AST validators, result shape, and diagnostics.
 */
export function validatePracticeRules(
  language: 'html' | 'css' | 'javascript',
  source: PracticeSource,
  rules: readonly PracticeValidationRule[],
  locale: Locale = 'en',
): PracticeCheckResult[] {
  if (language === 'html') {
    return validateHtmlRules(typeof source === 'string' ? source : source.html_code, rules, locale);
  }
  const html = typeof source === 'string' ? '' : source.html_code;
  const code = typeof source === 'string' ? source : language === 'css' ? source.css_code : source.js_code;
  return validateAstPractice(language, html, code, rules, locale);
}

function htmlCheckTag(id: string): string | null {
  const tags: Record<string, string> = {
    heading: 'h1', subheading: 'h2', paragraph: 'p', 'paragraph-order': 'p', 'link-element': 'a', 'link-href': 'a', 'link-text': 'a',
    'image-src': 'img', 'image-alt': 'img', doctype: '!doctype', head: 'head', title: 'title', body: 'body',
  };
  return tags[id] ?? null;
}

function htmlCheckLocation(html: string, id: string) {
  const tag = htmlCheckTag(id);
  const expected = tag === '!doctype'
    ? /<!doctype\b/i
    : tag ? new RegExp(`<${tag}\\b`, 'i') : null;
  let index = expected ? html.search(expected) : -1;
  if (index < 0 && (id === 'heading' || id === 'subheading')) index = html.search(/<h[1-6]\b/i);
  if (index < 0 && id === 'paragraph') index = html.search(/<[a-z][a-z0-9:-]*\b/i);
  if (index < 0 && html.includes('<')) index = html.indexOf('<');
  return index < 0 ? null : editorLocation(html, 'html', index, Math.min(html.length, index + (tag?.length ?? 1) + 1));
}

export function validatePractice(lessonId: FoundationLessonId, source: PracticeSource, locale: Locale = 'en'): PracticeCheckResult[] {
  const exercise = practiceExercises[lessonId];
  if (!HTML_LESSON_IDS.includes(lessonId as HtmlLessonId)) {
    return validatePracticeRules(
      exercise.language as 'css' | 'javascript',
      source,
      exercise.validationRules ?? [],
      locale,
    );
  }
  const html = typeof source === 'string' ? source : source.html_code;
  if (exercise.validationRules?.length) return validatePracticeRules('html', source, exercise.validationRules, locale);
  const validator = exercise.validator as PracticeValidatorId;
  const checks = runValidator(validator, html);
  const checkIds: Record<PracticeValidatorId, PracticeCheckId[]> = {
    intro: ['heading', 'paragraph', 'paragraph-order'],
    headings: ['heading', 'subheading', 'paragraph'],
    links: ['link-element', 'link-href', 'link-text'],
    images: ['image-src', 'image-alt'],
    'first-page': ['doctype', 'head', 'title', 'body'],
  };
  const checkCopy = practiceStudioMessages[locale].exercises[lessonId as HtmlLessonId]?.checks;
  return checkIds[validator].map((id) => {
    const passed = checks[id];
    const localized = checkCopy?.[id];
    const label = localized?.label ?? id;
    const hasRelevantMarkup = /<[a-z][a-z0-9:-]*\b/i.test(html);
    const status = passed ? 'passed' : hasRelevantMarkup ? 'failed' : 'missing';
    return {
      id,
      status,
      passed,
      label,
      concept: localized?.concept ?? (locale === 'ar' ? 'عناصر HTML وبنيتها' : 'HTML elements and structure'),
      explanation: passed
        ? localized?.passed ?? practiceStudioMessages[locale].validationFeedback.passed(label)
        : status === 'failed'
          ? localized?.failed ?? practiceStudioMessages[locale].validationFeedback.wrongStructure(label)
          : localized?.missing ?? practiceStudioMessages[locale].validationFeedback.missing(label),
      reason: passed ? 'satisfied' : status === 'failed' ? 'wrong-structure' : 'missing',
      severity: passed ? 'hint' : status === 'failed' ? 'warning' : 'hint',
      location: htmlCheckLocation(html, id),
    } satisfies PracticeRequirementResult;
  });
}
