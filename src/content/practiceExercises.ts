import { type HtmlLessonId } from './learningSystem';

export type PracticeValidatorId = 'intro' | 'headings' | 'links' | 'images' | 'first-page';

export type PracticeExerciseDefinition = {
  validator: PracticeValidatorId;
  starterHtml: string;
  starterCss: string;
  starterJs: string;
};

const optionalCss = '/* Optional: style your HTML after the structure is in place. */\n';
const optionalJs = '// Optional: JavaScript is not required for this HTML exercise.\n';
const emptyHtmlStarter = '';

export const practiceExercises: Record<HtmlLessonId, PracticeExerciseDefinition> = {
  'html-introduction': {
    validator: 'intro',
    starterHtml: emptyHtmlStarter,
    starterCss: optionalCss,
    starterJs: optionalJs,
  },
  'html-headings-paragraphs': {
    validator: 'headings',
    starterHtml: emptyHtmlStarter,
    starterCss: optionalCss,
    starterJs: optionalJs,
  },
  'html-links-navigation': {
    validator: 'links',
    starterHtml: emptyHtmlStarter,
    starterCss: optionalCss,
    starterJs: optionalJs,
  },
  'html-images-attributes': {
    validator: 'images',
    starterHtml: emptyHtmlStarter,
    starterCss: optionalCss,
    starterJs: optionalJs,
  },
  'html-first-page': {
    validator: 'first-page',
    starterHtml: emptyHtmlStarter,
    starterCss: optionalCss,
    starterJs: optionalJs,
  },
};
