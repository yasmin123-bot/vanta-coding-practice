export const HTML_PATH_ID = 'html-fundamentals' as const;
export const CSS_PATH_ID = 'css-fundamentals' as const;
export const JAVASCRIPT_PATH_ID = 'javascript-fundamentals' as const;

export const FOUNDATION_PATH_IDS = [HTML_PATH_ID, CSS_PATH_ID, JAVASCRIPT_PATH_ID] as const;
export type FoundationPathId = (typeof FOUNDATION_PATH_IDS)[number];

export const LEARNING_PATH_IDS = [
  ...FOUNDATION_PATH_IDS,
  'programming-fundamentals',
  'problem-solving',
] as const;

export type LearningPathId = (typeof LEARNING_PATH_IDS)[number];
export type PathStatus = 'available' | 'planned' | 'future';

export const LEARNING_PATH_ARTWORK: Record<LearningPathId, string> = {
  'html-fundamentals': '/assets/mabda-path-cards/html.jpg',
  'css-fundamentals': '/assets/mabda-path-cards/css.png',
  'javascript-fundamentals': '/assets/mabda-path-cards/javascript.png',
  'programming-fundamentals': '/assets/mabda-path-cards/programming-principles.png',
  'problem-solving': '/assets/mabda-path-cards/problem-solving.png',
};

export const HTML_LESSON_IDS = [
  'html-introduction',
  'html-headings-paragraphs',
  'html-links-navigation',
  'html-images-attributes',
  'html-first-page',
  'html-document-metadata',
  'html-semantic-structure',
  'html-lists-tables',
  'html-accessible-forms',
  'html-form-validation',
  'html-media',
  'html-multi-section-page',
] as const;

export const CSS_LESSON_IDS = [
  'css-what-is-css',
  'css-selectors',
  'css-colors-backgrounds',
  'css-typography',
  'css-specificity-inheritance',
  'css-box-model',
  'css-display-layout',
  'css-sizing-units',
  'css-display-visibility',
  'css-positioning',
  'css-flexbox',
  'css-responsive',
  'css-grid',
  'css-responsive-page',
  'css-pseudo-selectors',
  'css-custom-properties',
  'css-web-fonts-surfaces',
  'css-motion',
  'css-layout-debugging',
] as const;

export const JAVASCRIPT_LESSON_IDS = [
  'js-what-is-javascript',
  'js-variables',
  'js-data-types',
  'js-operators',
  'js-conditionals',
  'js-loops',
  'js-type-conversion',
  'js-functions',
  'js-arrays',
  'js-functions-scope',
  'js-objects',
  'js-array-methods',
  'js-string-number-methods',
  'js-dom-basics',
  'js-events',
  'js-dom-manipulation',
  'js-form-interactions',
  'js-json',
  'js-local-storage',
  'js-error-handling',
  'js-promises-async',
  'js-fetch',
  'js-modules-organization',
] as const;

export const LEGACY_CSS_LESSON_IDS = [
  'css-what-is-css', 'css-selectors', 'css-colors-backgrounds', 'css-typography',
  'css-box-model', 'css-display-layout', 'css-flexbox', 'css-responsive',
] as const;
export const LEGACY_JAVASCRIPT_LESSON_IDS = [
  'js-what-is-javascript', 'js-variables', 'js-data-types', 'js-operators', 'js-conditionals',
  'js-functions', 'js-arrays', 'js-dom-basics', 'js-events',
] as const;

export const LEGACY_FOUNDATION_LESSON_IDS = [
  'html-introduction', 'html-headings-paragraphs', 'html-links-navigation', 'html-images-attributes', 'html-first-page',
  ...LEGACY_CSS_LESSON_IDS,
  ...LEGACY_JAVASCRIPT_LESSON_IDS,
] as const;

export const FOUNDATION_LESSON_IDS = [
  ...HTML_LESSON_IDS,
  ...CSS_LESSON_IDS,
  ...JAVASCRIPT_LESSON_IDS,
] as const;

export type HtmlLessonId = (typeof HTML_LESSON_IDS)[number];
export type CssLessonId = (typeof CSS_LESSON_IDS)[number];
export type JavaScriptLessonId = (typeof JAVASCRIPT_LESSON_IDS)[number];
export type FoundationLessonId = (typeof FOUNDATION_LESSON_IDS)[number];
export type LegacyFoundationLessonId = (typeof LEGACY_FOUNDATION_LESSON_IDS)[number];
export type AdditionalHtmlLessonId = Exclude<HtmlLessonId, 'html-introduction'>;
export type FoundationStageId =
  | 'html-markup-foundations' | 'html-document-structure' | 'html-information-and-forms' | 'html-applied-pages'
  | 'css-cascade-and-rules' | 'css-box-and-position' | 'css-layout-systems' | 'css-visual-systems' | 'css-debug-and-build'
  | 'js-language-foundations' | 'js-data-and-functions' | 'js-browser-interaction' | 'js-data-and-reliability' | 'js-async-and-organization';

export const FOUNDATION_PATH_STAGE_LESSONS: Record<FoundationPathId, readonly { id: FoundationStageId; lessonIds: readonly FoundationLessonId[] }[]> = {
  [HTML_PATH_ID]: [
    { id: 'html-markup-foundations', lessonIds: ['html-introduction', 'html-headings-paragraphs', 'html-links-navigation'] },
    { id: 'html-document-structure', lessonIds: ['html-images-attributes', 'html-first-page', 'html-document-metadata', 'html-semantic-structure'] },
    { id: 'html-information-and-forms', lessonIds: ['html-lists-tables', 'html-accessible-forms', 'html-form-validation'] },
    { id: 'html-applied-pages', lessonIds: ['html-media', 'html-multi-section-page'] },
  ],
  [CSS_PATH_ID]: [
    { id: 'css-cascade-and-rules', lessonIds: ['css-what-is-css', 'css-selectors', 'css-colors-backgrounds', 'css-typography', 'css-specificity-inheritance'] },
    { id: 'css-box-and-position', lessonIds: ['css-box-model', 'css-display-layout', 'css-sizing-units', 'css-display-visibility', 'css-positioning'] },
    { id: 'css-layout-systems', lessonIds: ['css-flexbox', 'css-responsive', 'css-grid', 'css-responsive-page'] },
    { id: 'css-visual-systems', lessonIds: ['css-pseudo-selectors', 'css-custom-properties', 'css-web-fonts-surfaces', 'css-motion'] },
    { id: 'css-debug-and-build', lessonIds: ['css-layout-debugging'] },
  ],
  [JAVASCRIPT_PATH_ID]: [
    { id: 'js-language-foundations', lessonIds: ['js-what-is-javascript', 'js-variables', 'js-data-types', 'js-operators', 'js-conditionals', 'js-loops', 'js-type-conversion'] },
    { id: 'js-data-and-functions', lessonIds: ['js-functions', 'js-arrays', 'js-functions-scope', 'js-objects', 'js-array-methods', 'js-string-number-methods'] },
    { id: 'js-browser-interaction', lessonIds: ['js-dom-basics', 'js-events', 'js-dom-manipulation', 'js-form-interactions'] },
    { id: 'js-data-and-reliability', lessonIds: ['js-json', 'js-local-storage', 'js-error-handling'] },
    { id: 'js-async-and-organization', lessonIds: ['js-promises-async', 'js-fetch', 'js-modules-organization'] },
  ],
};

const stageIdByLesson = Object.fromEntries(
  Object.values(FOUNDATION_PATH_STAGE_LESSONS).flatMap((stages) => (
    stages.flatMap((stage) => stage.lessonIds.map((lessonId) => [lessonId, stage.id] as const))
  )),
) as Record<FoundationLessonId, FoundationStageId>;

export function getFoundationStageId(lessonId: FoundationLessonId): FoundationStageId {
  return stageIdByLesson[lessonId];
}

export type StudentAuthMode = 'login' | 'signup' | 'forgot-password' | 'reset-password' | 'callback';
export type StudentProtectedPage = 'dashboard' | 'profile';

export const HTML_LESSON_ROUTES: Record<HtmlLessonId, string> = {
  'html-introduction': '/lesson/start',
  'html-headings-paragraphs': '/lesson/headings-paragraphs',
  'html-links-navigation': '/lesson/links-navigation',
  'html-images-attributes': '/lesson/images-attributes',
  'html-first-page': '/lesson/first-page',
  'html-document-metadata': '/lesson/document-metadata',
  'html-semantic-structure': '/lesson/semantic-structure',
  'html-lists-tables': '/lesson/lists-tables',
  'html-accessible-forms': '/lesson/accessible-forms',
  'html-form-validation': '/lesson/form-validation',
  'html-media': '/lesson/media',
  'html-multi-section-page': '/lesson/multi-section-page',
};

export const FOUNDATION_LESSON_ROUTES: Record<FoundationLessonId, string> = {
  ...HTML_LESSON_ROUTES,
  'css-what-is-css': '/lesson/css/what-is-css',
  'css-selectors': '/lesson/css/selectors',
  'css-colors-backgrounds': '/lesson/css/colors-backgrounds',
  'css-typography': '/lesson/css/typography',
  'css-box-model': '/lesson/css/box-model',
  'css-display-layout': '/lesson/css/display-layout',
  'css-flexbox': '/lesson/css/flexbox',
  'css-responsive': '/lesson/css/responsive',
  'css-specificity-inheritance': '/lesson/css/specificity-inheritance',
  'css-sizing-units': '/lesson/css/sizing-units',
  'css-display-visibility': '/lesson/css/display-visibility',
  'css-positioning': '/lesson/css/positioning',
  'css-grid': '/lesson/css/grid',
  'css-pseudo-selectors': '/lesson/css/pseudo-selectors',
  'css-custom-properties': '/lesson/css/custom-properties',
  'css-web-fonts-surfaces': '/lesson/css/web-fonts-surfaces',
  'css-motion': '/lesson/css/motion',
  'css-layout-debugging': '/lesson/css/layout-debugging',
  'css-responsive-page': '/lesson/css/responsive-page',
  'js-what-is-javascript': '/lesson/javascript/what-is-javascript',
  'js-variables': '/lesson/javascript/variables',
  'js-data-types': '/lesson/javascript/data-types',
  'js-operators': '/lesson/javascript/operators',
  'js-conditionals': '/lesson/javascript/conditionals',
  'js-functions': '/lesson/javascript/functions',
  'js-arrays': '/lesson/javascript/arrays',
  'js-dom-basics': '/lesson/javascript/dom-basics',
  'js-events': '/lesson/javascript/events',
  'js-loops': '/lesson/javascript/loops',
  'js-type-conversion': '/lesson/javascript/type-conversion',
  'js-functions-scope': '/lesson/javascript/functions-scope',
  'js-objects': '/lesson/javascript/objects',
  'js-array-methods': '/lesson/javascript/array-methods',
  'js-string-number-methods': '/lesson/javascript/string-number-methods',
  'js-dom-manipulation': '/lesson/javascript/dom-manipulation',
  'js-form-interactions': '/lesson/javascript/form-interactions',
  'js-json': '/lesson/javascript/json',
  'js-local-storage': '/lesson/javascript/local-storage',
  'js-error-handling': '/lesson/javascript/error-handling',
  'js-promises-async': '/lesson/javascript/promises-async',
  'js-fetch': '/lesson/javascript/fetch',
  'js-modules-organization': '/lesson/javascript/modules-organization',
};

export const FOUNDATION_LESSON_IDS_BY_PATH: Record<FoundationPathId, readonly FoundationLessonId[]> = {
  [HTML_PATH_ID]: HTML_LESSON_IDS,
  [CSS_PATH_ID]: CSS_LESSON_IDS,
  [JAVASCRIPT_PATH_ID]: JAVASCRIPT_LESSON_IDS,
};

const lessonPathEntries = FOUNDATION_PATH_IDS.flatMap((pathId) => (
  FOUNDATION_LESSON_IDS_BY_PATH[pathId].map((lessonId) => [lessonId, pathId] as const)
));
export const FOUNDATION_PATH_BY_LESSON = Object.fromEntries(lessonPathEntries) as Record<FoundationLessonId, FoundationPathId>;

export const LEARNING_PATHS: ReadonlyArray<{ id: LearningPathId; status: PathStatus }> = [
  { id: HTML_PATH_ID, status: 'available' },
  { id: CSS_PATH_ID, status: 'available' },
  { id: JAVASCRIPT_PATH_ID, status: 'available' },
  { id: 'programming-fundamentals', status: 'future' },
  { id: 'problem-solving', status: 'future' },
];

export type VantaRoute =
  | { kind: 'landing' }
  | { kind: 'path-catalog' }
  | { kind: 'levels' }
  | { kind: 'beginner-course'; pathId: FoundationPathId }
  | { kind: 'placement-test'; pathId: FoundationPathId }
  | { kind: 'beginner-lesson'; pathId: FoundationPathId; lessonId: string }
  | { kind: 'beginner-project'; pathId: FoundationPathId }
  | { kind: 'journey-course'; pathId: FoundationPathId; level: 'intermediate' | 'professional' }
  | { kind: 'journey-lesson'; pathId: FoundationPathId; level: 'intermediate' | 'professional'; lessonId: string }
  | { kind: 'journey-assessment'; pathId: FoundationPathId; level: 'intermediate' | 'professional' }
  | { kind: 'journey-project'; level: 'intermediate' | 'professional' }
  | { kind: 'learning-path'; pathId: LearningPathId }
  | { kind: 'path-assessment'; pathId: FoundationPathId }
  | { kind: 'guided-projects' }
  | { kind: 'lesson'; lessonId: FoundationLessonId }
  | { kind: 'student-auth'; mode: StudentAuthMode }
  | { kind: 'student-area'; page: StudentProtectedPage }
  | { kind: 'not-found' };

const validPathIds = new Set<string>(LEARNING_PATH_IDS);
const lessonIdByRoute = new Map(
  Object.entries(FOUNDATION_LESSON_ROUTES).map(([lessonId, route]) => [route, lessonId as FoundationLessonId]),
);
const authModeByRoute = new Map<string, StudentAuthMode>([
  ['/login', 'login'],
  ['/signup', 'signup'],
  ['/forgot-password', 'forgot-password'],
  ['/reset-password', 'reset-password'],
  ['/auth/callback', 'callback'],
]);

export function getLearningPathHref(pathId: LearningPathId): string {
  return `/paths/${pathId}`;
}

export function getPathAssessmentHref(pathId: FoundationPathId): string {
  return `/assessment/${pathId}`;
}

export function getLearningLevelsHref(): string {
  return '/levels';
}

export function getBeginnerCourseHref(pathId: FoundationPathId): string {
  return `/levels/${pathId}/beginner`;
}

export function getJourneyCourseHref(pathId: FoundationPathId, level: 'intermediate' | 'professional'): string {
  return `/levels/${pathId}/${level}`;
}
export function getJourneyLessonHref(pathId: FoundationPathId, level: 'intermediate' | 'professional', lessonId: string): string {
  return `${getJourneyCourseHref(pathId, level)}/lesson/${encodeURIComponent(lessonId)}`;
}

export function getPlacementTestHref(pathId: FoundationPathId): string {
  return `/levels/${pathId}/placement`;
}

export function getBeginnerAssessmentHref(pathId: FoundationPathId): string {
  return `${getPathAssessmentHref(pathId)}?level=beginner`;
}

export function getBeginnerLessonHref(pathId: FoundationPathId, lessonId: string): string {
  return `${getBeginnerCourseHref(pathId)}/lesson/${encodeURIComponent(lessonId)}`;
}

export function getBeginnerProjectHref(pathId: FoundationPathId): string {
  return `${getBeginnerCourseHref(pathId)}/project`;
}

export function getLessonHref(lessonId: FoundationLessonId): string {
  return FOUNDATION_LESSON_ROUTES[lessonId];
}

export function getHtmlLessonHref(lessonId: HtmlLessonId): string {
  return HTML_LESSON_ROUTES[lessonId];
}

export function getPathLessonIds(pathId: FoundationPathId): readonly FoundationLessonId[] {
  return FOUNDATION_LESSON_IDS_BY_PATH[pathId];
}

export function getPathForLesson(lessonId: FoundationLessonId): FoundationPathId {
  return FOUNDATION_PATH_BY_LESSON[lessonId];
}

export function resolveVantaRoute(pathname: string): VantaRoute {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  if (normalizedPath === '/') return { kind: 'landing' };
  if (normalizedPath === '/paths') return { kind: 'path-catalog' };
  if (normalizedPath === '/levels') return { kind: 'levels' };
  if (normalizedPath === '/projects') return { kind: 'guided-projects' };
  if (normalizedPath === '/dashboard') return { kind: 'student-area', page: 'dashboard' };
  if (normalizedPath === '/profile') return { kind: 'student-area', page: 'profile' };

  const standaloneProjectMatch = normalizedPath.match(/^\/levels\/(intermediate|professional)\/project$/);
  if (standaloneProjectMatch) return { kind: 'journey-project', level: standaloneProjectMatch[1] as 'intermediate' | 'professional' };

  const journeyMatch = normalizedPath.match(/^\/levels\/([^/]+)\/(intermediate|professional)(?:\/(assessment|project|lesson\/([^/]+)))?$/);
  if (journeyMatch && FOUNDATION_PATH_IDS.includes(journeyMatch[1] as FoundationPathId)) {
    const pathId = journeyMatch[1] as FoundationPathId;
    const level = journeyMatch[2] as 'intermediate' | 'professional';
    if (journeyMatch[3] === 'assessment') return { kind: 'journey-assessment', pathId, level };
    if (journeyMatch[3] === 'project') return { kind: 'journey-project', level };
    if (journeyMatch[4]) {
      try { return { kind: 'journey-lesson', pathId, level, lessonId: decodeURIComponent(journeyMatch[4]) }; }
      catch { return { kind: 'not-found' }; }
    }
    return { kind: 'journey-course', pathId, level };
  }

  const authMode = authModeByRoute.get(normalizedPath);
  if (authMode) return { kind: 'student-auth', mode: authMode };

  const pathMatch = normalizedPath.match(/^\/paths\/([^/]+)$/);
  if (pathMatch && validPathIds.has(pathMatch[1])) {
    return { kind: 'learning-path', pathId: pathMatch[1] as LearningPathId };
  }

  const beginnerProjectMatch = normalizedPath.match(/^\/levels\/([^/]+)\/beginner\/project$/);
  if (beginnerProjectMatch && FOUNDATION_PATH_IDS.includes(beginnerProjectMatch[1] as FoundationPathId)) {
    return { kind: 'beginner-project', pathId: beginnerProjectMatch[1] as FoundationPathId };
  }

  const beginnerLessonMatch = normalizedPath.match(/^\/levels\/([^/]+)\/beginner\/lesson\/([^/]+)$/);
  if (beginnerLessonMatch && FOUNDATION_PATH_IDS.includes(beginnerLessonMatch[1] as FoundationPathId)) {
    try {
      return {
        kind: 'beginner-lesson',
        pathId: beginnerLessonMatch[1] as FoundationPathId,
        lessonId: decodeURIComponent(beginnerLessonMatch[2]),
      };
    } catch {
      return { kind: 'not-found' };
    }
  }

  const placementMatch = normalizedPath.match(/^\/levels\/([^/]+)\/placement$/);
  if (placementMatch && FOUNDATION_PATH_IDS.includes(placementMatch[1] as FoundationPathId)) {
    return { kind: 'placement-test', pathId: placementMatch[1] as FoundationPathId };
  }

  const beginnerCourseMatch = normalizedPath.match(/^\/levels\/([^/]+)\/beginner$/);
  if (beginnerCourseMatch && FOUNDATION_PATH_IDS.includes(beginnerCourseMatch[1] as FoundationPathId)) {
    return { kind: 'beginner-course', pathId: beginnerCourseMatch[1] as FoundationPathId };
  }

  const assessmentMatch = normalizedPath.match(/^\/assessment\/([^/]+)$/);
  if (assessmentMatch && FOUNDATION_PATH_IDS.includes(assessmentMatch[1] as FoundationPathId)) {
    return { kind: 'path-assessment', pathId: assessmentMatch[1] as FoundationPathId };
  }

  const lessonId = lessonIdByRoute.get(normalizedPath);
  if (lessonId) return { kind: 'lesson', lessonId };

  return { kind: 'not-found' };
}
