import { act, createElement, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import JourneyPage from '../src/components/JourneyPage';
import { FOUNDATION_PATH_IDS } from '../src/content/learningSystem';
import { JOURNEY_COURSES } from '../src/content/journeyCurriculum';
import { JOURNEY_PROJECTS } from '../src/content/journeyProjects';
import { recordJourneyAssessmentResult, recordJourneyLessonComplete, recordJourneyProjectReview, getJourneyCourseProgress, getJourneyProgress } from '../src/utils/journeyProgress';
import { getBeginnerLessons } from '../src/content/beginnerCurriculum';
import { recordSessionAssessmentPassed, recordSessionLessonComplete, recordSessionProjectCompleted } from '../src/utils/sessionBeginnerProgress';

const journeyCss = readFileSync('src/styles/journey.css', 'utf8');

vi.mock('../src/state/StudentProgressProvider', () => ({
  useStudentProgress: () => ({ lessons: [] }),
}));

vi.mock('../src/components/LearningHeader', () => ({ default: () => null }));

vi.mock('../src/components/PracticeCodeEditor', async () => {
  const React = await import('react');
  return {
    default: ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => React.createElement('textarea', {
      'aria-label': label,
      value,
      onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => onChange(event.currentTarget.value),
    }),
  };
});

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let host: HTMLDivElement | undefined;
let styleElement: HTMLStyleElement | undefined;

function mount(element: ReactElement) {
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  act(() => root!.render(element));
}

function unmount() {
  if (root) act(() => root!.unmount());
  root = undefined;
  host?.remove();
  host = undefined;
}

function clickButton(label: string) {
  const button = Array.from(host?.querySelectorAll<HTMLButtonElement>('button') ?? [])
    .find((candidate) => candidate.textContent?.includes(label));
  if (!button) throw new Error(`Could not find button containing: ${label}`);
  act(() => button.click());
}

function failStorageWritesFor(key: string) {
  const originalSetItem = Storage.prototype.setItem;
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, requestedKey: string, value: string) {
    if (requestedKey === key) throw new Error('storage unavailable');
    originalSetItem.call(this, requestedKey, value);
  });
}

function seedJourneyCourse(level: 'intermediate' | 'professional', pathId: (typeof FOUNDATION_PATH_IDS)[number]) {
  const course = JOURNEY_COURSES[level][pathId];
  for (const lesson of course.lessons) recordJourneyLessonComplete(level, pathId, lesson.id);
  recordJourneyAssessmentResult(level, pathId, course.passingScore);
}

function seedBeginnerPrerequisites(pathId: (typeof FOUNDATION_PATH_IDS)[number]) {
  for (const lesson of getBeginnerLessons(pathId)) recordSessionLessonComplete(pathId, lesson.id);
  recordSessionAssessmentPassed(pathId, 8);
  recordSessionProjectCompleted(pathId);
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  styleElement = document.createElement('style');
  styleElement.textContent = journeyCss;
  document.head.append(styleElement);
});

afterEach(() => {
  unmount();
  localStorage.clear();
  sessionStorage.clear();
  styleElement?.remove();
  styleElement = undefined;
  vi.restoreAllMocks();
});

describe('Mabda journey project pages and saved assessment results', () => {
  it.each(['en', 'ar'] as const)('renders all five units and 50 lessons in %s', (locale) => {
    const pathId = 'html-fundamentals';
    seedBeginnerPrerequisites(pathId);

    mount(createElement(JourneyPage, {
      locale,
      onSwitchLocale: vi.fn(),
      kind: 'course',
      pathId,
      level: 'intermediate',
    }));

    expect(host!.querySelectorAll('.journey-unit')).toHaveLength(5);
    expect(host!.querySelectorAll('.journey-row')).toHaveLength(50);
    expect(Array.from(host!.querySelectorAll('.journey-unit')).map((unit) => unit.querySelectorAll('.journey-row').length)).toEqual([10, 10, 10, 10, 10]);
    for (const unit of JOURNEY_COURSES.intermediate[pathId].units) {
      expect(Array.from(host!.querySelectorAll('.journey-unit')).some((node) => node.textContent?.includes(locale === 'ar' ? unit.title.ar : unit.title.en))).toBe(true);
    }
    expect(host!.textContent).toContain(locale === 'ar' ? '50 دروس' : '50 lessons');
  });

  it.each(['en', 'ar'] as const)('shows a bilingual lesson example, progressive hints, and quiz feedback in %s', (locale) => {
    const pathId = 'html-fundamentals';
    seedBeginnerPrerequisites(pathId);
    const lesson = JOURNEY_COURSES.intermediate[pathId].lessons[0];

    mount(createElement(JourneyPage, {
      locale,
      onSwitchLocale: vi.fn(),
      kind: 'lesson',
      pathId,
      level: 'intermediate',
      lessonId: lesson.id,
    }));

    expect(host!.textContent).toContain(locale === 'ar' ? 'مثال مشروح' : 'Worked example');
    expect(host!.querySelector('textarea[aria-label]')).not.toBeNull();
    expect(host!.querySelector('.journey-quick-check')).not.toBeNull();
    clickButton(locale === 'ar' ? 'أظهر التلميح الأول' : 'Reveal first hint');
    expect(host!.textContent).toContain(locale === 'ar' ? 'تلميح 1:' : 'Hint 1:');
    clickButton(locale === 'ar' ? 'أظهر التلميح التالي' : 'Reveal next hint');
    expect(host!.textContent).toContain(locale === 'ar' ? 'تلميح 2:' : 'Hint 2:');
    const correctChoice = lesson.knowledgeCheck.choices.find((choice) => choice.id === lesson.knowledgeCheck.correctChoiceId)!;
    const radio = host!.querySelector<HTMLInputElement>(`input[name="${lesson.knowledgeCheck.id}"][value="${correctChoice.id}"]`);
    const matchingRadio = Array.from(host!.querySelectorAll<HTMLInputElement>('input[type="radio"]'))
      .find((candidate) => candidate.parentElement?.textContent?.includes(locale === 'ar' ? correctChoice.text.ar : correctChoice.text.en));
    expect(radio ?? matchingRadio).not.toBeNull();
    act(() => (radio ?? matchingRadio)!.click());
    clickButton(locale === 'ar' ? 'تحقق من الإجابة' : 'Check answer');
    expect(host!.textContent).toContain(locale === 'ar' ? 'إجابة صحيحة.' : 'Correct.');
  });

  it.each((['intermediate', 'professional'] as const).flatMap((level) => FOUNDATION_PATH_IDS.map((pathId) => [level, pathId] as const)))(
    'preserves original IDs and saved course fields while %s / %s progress grows to 50 lessons',
    (level, pathId) => {
    const course = JOURNEY_COURSES[level][pathId];
    const oldIds = course.lessons.slice(0, 5).map((lesson) => lesson.id);
    localStorage.setItem('mabda-learning-journey-progress-v1', JSON.stringify({
      version: 1,
      courses: {
        [`${level}:${pathId}`]: {
          completedLessonIds: oldIds,
          assessmentPassed: true,
          assessmentBestScore: 5,
        },
      },
      projects: {},
    }));

    for (const lesson of course.lessons.slice(5)) {
      expect(recordJourneyLessonComplete(level, pathId, lesson.id)).toBe(true);
    }

    const restored = getJourneyCourseProgress(level, pathId);
    expect(restored.completedLessonIds).toHaveLength(50);
    expect(restored.completedLessonIds).toEqual(expect.arrayContaining(oldIds));
    expect(restored.assessmentPassed).toBe(true);
    expect(restored.assessmentBestScore).toBe(5);
    expect(restored.assessmentLastScore).toBeNull();
    },
  );

  it.each(['intermediate', 'professional'] as const)('renders and supports project stages for %s', (level) => {
    for (const pathId of FOUNDATION_PATH_IDS) seedJourneyCourse(level, pathId);

    mount(createElement(JourneyPage, {
      locale: 'en',
      onSwitchLocale: vi.fn(),
      kind: 'project',
      level,
    }));

    expect(host!.querySelector('h1')?.textContent).toBe(JOURNEY_PROJECTS[level].title.en);
    expect(host!.querySelectorAll('.journey-stage-nav button')).toHaveLength(JOURNEY_PROJECTS[level].stages.length);
    expect(host!.querySelectorAll('.journey-project-file textarea')).toHaveLength(JOURNEY_PROJECTS[level].files.length);
    expect(host!.querySelector('.journey-project-evaluation')).not.toBeNull();

    const summary = host!.querySelector('.journey-stage details summary');
    expect(summary).not.toBeNull();
    act(() => summary!.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(host!.querySelector('.journey-stage details')?.hasAttribute('open')).toBe(true);

    clickButton('Mark stage complete');
    expect(getJourneyProgress().projects[level]?.completedStageIds).toContain(JOURNEY_PROJECTS[level].stages[0].id);
    expect(host!.querySelector('.journey-stage .eyebrow')?.textContent).toContain('2/');
  });

  it.each(['en', 'ar'] as const)('requires explicit self-attested review for manual exercises in %s', (locale) => {
    for (const pathId of FOUNDATION_PATH_IDS) seedJourneyCourse('intermediate', pathId);
    recordJourneyProjectReview('intermediate', true, true);
    const pathId = 'css-fundamentals';
    const course = JOURNEY_COURSES.professional[pathId];
    const lesson = course.lessons.find((item) => item.id === 'css-p-critical-css')!;
    for (const priorLesson of course.lessons.slice(0, lesson.sequence - 1)) {
      recordJourneyLessonComplete('professional', pathId, priorLesson.id);
    }
    expect(lesson.manualReview).toBe(true);
    expect(lesson.validationRules).toHaveLength(0);

    mount(createElement(JourneyPage, {
      locale,
      onSwitchLocale: vi.fn(),
      kind: 'lesson',
      pathId,
      level: 'professional',
      lessonId: lesson.id,
    }));

    expect(host!.textContent).toContain(locale === 'ar' ? 'لا تتحقق المنصة من صحة الملاحظة' : 'Mabda does not verify the observation');
    const reviewButton = Array.from(host!.querySelectorAll<HTMLButtonElement>('button'))
      .find((candidate) => candidate.textContent?.includes(locale === 'ar' ? 'تأكيد المراجعة اليدوية' : 'Record manual review'))!;
    expect(reviewButton.disabled).toBe(true);
    const confirmation = host!.querySelector<HTMLInputElement>('.journey-rubric input[type="checkbox"]')!;
    act(() => confirmation.click());
    expect(reviewButton.disabled).toBe(false);
    act(() => reviewButton.click());

    expect(getJourneyCourseProgress('professional', pathId).completedLessonIds).toContain(lesson.id);
    expect(host!.textContent).toContain(locale === 'ar' ? 'لم تُنفّذ الشيفرة' : 'The code was not executed');
  });

  it('does not claim manual lesson completion when local progress cannot be saved', () => {
    const pathId = 'css-fundamentals';
    for (const foundationPathId of FOUNDATION_PATH_IDS) seedJourneyCourse('intermediate', foundationPathId);
    recordJourneyProjectReview('intermediate', true, true);

    const course = JOURNEY_COURSES.professional[pathId];
    const lesson = course.lessons.find((item) => item.manualReview)!;
    for (const priorLesson of course.lessons.slice(0, lesson.sequence - 1)) {
      recordJourneyLessonComplete('professional', pathId, priorLesson.id);
    }
    failStorageWritesFor('mabda-learning-journey-progress-v1');

    mount(createElement(JourneyPage, {
      locale: 'en',
      onSwitchLocale: vi.fn(),
      kind: 'lesson',
      pathId,
      level: 'professional',
      lessonId: lesson.id,
    }));

    const confirmation = host!.querySelector<HTMLInputElement>('.journey-rubric input[type="checkbox"]')!;
    act(() => confirmation.click());
    clickButton('Record manual review');

    expect(host!.querySelector('[role="alert"]')?.textContent).toContain('Could not save progress');
    expect(host!.textContent).not.toContain('Manual review recorded.');
    expect(getJourneyCourseProgress('professional', pathId).completedLessonIds).not.toContain(lesson.id);
  });

  it('does not advance or claim a project stage when local progress cannot be saved', () => {
    for (const pathId of FOUNDATION_PATH_IDS) seedJourneyCourse('intermediate', pathId);
    failStorageWritesFor('mabda-learning-journey-progress-v1');

    mount(createElement(JourneyPage, {
      locale: 'en',
      onSwitchLocale: vi.fn(),
      kind: 'project',
      level: 'intermediate',
    }));

    clickButton('Mark stage complete');

    expect(host!.querySelector('[role="alert"]')?.textContent).toContain('Could not save progress');
    expect(host!.querySelector('.journey-stage .eyebrow')?.textContent).toContain('1/');
    expect(getJourneyProgress().projects.intermediate?.completedStageIds ?? []).toEqual([]);
  });

  it('reports when a completed assessment result could not be persisted', () => {
    const pathId = 'html-fundamentals';
    seedBeginnerPrerequisites(pathId);
    const course = JOURNEY_COURSES.intermediate[pathId];
    for (const lesson of course.lessons) recordJourneyLessonComplete('intermediate', pathId, lesson.id);
    failStorageWritesFor('mabda-learning-journey-progress-v1');

    mount(createElement(JourneyPage, {
      locale: 'en',
      onSwitchLocale: vi.fn(),
      kind: 'assessment',
      pathId,
      level: 'intermediate',
    }));

    clickButton('Submit assessment');

    expect(host!.textContent).toContain(`Score 0/${course.assessment.length}`);
    expect(host!.querySelector('[role="alert"]')?.textContent).toContain('Could not save progress');
    expect(getJourneyCourseProgress('intermediate', pathId).assessmentLastScore).toBeNull();
  });

  it('restores the latest assessment result, preserves a prior pass, and lets the learner explicitly retry', () => {
    const pathId = 'html-fundamentals';
    const course = JOURNEY_COURSES.intermediate[pathId];
    seedBeginnerPrerequisites(pathId);
    seedJourneyCourse('intermediate', pathId);
    recordJourneyAssessmentResult('intermediate', pathId, 0);
    recordJourneyAssessmentResult('intermediate', pathId, course.passingScore);

    mount(createElement(JourneyPage, {
      locale: 'en',
      onSwitchLocale: vi.fn(),
      kind: 'assessment',
      pathId,
      level: 'intermediate',
    }));

    expect(host!.textContent).toContain(`Latest result: ${course.passingScore}/${course.assessment.length}`);
    expect(host!.textContent).toContain('Assessment passed.');
    expect(host!.querySelectorAll('.journey-question')).toHaveLength(0);

    clickButton('Start a new attempt');
    expect(host!.querySelectorAll('.journey-question')).toHaveLength(course.assessment.length);
    clickButton('Submit assessment');

    const saved = getJourneyCourseProgress('intermediate', pathId);
    expect(saved.assessmentLastScore).toBe(0);
    expect(saved.assessmentBestScore).toBe(course.passingScore);
    expect(saved.assessmentPassed).toBe(true);
    expect(host!.textContent).toContain(`Score 0/${course.assessment.length}`);
    expect(host!.textContent).toContain('A previous pass is preserved');

    unmount();
    mount(createElement(JourneyPage, {
      locale: 'en',
      onSwitchLocale: vi.fn(),
      kind: 'assessment',
      pathId,
      level: 'intermediate',
    }));
    expect(host!.textContent).toContain(`Latest result: 0/${course.assessment.length}`);
    expect(host!.textContent).toContain('A previous pass is preserved');
  });

  it('keeps old saved best-score records readable without claiming they are the latest attempt', () => {
    const pathId = 'html-fundamentals';
    localStorage.setItem('mabda-learning-journey-progress-v1', JSON.stringify({
      version: 1,
      courses: {
        [`intermediate:${pathId}`]: {
          completedLessonIds: JOURNEY_COURSES.intermediate[pathId].lessons.map((lesson) => lesson.id),
          assessmentPassed: true,
          assessmentBestScore: 4,
        },
      },
      projects: {},
    }));

    const progress = getJourneyCourseProgress('intermediate', pathId);
    expect(progress.assessmentBestScore).toBe(4);
    expect(progress.assessmentLastScore).toBeNull();
  });
});

describe('journey responsive overflow guards', () => {
  it('keeps lesson columns and editor containers shrinkable while confining code scrolling', () => {
    host = document.createElement('div');
    host.innerHTML = '<main class="learning-system-main"><div class="journey-lesson-grid"><article class="journey-learning-copy"><pre>code</pre></article><section><div class="practice-codemirror"><div class="cm-editor"><div class="cm-scroller"></div></div></div></section></div></main>';
    host.className = 'journey-page';
    document.body.append(host);

    const main = host.querySelector('.learning-system-main')!;
    const grid = host.querySelector('.journey-lesson-grid')!;
    const editor = host.querySelector('.practice-codemirror')!;
    const scroller = host.querySelector('.cm-scroller')!;
    const pre = host.querySelector('pre')!;
    expect(getComputedStyle(main).minWidth).toBe('0px');
    expect(getComputedStyle(grid).minWidth).toBe('0px');
    expect(getComputedStyle(editor).maxWidth).toBe('100%');
    expect(getComputedStyle(scroller).overflowX).toBe('auto');
    expect(getComputedStyle(pre).overflowX).toBe('auto');
  });
});
