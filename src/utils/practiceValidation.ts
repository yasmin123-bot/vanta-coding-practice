import { practiceExercises, type PracticeValidatorId } from '../content/practiceExercises';
import type { HtmlLessonId } from '../content/learningSystem';

export type PracticeCheckId = 'heading' | 'paragraph' | 'subheading' | 'link-href' | 'link-text' | 'image-src' | 'image-alt' | 'doctype' | 'head' | 'title' | 'body';
export type PracticeCheckResult = { id: PracticeCheckId; passed: boolean };

function withoutComments(source: string): string {
  return source.replace(/<!--[\s\S]*?-->/g, '').replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, '');
}

function attributeValue(attributes: string, name: string): string | null {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = attributes.match(new RegExp(`(?:^|\\s)${escapedName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return match ? (match[1] ?? match[2] ?? match[3] ?? '').trim() : null;
}

function elementText(source: string, tag: string): string[] {
  const safe = withoutComments(source);
  const pattern = new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)<\\/${tag}\\s*>`, 'gi');
  return [...safe.matchAll(pattern)].map((match) => (match[2] ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim());
}

function elementAttributes(source: string, tag: string): string[] {
  const safe = withoutComments(source);
  const pattern = new RegExp(`<${tag}\\b([^>]*)>`, 'gi');
  return [...safe.matchAll(pattern)].map((match) => match[1] ?? '');
}

function nonEmptyText(source: string, tag: string): boolean {
  return elementText(source, tag).some((text) => text.length > 0);
}

function hasDescriptiveLinkText(text: string): boolean {
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

function orderedDocumentChecks(html: string) {
  const doctypeMatch = /^\s*<!doctype\s+html\s*>/i.exec(html);
  const headMatch = /<head\b[^>]*>[\s\S]*?<\/head\s*>/i.exec(html);
  const bodyMatch = /<body\b[^>]*>[\s\S]*?<\/body\s*>/i.exec(html);
  const doctype = Boolean(doctypeMatch);
  const head = Boolean(doctypeMatch && headMatch && (headMatch.index ?? -1) >= doctypeMatch[0].length);
  const body = Boolean(head && headMatch && bodyMatch
    && (bodyMatch.index ?? -1) >= (headMatch.index ?? -1) + headMatch[0].length);
  const title = Boolean(head && headMatch
    && /<title\b[^>]*>\s*[^<\s][\s\S]*?<\/title\s*>/i.test(headMatch[0]));
  return { doctype, head, title, body };
}

function runValidator(validator: PracticeValidatorId, html: string): Record<PracticeCheckId, boolean> {
  switch (validator) {
    case 'intro': {
      const headings = elementText(html, 'h1').map((text) => text.toLowerCase());
      const paragraphs = elementText(html, 'p').map((text) => text.toLowerCase());
      return {
        heading: headings.some((text) => text.includes('hello') && text.includes('developer')),
        paragraph: paragraphs.some((text) => text.includes('welcome') && text.includes('vanta')),
        subheading: false,
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
    case 'headings':
      return {
        heading: nonEmptyText(html, 'h1'),
        subheading: nonEmptyText(html, 'h2'),
        paragraph: nonEmptyText(html, 'p'),
        'link-href': false,
        'link-text': false,
        'image-src': false,
        'image-alt': false,
        doctype: false,
        head: false,
        title: false,
        body: false,
      };
    case 'links': {
      const links = elementAttributes(html, 'a');
      const usableHref = links.some((attrs) => {
        const href = attributeValue(attrs, 'href');
        return Boolean(href && !/^javascript:/i.test(href) && href !== '#');
      });
      return {
        heading: false,
        paragraph: false,
        subheading: false,
        'link-href': usableHref,
        'link-text': elementText(html, 'a').some(hasDescriptiveLinkText),
        'image-src': false,
        'image-alt': false,
        doctype: false,
        head: false,
        title: false,
        body: false,
      };
    }
    case 'images': {
      const images = elementAttributes(html, 'img');
      return {
        heading: false,
        paragraph: false,
        subheading: false,
        'link-href': false,
        'link-text': false,
        'image-src': images.some((attrs) => Boolean(attributeValue(attrs, 'src'))),
        'image-alt': images.some((attrs) => {
          const alt = attributeValue(attrs, 'alt');
          return hasUsefulAltText(alt);
        }),
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

export function validatePractice(lessonId: HtmlLessonId, html: string): PracticeCheckResult[] {
  const validator = practiceExercises[lessonId].validator;
  const checks = runValidator(validator, html);
  const checkIds: Record<PracticeValidatorId, PracticeCheckId[]> = {
    intro: ['heading', 'paragraph'],
    headings: ['heading', 'subheading', 'paragraph'],
    links: ['link-href', 'link-text'],
    images: ['image-src', 'image-alt'],
    'first-page': ['doctype', 'head', 'title', 'body'],
  };
  return checkIds[validator].map((id) => ({ id, passed: checks[id] }));
}
