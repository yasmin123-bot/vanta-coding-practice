export const HTML_PATH_ID = 'html-fundamentals' as const;

export const LEARNING_PATH_IDS = [
  HTML_PATH_ID,
  'css-fundamentals',
  'javascript-fundamentals',
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

export type HtmlLessonId = (typeof HTML_LESSON_IDS)[number];
export type AdditionalHtmlLessonId = Exclude<HtmlLessonId, 'html-introduction'>;

export const HTML_LESSON_ROUTES: Record<HtmlLessonId, string> = {
  'html-introduction': '/lesson/start',
  'html-headings-paragraphs': '/lesson/headings-paragraphs',
  'html-links-navigation': '/lesson/links-navigation',
  'html-images-attributes': '/lesson/images-attributes',
  'html-first-page': '/lesson/first-page',
};

export const LEARNING_PATHS: ReadonlyArray<{ id: LearningPathId; status: PathStatus }> = [
  { id: 'html-fundamentals', status: 'available' },
  { id: 'css-fundamentals', status: 'planned' },
  { id: 'javascript-fundamentals', status: 'planned' },
  { id: 'programming-fundamentals', status: 'future' },
  { id: 'problem-solving', status: 'future' },
];

export type VantaRoute =
  | { kind: 'landing' }
  | { kind: 'path-catalog' }
  | { kind: 'learning-path'; pathId: LearningPathId }
  | { kind: 'lesson'; lessonId: HtmlLessonId }
  | { kind: 'not-found' };

const validPathIds = new Set<string>(LEARNING_PATH_IDS);
const lessonIdByRoute = new Map(
  Object.entries(HTML_LESSON_ROUTES).map(([lessonId, route]) => [route, lessonId as HtmlLessonId]),
);

export function getLearningPathHref(pathId: LearningPathId): string {
  return `/paths/${pathId}`;
}

export function getHtmlLessonHref(lessonId: HtmlLessonId): string {
  return HTML_LESSON_ROUTES[lessonId];
}

export function resolveVantaRoute(pathname: string): VantaRoute {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  if (normalizedPath === '/') return { kind: 'landing' };
  if (normalizedPath === '/paths') return { kind: 'path-catalog' };

  const pathMatch = normalizedPath.match(/^\/paths\/([^/]+)$/);
  if (pathMatch && validPathIds.has(pathMatch[1])) {
    return { kind: 'learning-path', pathId: pathMatch[1] as LearningPathId };
  }

  const lessonId = lessonIdByRoute.get(normalizedPath);
  if (lessonId) return { kind: 'lesson', lessonId };

  return { kind: 'not-found' };
}
