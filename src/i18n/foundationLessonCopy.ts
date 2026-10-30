import {
  FOUNDATION_LESSON_IDS_BY_PATH,
  getPathForLesson,
  getPathLessonIds,
  type AdditionalHtmlLessonId,
  type FoundationLessonId,
  type FoundationPathId,
} from '../content/learningSystem';
import { FOUNDATION_LESSONS_BY_ID, type FoundationLesson, type FoundationLessonContentId } from '../content/foundationLessons';
import type { LearningLessonCopy, PathLessonSummary } from './learningSystem';
import { learningSystemMessages } from './learningSystem';
import type { Locale } from './messages';

const lessonText = (lesson: FoundationLesson, locale: Locale) => locale === 'ar'
  ? { title: lesson.title_ar, objective: lesson.objective_ar, outcome: lesson.outcome_ar }
  : { title: lesson.title_en, objective: lesson.objective_en, outcome: lesson.outcome_en };

function isAdditionalHtmlLesson(lessonId: FoundationLessonId): lessonId is AdditionalHtmlLessonId {
  return lessonId !== 'html-introduction' && lessonId in learningSystemMessages.en.lessons;
}

export function getLearningLessonCopy(locale: Locale, lessonId: FoundationLessonId): LearningLessonCopy {
  if (lessonId === 'html-introduction') throw new Error('The HTML introduction uses the dedicated StartLesson page.');
  if (isAdditionalHtmlLesson(lessonId)) return learningSystemMessages[locale].lessons[lessonId];

  const source = FOUNDATION_LESSONS_BY_ID[lessonId as FoundationLessonContentId];
  const pathId = getPathForLesson(lessonId);
  const pathLessonIds = FOUNDATION_LESSON_IDS_BY_PATH[pathId];
  const stepCount = source.steps.length;
  const exampleIndex = Math.min(1, Math.max(0, stepCount - 1));
  const explanations = source.code_explanation
    .map((entry) => locale === 'ar' ? entry.why_ar : entry.why_en)
    .join(' ');
  const steps = source.steps.map((step, index) => ({
    title: locale === 'ar' ? step.title_ar : step.title_en,
    body: locale === 'ar' ? step.body_ar : step.body_en,
    ...(index === exampleIndex && source.example_code.trim() ? {
      code: source.example_code.split('\n').map((code) => ({ code, note: '' })),
      note: explanations,
    } : {}),
  }));
  const text = lessonText(source, locale);

  return {
    metaTitle: `${text.title} — Mabda`,
    metaDescription: text.objective,
    eyebrow: locale === 'ar'
      ? `أساسيات ${pathId === 'css-fundamentals' ? 'CSS' : 'JavaScript'} · الدرس ${source.sequence} من ${pathLessonIds.length}`
      : `${pathId === 'css-fundamentals' ? 'CSS' : 'JavaScript'} fundamentals · Lesson ${source.sequence} of ${pathLessonIds.length}`,
    title: text.title,
    intro: text.objective,
    objectiveLabel: locale === 'ar' ? 'هدف الدرس' : 'Lesson objective',
    objectiveText: text.objective,
    steps,
    questions: source.quiz.map((question) => ({
      id: question.id,
      prompt: locale === 'ar' ? question.prompt_ar : question.prompt_en,
      choices: question.choices.map((choice) => ({
        id: choice.id,
        label: locale === 'ar' ? choice.text_ar : choice.text_en,
        kind: 'text' as const,
      })),
      correctChoiceId: question.correct_choice_id,
      correctFeedback: locale === 'ar' ? question.correct_ar : question.correct_en,
      incorrectFeedback: locale === 'ar' ? question.incorrect_ar : question.incorrect_en,
      reviewTopic: locale === 'ar' ? question.review_ar : question.review_en,
    })),
    outcomeLabel: locale === 'ar' ? 'بعد هذا الدرس' : 'After this lesson',
    outcomeText: text.outcome,
  };
}

export function getLearningPathLessonSummaries(locale: Locale, pathId: FoundationPathId): PathLessonSummary[] {
  if (pathId === 'html-fundamentals') {
    return learningSystemMessages[locale].paths[pathId].lessonSummaries ?? [];
  }
  return getPathLessonIds(pathId).map((lessonId) => {
    const source = FOUNDATION_LESSONS_BY_ID[lessonId as FoundationLessonContentId];
    const text = lessonText(source, locale);
    return { id: lessonId, title: text.title, summary: text.objective };
  });
}
