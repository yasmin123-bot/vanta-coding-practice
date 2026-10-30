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

export const HTML_LESSON_IDS = [
  'html-introduction',
  'html-headings-paragraphs',
  'html-links-navigation',
  'html-images-attributes',
  'html-first-page',
] as const;

export const CSS_LESSON_IDS = [
  'css-what-is-css',
  'css-selectors',
  'css-colors-backgrounds',
  'css-typography',
  'css-box-model',
  'css-display-layout',
  'css-flexbox',
  'css-responsive',
] as const;

export const JAVASCRIPT_LESSON_IDS = [
  'js-what-is-javascript',
  'js-variables',
  'js-data-types',
  'js-operators',
  'js-conditionals',
  'js-functions',
  'js-arrays',
  'js-dom-basics',
  'js-events',
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
export type AdditionalHtmlLessonId = Exclude<HtmlLessonId, 'html-introduction'>;
export type StudentAuthMode = 'login' | 'signup' | 'forgot-password' | 'reset-password' | 'callback';
export type StudentProtectedPage = 'dashboard' | 'profile';

export const HTML_LESSON_ROUTES: Record<HtmlLessonId, string> = {
  'html-introduction': '/lesson/start',
  'html-headings-paragraphs': '/lesson/headings-paragraphs',
  'html-links-navigation': '/lesson/links-navigation',
  'html-images-attributes': '/lesson/images-attributes',
  'html-first-page': '/lesson/first-page',
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
  'js-what-is-javascript': '/lesson/javascript/what-is-javascript',
  'js-variables': '/lesson/javascript/variables',
  'js-data-types': '/lesson/javascript/data-types',
  'js-operators': '/lesson/javascript/operators',
  'js-conditionals': '/lesson/javascript/conditionals',
  'js-functions': '/lesson/javascript/functions',
  'js-arrays': '/lesson/javascript/arrays',
  'js-dom-basics': '/lesson/javascript/dom-basics',
  'js-events': '/lesson/javascript/events',
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
  | { kind: 'learning-path'; pathId: LearningPathId }
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
  if (normalizedPath === '/dashboard') return { kind: 'student-area', page: 'dashboard' };
  if (normalizedPath === '/profile') return { kind: 'student-area', page: 'profile' };

  const authMode = authModeByRoute.get(normalizedPath);
  if (authMode) return { kind: 'student-auth', mode: authMode };

  const pathMatch = normalizedPath.match(/^\/paths\/([^/]+)$/);
  if (pathMatch && validPathIds.has(pathMatch[1])) {
    return { kind: 'learning-path', pathId: pathMatch[1] as LearningPathId };
  }

  const lessonId = lessonIdByRoute.get(normalizedPath);
  if (lessonId) return { kind: 'lesson', lessonId };

  return { kind: 'not-found' };
}
