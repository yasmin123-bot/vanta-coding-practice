import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BEGINNER_LESSONS } from '../src/content/beginnerCurriculum';
import { FOUNDATION_PATH_IDS } from '../src/content/learningSystem';
import {
  getBeginnerAssessmentHref,
  getBeginnerCourseHref,
  getBeginnerLessonHref,
  getBeginnerProjectHref,
  getLearningLevelsHref,
  getPlacementTestHref,
  resolveVantaRoute,
} from '../src/content/learningSystem';

describe('Beginner curriculum routes', () => {
  it('builds stable subject-scoped URLs', () => {
    expect(getLearningLevelsHref()).toBe('/levels');
    expect(getBeginnerCourseHref('html-fundamentals')).toBe('/levels/html-fundamentals/beginner');
    expect(getPlacementTestHref('css-fundamentals')).toBe('/levels/css-fundamentals/placement');
    expect(getBeginnerLessonHref('javascript-fundamentals', 'javascript-b-002-console-debugging'))
      .toBe('/levels/javascript-fundamentals/beginner/lesson/javascript-b-002-console-debugging');
    expect(getBeginnerProjectHref('html-fundamentals'))
      .toBe('/levels/html-fundamentals/beginner/project');
    expect(getBeginnerAssessmentHref('html-fundamentals'))
      .toBe('/assessment/html-fundamentals?level=beginner');
  });

  it('resolves each dedicated page and preserves legacy routes', () => {
    expect(resolveVantaRoute('/levels')).toEqual({ kind: 'levels' });
    expect(resolveVantaRoute('/levels/html-fundamentals/beginner'))
      .toEqual({ kind: 'beginner-course', pathId: 'html-fundamentals' });
    expect(resolveVantaRoute('/levels/css-fundamentals/placement'))
      .toEqual({ kind: 'placement-test', pathId: 'css-fundamentals' });
    expect(resolveVantaRoute('/levels/javascript-fundamentals/beginner/lesson/js-b-001-intro'))
      .toEqual({ kind: 'beginner-lesson', pathId: 'javascript-fundamentals', lessonId: 'js-b-001-intro' });
    expect(resolveVantaRoute('/levels/html-fundamentals/beginner/project'))
      .toEqual({ kind: 'beginner-project', pathId: 'html-fundamentals' });
    expect(resolveVantaRoute('/paths/html-fundamentals'))
      .toEqual({ kind: 'learning-path', pathId: 'html-fundamentals' });
    expect(resolveVantaRoute('/lesson/start'))
      .toEqual({ kind: 'lesson', lessonId: 'html-introduction' });
  });

  it('lists every Beginner lesson and required page in the static route manifest', () => {
    const manifest = JSON.parse(readFileSync(resolve(process.cwd(), 'public/manus-routes.json'), 'utf8')) as { routes: Array<{ path: string }> };
    const paths = new Set(manifest.routes.map((route) => route.path));
    expect(paths.has('/levels')).toBe(true);
    for (const pathId of FOUNDATION_PATH_IDS) {
      expect(paths.has(getBeginnerCourseHref(pathId))).toBe(true);
      expect(paths.has(getPlacementTestHref(pathId))).toBe(true);
      expect(paths.has(getBeginnerProjectHref(pathId))).toBe(true);
      expect(paths.has(getBeginnerAssessmentHref(pathId))).toBe(true);
      for (const lesson of BEGINNER_LESSONS[pathId]) {
        expect(paths.has(getBeginnerLessonHref(pathId, lesson.id))).toBe(true);
      }
    }
    expect(paths.size).toBe(manifest.routes.length);
  });

  it('rejects unknown subjects and malformed encoded lesson paths', () => {
    expect(resolveVantaRoute('/levels/problem-solving/beginner')).toEqual({ kind: 'not-found' });
    expect(resolveVantaRoute('/levels/no-such-path/placement')).toEqual({ kind: 'not-found' });
    expect(resolveVantaRoute('/levels/html-fundamentals/beginner/lesson/%E0%A4%A'))
      .toEqual({ kind: 'not-found' });
  });
});
