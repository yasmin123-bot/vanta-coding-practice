import { FOUNDATION_LESSON_IDS, type FoundationLessonId, type HtmlLessonId } from './learningSystem';
import { FOUNDATION_LESSONS_BY_ID } from './foundationLessons';
import type { PracticeValidationRule } from './practiceTypes';

export type PracticeValidatorId = 'intro' | 'headings' | 'links' | 'images' | 'first-page';
export type PracticeExerciseDefinition = {
  language: 'html' | 'css' | 'javascript';
  validator?: PracticeValidatorId;
  starterHtml: string;
  starterCss: string;
  starterJs: string;
  validationRules?: readonly PracticeValidationRule[];
  instructions?: { ar: string; en: string };
};

const optionalCss = '/* Optional: style your HTML after the structure is in place. */\n';
const optionalJs = '// Optional: JavaScript is not required for this HTML exercise.\n';
const emptyHtmlStarter = '';

const htmlPracticeExercises: Record<HtmlLessonId, PracticeExerciseDefinition> = {
  'html-introduction': { language: 'html', validator: 'intro', starterHtml: emptyHtmlStarter, starterCss: optionalCss, starterJs: optionalJs },
  'html-headings-paragraphs': { language: 'html', validator: 'headings', starterHtml: emptyHtmlStarter, starterCss: optionalCss, starterJs: optionalJs },
  'html-links-navigation': { language: 'html', validator: 'links', starterHtml: emptyHtmlStarter, starterCss: optionalCss, starterJs: optionalJs },
  'html-images-attributes': { language: 'html', validator: 'images', starterHtml: emptyHtmlStarter, starterCss: optionalCss, starterJs: optionalJs },
  'html-first-page': { language: 'html', validator: 'first-page', starterHtml: emptyHtmlStarter, starterCss: optionalCss, starterJs: optionalJs },
};

const foundationPracticeExercises = Object.fromEntries(
  Object.entries(FOUNDATION_LESSONS_BY_ID).map(([id, lesson]) => [id, {
    language: lesson.path_id === 'css-fundamentals' ? 'css' : 'javascript',
    starterHtml: lesson.starter_html,
    starterCss: lesson.starter_css,
    starterJs: lesson.starter_js,
    validationRules: lesson.validation_rules,
    instructions: { ar: lesson.practice_ar, en: lesson.practice_en },
  }]),
) as Partial<Record<FoundationLessonId, PracticeExerciseDefinition>>;

export const practiceExercises: Record<FoundationLessonId, PracticeExerciseDefinition> = {
  ...htmlPracticeExercises,
  ...Object.fromEntries(FOUNDATION_LESSON_IDS.filter((id) => id in foundationPracticeExercises).map((id) => [id, foundationPracticeExercises[id]])),
} as Record<FoundationLessonId, PracticeExerciseDefinition>;
