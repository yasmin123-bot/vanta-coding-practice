import { describe, expect, it } from 'vitest';
import { BEGINNER_LESSONS, BEGINNER_PLACEMENT_BANDS, getBeginnerRecommendedStartIndex, getPersistedBeginnerLessonIds } from '../src/content/beginnerCurriculum';
import { FOUNDATION_LESSON_IDS_BY_PATH, FOUNDATION_PATH_IDS, type FoundationPathId } from '../src/content/learningSystem';
import { BEGINNER_CAPSTONES } from '../src/content/beginnerCapstones';
import { getBeginnerLessonAccess, getBeginnerUnlockableIndex, getSessionBeginnerProgress } from '../src/utils/sessionBeginnerProgress';

function assertQuestion(question: { id: string; promptAr: string; promptEn: string; choices: Array<{ id: string; labelAr: string; labelEn: string }>; correctChoiceId: string; feedbackAr: string; feedbackEn: string }) {
  expect(question.id).toBeTruthy();
  expect(question.promptAr.trim().length).toBeGreaterThan(5);
  expect(question.promptEn.trim().length).toBeGreaterThan(5);
  expect(question.choices).toHaveLength(4);
  expect(new Set(question.choices.map((choice) => choice.id)).size).toBe(4);
  expect(question.choices.every((choice) => choice.labelAr.trim() && choice.labelEn.trim())).toBe(true);
  expect(question.choices.filter((choice) => choice.id === question.correctChoiceId)).toHaveLength(1);
  expect(question.feedbackAr.trim().length).toBeGreaterThan(5);
  expect(question.feedbackEn.trim().length).toBeGreaterThan(5);
}

describe('Beginner curriculum', () => {
  it('maps persisted canonical completions onto Beginner aliases for progress and unlocking', () => {
    const lessons = [
      { id: 'beginner-alias', existingLessonId: 'html-introduction' as const },
      { id: 'next-beginner-lesson' },
    ];
    const persisted = getPersistedBeginnerLessonIds(lessons, new Set(['html-introduction']));

    expect(persisted).toEqual(new Set(['beginner-alias']));
    expect(getBeginnerUnlockableIndex(FOUNDATION_PATH_IDS[0], lessons.map(({ id }) => id), persisted, getSessionBeginnerProgress())).toBe(1);
    expect(getBeginnerLessonAccess(FOUNDATION_PATH_IDS[0], lessons.map(({ id }) => id), 'next-beginner-lesson', persisted, getSessionBeginnerProgress())).toBe('available');
    expect(getPersistedBeginnerLessonIds([{ id: 'plain-id' }], new Set(['plain-id']))).toEqual(new Set(['plain-id']));
    expect(getPersistedBeginnerLessonIds(lessons, new Set())).toEqual(new Set());
  });

  it.each(FOUNDATION_PATH_IDS)('contains 50 ordered lessons and preserves every canonical lesson in %s', (pathId: FoundationPathId) => {
    const lessons = BEGINNER_LESSONS[pathId];
    expect(lessons).toHaveLength(50);
    expect(lessons.map((lesson) => lesson.sequence)).toEqual(Array.from({ length: 50 }, (_, index) => index + 1));
    expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(50);
    expect(new Set(lessons.map((lesson) => lesson.titleEn.trim().toLocaleLowerCase())).size).toBe(50);
    for (const canonicalId of FOUNDATION_LESSON_IDS_BY_PATH[pathId]) {
      expect(lessons.filter((lesson) => lesson.id === canonicalId)).toHaveLength(1);
      expect(lessons.find((lesson) => lesson.id === canonicalId)?.existingLessonId).toBe(canonicalId);
    }
    for (const lesson of lessons) {
      expect(lesson.titleAr.trim()).toBeTruthy();
      expect(lesson.titleEn.trim()).toBeTruthy();
      expect(lesson.objectiveAr.trim()).toBeTruthy();
      expect(lesson.objectiveEn.trim()).toBeTruthy();
      expect(lesson.commonMistakesAr.length).toBeGreaterThan(0);
      expect(lesson.commonMistakesEn.length).toBeGreaterThan(0);
      expect(lesson.commonMistakesAr.every((item) => item.trim().length > 8)).toBe(true);
      expect(lesson.commonMistakesEn.every((item) => item.trim().length > 8)).toBe(true);
      if (lesson.newContent) {
        expect(lesson.newContent.steps.length).toBeGreaterThanOrEqual(2);
        expect(lesson.newContent.steps.every((step) => (
          step.titleAr.trim().length > 3 && step.titleEn.trim().length > 3
          && step.bodyAr.trim().length > 20 && step.bodyEn.trim().length > 20
          && step.examples.length > 0
          && step.examples.every((example) => example.code.trim() && example.explanationAr.trim().length > 8 && example.explanationEn.trim().length > 8)
        ))).toBe(true);
        expect(lesson.newContent.exerciseAr.trim().length).toBeGreaterThan(20);
        expect(lesson.newContent.exerciseEn.trim().length).toBeGreaterThan(20);
        assertQuestion({
          id: `${lesson.id}-quiz`,
          promptAr: lesson.newContent.quiz.promptAr,
          promptEn: lesson.newContent.quiz.promptEn,
          choices: lesson.newContent.quiz.choices.map((choice) => ({ id: choice.id, labelAr: choice.ar, labelEn: choice.en })),
          correctChoiceId: lesson.newContent.quiz.correctChoiceId,
          feedbackAr: lesson.newContent.quiz.correctFeedbackAr,
          feedbackEn: lesson.newContent.quiz.correctFeedbackEn,
        });
        expect(lesson.newContent.quiz.incorrectFeedbackAr.trim()).toBeTruthy();
        expect(lesson.newContent.quiz.incorrectFeedbackEn.trim()).toBeTruthy();
      } else {
        expect(lesson.existingLessonId).toBeTruthy();
      }
    }
  });

  it.each(FOUNDATION_PATH_IDS)('has sequential placement bands and a complete capstone for %s', (pathId: FoundationPathId) => {
    const bands = BEGINNER_PLACEMENT_BANDS[pathId];
    expect(bands).toHaveLength(4);
    expect(bands.map((band) => band.startSequence)).toEqual([1, 13, 26, 39]);
    for (const band of bands) {
      expect(band.competency.trim()).toBeTruthy();
      expect(band.questions).toHaveLength(2);
      for (const question of band.questions) {
        assertQuestion(question);
        expect(question.competency.trim().length).toBeGreaterThan(3);
      }
    }
    expect(getBeginnerRecommendedStartIndex(pathId, 0)).toBe(0);
    expect(getBeginnerRecommendedStartIndex(pathId, 1)).toBe(12);
    expect(getBeginnerRecommendedStartIndex(pathId, 2)).toBe(25);
    expect(getBeginnerRecommendedStartIndex(pathId, 3)).toBe(38);
    expect(getBeginnerRecommendedStartIndex(pathId, 4)).toBe(38);

    const capstone = BEGINNER_CAPSTONES[pathId];
    expect(capstone.titleAr.trim()).toBeTruthy();
    expect(capstone.titleEn.trim()).toBeTruthy();
    expect(capstone.briefAr.trim().length).toBeGreaterThan(30);
    expect(capstone.briefEn.trim().length).toBeGreaterThan(30);
    expect(capstone.objectivesAr.length).toBeGreaterThanOrEqual(3);
    expect(capstone.objectivesEn).toHaveLength(capstone.objectivesAr.length);
    expect(capstone.deliverablesAr.length).toBeGreaterThanOrEqual(5);
    expect(capstone.deliverablesEn).toHaveLength(capstone.deliverablesAr.length);
    expect(capstone.stepsEn).toHaveLength(capstone.stepsAr.length);
    expect(capstone.rubricEn).toHaveLength(capstone.rubricAr.length);
  });
});
