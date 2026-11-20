import { describe, expect, it } from 'vitest';
import { FOUNDATION_PATH_IDS, resolveVantaRoute, getJourneyCourseHref, getJourneyLessonHref } from '../src/content/learningSystem';
import { JOURNEY_COURSES } from '../src/content/journeyCurriculum';
import { JOURNEY_PROJECTS } from '../src/content/journeyProjects';
import { validatePracticeRules } from '../src/utils/practiceValidation';

describe('Mabda Intermediate and Professional journey', () => {
  it('preserves the original lessons and expands every course to five units of ten complete lessons', () => {
    const preservedIds = {
      intermediate: {
        'html-fundamentals': ['html-i-semantics', 'html-i-forms', 'html-i-tables', 'html-i-media', 'html-i-multipage'],
        'css-fundamentals': ['css-i-cascade', 'css-i-layout', 'css-i-fluid', 'css-i-states', 'css-i-tokens'],
        'javascript-fundamentals': ['js-i-transform', 'js-i-dom', 'js-i-storage', 'js-i-async', 'js-i-modules'],
      },
      professional: {
        'html-fundamentals': ['html-p-landmarks', 'html-p-errors', 'html-p-enhancement', 'html-p-performance', 'html-p-audit'],
        'css-fundamentals': ['css-p-cascade', 'css-p-layout', 'css-p-theme', 'css-p-accessibility', 'css-p-performance'],
        'javascript-fundamentals': ['js-p-modules', 'js-p-async', 'js-p-resilience', 'js-p-performance', 'js-p-tests'],
      },
    } as const;
    for (const level of ['intermediate', 'professional'] as const) {
      for (const pathId of FOUNDATION_PATH_IDS) {
        const course = JOURNEY_COURSES[level][pathId];
        expect(course.lessons).toHaveLength(50);
        expect(course.lessons.map((lesson) => lesson.id)).toEqual(expect.arrayContaining(preservedIds[level][pathId]));
        expect(new Set(course.lessons.map((lesson) => lesson.id)).size).toBe(50);
        expect(course.lessons.map((lesson) => lesson.sequence)).toEqual(Array.from({ length: 50 }, (_, index) => index + 1));
        expect(course.units).toHaveLength(5);
        expect(course.units.map((unit) => unit.lessonIds)).toHaveLength(5);
        expect(course.units.every((unit) => unit.lessonIds.length === 10)).toBe(true);
        expect(course.units.flatMap((unit) => unit.lessonIds)).toEqual(course.lessons.map((lesson) => lesson.id));
        for (const unit of course.units) {
          expect(unit.title.ar.trim() && unit.title.en.trim()).toBeTruthy();
          expect(unit.outcome.ar.trim() && unit.outcome.en.trim()).toBeTruthy();
          expect(unit.bridge.ar.trim() && unit.bridge.en.trim()).toBeTruthy();
          expect(course.lessons.filter((lesson) => lesson.unitId === unit.id).map((lesson) => lesson.id)).toEqual(unit.lessonIds);
        }
        expect(course.assessment.length).toBeGreaterThanOrEqual(5);
        for (const lesson of course.lessons) {
          expect(lesson.title.ar && lesson.title.en && lesson.objective.ar && lesson.objective.en).toBeTruthy();
          expect(lesson.practice.ar && lesson.practice.en && lesson.hint.ar && lesson.hint.en && lesson.summary.ar && lesson.summary.en).toBeTruthy();
          expect(lesson.sections.length).toBeGreaterThanOrEqual(2);
          expect(lesson.example.code.trim()).not.toBe('');
          expect(lesson.example.explanation.ar && lesson.example.explanation.en).toBeTruthy();
          expect(lesson.hints.length).toBeGreaterThanOrEqual(2);
          expect(lesson.hints.every((hint) => hint.ar.trim() && hint.en.trim())).toBe(true);
          expect(new Set(lesson.hints.map((hint) => hint.ar.trim().toLocaleLowerCase())).size).toBe(lesson.hints.length);
          expect(new Set(lesson.hints.map((hint) => hint.en.trim().toLocaleLowerCase())).size).toBe(lesson.hints.length);
          expect(lesson.commonMistakes.length).toBeGreaterThan(0);
          expect(lesson.knowledgeCheck.choices).toHaveLength(4);
          expect(lesson.knowledgeCheck.choices.map((choice) => choice.id)).toContain(lesson.knowledgeCheck.correctChoiceId);
          expect(lesson.validationRules.length > 0 || lesson.manualReview === true).toBe(true);
          if (lesson.manualReview) expect(lesson.validationRules).toHaveLength(0);
        }
        const added = course.lessons.filter((lesson) => lesson.sequence > 5);
        const maxHintCount = Math.max(...added.map((lesson) => lesson.hints.length));
        for (let hintIndex = 0; hintIndex < maxHintCount; hintIndex += 1) {
          for (const locale of ['ar', 'en'] as const) {
            const hints = added.flatMap((lesson) => {
              const hint = lesson.hints[hintIndex];
              return hint ? [hint[locale].trim().toLocaleLowerCase()] : [];
            });
            expect(new Set(hints).size).toBe(hints.length);
          }
        }
      }
    }
    expect(Object.values(JOURNEY_COURSES).flatMap((courses) => Object.values(courses).flatMap((course) => course.lessons))).toHaveLength(300);
  });
  it('keeps all lesson IDs unique and prevents duplicate instructional content hidden by different IDs', () => {
    const courses = Object.values(JOURNEY_COURSES).flatMap((levelCourses) => Object.values(levelCourses));
    const allLessons = courses.flatMap((course) => course.lessons);
    expect(allLessons).toHaveLength(300);
    expect(new Set(allLessons.map((lesson) => lesson.id)).size).toBe(300);

    const canonicalize = (value: unknown): unknown => {
      if (typeof value === 'string') return value.normalize('NFKC').replace(/\s+/g, ' ').trim().toLocaleLowerCase();
      if (Array.isArray(value)) return value.map(canonicalize);
      if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, item]) => [key, canonicalize(item)]));
      }
      return value;
    };
    const instructionalSignatures = allLessons.map((lesson) => JSON.stringify(canonicalize({
      objective: lesson.objective,
      sections: lesson.sections,
      practice: lesson.practice,
      starterCode: lesson.starterCode,
      example: lesson.example,
      summary: lesson.summary,
      hints: lesson.hints,
      commonMistakes: lesson.commonMistakes,
      knowledgeCheck: {
        prompt: lesson.knowledgeCheck.prompt,
        choices: lesson.knowledgeCheck.choices,
        correctChoiceId: lesson.knowledgeCheck.correctChoiceId,
        feedback: lesson.knowledgeCheck.feedback,
      },
    })));
    expect(new Set(instructionalSignatures).size).toBe(300);
  });
  it('resolves every course, all 300 lesson routes, assessments, and independent capstones', () => {
    for (const level of ['intermediate', 'professional'] as const) {
      for (const pathId of FOUNDATION_PATH_IDS) {
        const course = JOURNEY_COURSES[level][pathId];
        expect(resolveVantaRoute(getJourneyCourseHref(pathId, level))).toEqual({ kind: 'journey-course', pathId, level });
        expect(resolveVantaRoute(`${getJourneyCourseHref(pathId, level)}/assessment`)).toEqual({ kind: 'journey-assessment', pathId, level });
        for (const lesson of course.lessons) {
          expect(resolveVantaRoute(getJourneyLessonHref(pathId, level, lesson.id))).toEqual({ kind: 'journey-lesson', pathId, level, lessonId: lesson.id });
        }
      }
      expect(resolveVantaRoute(`/levels/${level}/project`)).toEqual({ kind: 'journey-project', level });
    }
    expect(resolveVantaRoute('/levels/html-fundamentals/beginner')).toEqual({ kind: 'beginner-course', pathId: 'html-fundamentals' });
  });
  it('defines staged independent projects with explicit manual review limits', () => {
    expect(JOURNEY_PROJECTS.intermediate.files.map(file => file.name)).toEqual(['index.html', 'styles.css', 'app.js']);
    expect(JOURNEY_PROJECTS.professional.files.map(file => file.name)).toContain('src/model.js');
    expect(JOURNEY_PROJECTS.professional.files.map(file => file.name)).toContain('tests/manual-checks.md');
    expect(JOURNEY_PROJECTS.intermediate.stages.length).toBeGreaterThanOrEqual(3);
    expect(JOURNEY_PROJECTS.professional.evaluation.map(item => item.en).join(' ').toLowerCase()).toContain('not');
  });
  it('uses the shared HTML/AST validation API and localizes feedback', () => {
    const lesson = JOURNEY_COURSES.intermediate['html-fundamentals'].lessons[0];
    const ar = validatePracticeRules('html', lesson.starterCode, lesson.validationRules, 'ar');
    const en = validatePracticeRules('html', lesson.starterCode, lesson.validationRules, 'en');
    expect(ar).toHaveLength(lesson.validationRules.length);
    expect(ar.every(result => result.label && result.explanation)).toBe(true);
    expect(ar.map(result => result.label)).not.toEqual(en.map(result => result.label));
  });
});
