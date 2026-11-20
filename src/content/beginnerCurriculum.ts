import { CSS_BEGINNER_DRAFT, placementBands as cssPlacementBands } from './cssBeginnerDraft';
import { HTML_BEGINNER_DRAFT, placementBands as htmlPlacementBands } from './htmlBeginnerDraft';
import { JAVASCRIPT_BEGINNER_DRAFT, placementBands as javascriptPlacementBands } from './javascriptBeginnerDraft';
import {
  CSS_PATH_ID,
  HTML_PATH_ID,
  JAVASCRIPT_PATH_ID,
  type FoundationLessonId,
  type FoundationPathId,
} from './learningSystem';

export type BeginnerLessonQuiz = {
  promptAr: string;
  promptEn: string;
  choices: Array<{ id: string; ar: string; en: string }>;
  correctChoiceId: string;
  correctFeedbackAr: string;
  correctFeedbackEn: string;
  incorrectFeedbackAr: string;
  incorrectFeedbackEn: string;
  reviewAr: string;
  reviewEn: string;
};

export type BeginnerLesson = {
  id: string;
  sequence: number;
  existingLessonId?: FoundationLessonId;
  titleAr: string;
  titleEn: string;
  objectiveAr: string;
  objectiveEn: string;
  commonMistakesAr: string[];
  commonMistakesEn: string[];
  newContent?: {
    steps: Array<{
      titleAr: string;
      titleEn: string;
      bodyAr: string;
      bodyEn: string;
      examples: Array<{ code: string; explanationAr: string; explanationEn: string }>;
    }>;
    exerciseAr: string;
    exerciseEn: string;
    quiz: BeginnerLessonQuiz;
  };
};

export type BeginnerPlacementQuestion = {
  id: string;
  competency: string;
  promptAr: string;
  promptEn: string;
  choices: Array<{ id: string; labelAr: string; labelEn: string }>;
  correctChoiceId: string;
  feedbackAr: string;
  feedbackEn: string;
};

export type BeginnerPlacementBand = {
  id: string;
  titleAr: string;
  titleEn: string;
  competency: string;
  startSequence: number;
  questions: [BeginnerPlacementQuestion, BeginnerPlacementQuestion];
};

export const BEGINNER_LESSONS: Record<FoundationPathId, readonly BeginnerLesson[]> = {
  [HTML_PATH_ID]: HTML_BEGINNER_DRAFT as BeginnerLesson[],
  [CSS_PATH_ID]: CSS_BEGINNER_DRAFT as BeginnerLesson[],
  [JAVASCRIPT_PATH_ID]: JAVASCRIPT_BEGINNER_DRAFT as BeginnerLesson[],
};

function normalizePlacementBands(
  source: readonly {
    id: string;
    titleAr: string;
    titleEn: string;
    competency?: string;
    questions: readonly {
      id: string;
      promptAr: string;
      promptEn: string;
      choices: Array<{ id: string; labelAr: string; labelEn: string }>;
      correctChoiceId: string;
      feedbackAr: string;
      feedbackEn: string;
      competency?: string;
    }[];
  }[],
): BeginnerPlacementBand[] {
  const startSequences = [1, 13, 26, 39];
  return source.map((band, index) => {
    const competency = band.competency ?? band.questions[0]?.competency ?? band.id;
    const questions = band.questions.map((question) => ({
      ...question,
      competency: question.competency ?? competency,
    }));
    return {
      id: band.id,
      titleAr: band.titleAr,
      titleEn: band.titleEn,
      competency,
      startSequence: startSequences[index] ?? 50,
      questions: questions as [BeginnerPlacementQuestion, BeginnerPlacementQuestion],
    };
  });
}

export const BEGINNER_PLACEMENT_BANDS: Record<FoundationPathId, readonly BeginnerPlacementBand[]> = {
  [HTML_PATH_ID]: normalizePlacementBands(htmlPlacementBands),
  [CSS_PATH_ID]: normalizePlacementBands(cssPlacementBands),
  [JAVASCRIPT_PATH_ID]: normalizePlacementBands(javascriptPlacementBands),
};

export function getBeginnerLessons(pathId: FoundationPathId): readonly BeginnerLesson[] {
  return BEGINNER_LESSONS[pathId];
}

export function getBeginnerPlacementBands(pathId: FoundationPathId): readonly BeginnerPlacementBand[] {
  return BEGINNER_PLACEMENT_BANDS[pathId];
}

export function getBeginnerLesson(pathId: FoundationPathId, lessonId: string): BeginnerLesson | undefined {
  return BEGINNER_LESSONS[pathId].find((lesson) => lesson.id === lessonId);
}

export function getPersistedBeginnerLessonIds(
  lessons: readonly Pick<BeginnerLesson, 'id' | 'existingLessonId'>[],
  persistedLessonIds: ReadonlySet<string>,
): Set<string> {
  return new Set(
    lessons
      .filter((lesson) => persistedLessonIds.has(lesson.existingLessonId ?? lesson.id))
      .map((lesson) => lesson.id),
  );
}

export function getBeginnerRecommendedStartIndex(pathId: FoundationPathId, consecutivePassedBands: number): number {
  const bands = BEGINNER_PLACEMENT_BANDS[pathId];
  if (consecutivePassedBands <= 0) return 0;
  const targetBand = bands[Math.min(consecutivePassedBands, bands.length - 1)];
  const startSequence = targetBand?.startSequence ?? 1;
  return Math.max(0, Math.min(startSequence - 1, BEGINNER_LESSONS[pathId].length - 1));
}
