import { HTML_LESSON_IDS, LEARNING_PATHS, getHtmlLessonHref, getLearningPathHref, type LearningPathId, type PathStatus } from '../content/learningSystem';
import { messages, type Locale } from '../i18n/messages';
import { readSessionProgress } from '../state/sessionProgress';
import LearningHeader from './LearningHeader';

type LearningSystemRoute =
  | { kind: 'path-catalog' }
  | { kind: 'learning-path'; pathId: LearningPathId }
  | { kind: 'not-found' };

type LearningSystemPageProps = {
  locale: Locale;
  onSwitchLocale: () => void;
  route: LearningSystemRoute;
};

function fillTemplate(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

function statusLabel(status: PathStatus, ui: ReturnType<typeof getUi>) {
  if (status === 'available') return ui.available;
  if (status === 'planned') return ui.planned;
  return ui.future;
}

function getUi(locale: Locale) {
  return messages[locale].learningSystem.ui;
}

function LearningSystemPage({ locale, onSwitchLocale, route }: LearningSystemPageProps) {
  const landingCopy = messages[locale];
  const copy = landingCopy.learningSystem;
  const ui = copy.ui;
  const isArabic = locale === 'ar';
  const progress = readSessionProgress();
  const completed = new Set(progress.completedLessonIds);
  const completedCount = progress.completedLessonIds.length;
  const nextLessonId = HTML_LESSON_IDS.find((lessonId) => !completed.has(lessonId))
    ?? HTML_LESSON_IDS[HTML_LESSON_IDS.length - 1];

  let metaStageLabel: string | undefined;
  if (route.kind === 'learning-path') {
    metaStageLabel = copy.paths[route.pathId].title;
  } else if (route.kind === 'not-found') {
    metaStageLabel = ui.notFoundTitle;
  }

  return (
    <div className={`app-shell learning-system-page ${isArabic ? 'is-arabic' : 'is-english'}`}>
      <LearningHeader
        locale={locale}
        onSwitchLocale={onSwitchLocale}
        allPathsLabel={ui.allPaths}
        homeLabel={ui.home}
        stageLabel={metaStageLabel}
      />

      <main className="learning-system-main section-frame">
        {route.kind === 'path-catalog' && (
          <>
            <header className="learning-system-intro">
              <p className="eyebrow"><span className="eyebrow-line" />{copy.catalog.eyebrow}</p>
              <h1>{copy.catalog.title}</h1>
              <p className="learning-system-lead">{copy.catalog.description}</p>
            </header>

            <ol className="learning-path-catalog" aria-label={copy.catalog.title}>
              {LEARNING_PATHS.map((path, index) => {
                const pathCopy = copy.paths[path.id];
                const pathProgress = path.id === 'html-fundamentals'
                  ? fillTemplate(ui.sessionProgress, { completed: completedCount, total: HTML_LESSON_IDS.length })
                  : pathCopy.summary;
                return (
                  <li className={`learning-path-catalog-row path-status-${path.status}`} key={path.id}>
                    <a className="learning-path-catalog-link" href={getLearningPathHref(path.id)}>
                      <span className="learning-path-index" dir="ltr">0{index + 1}</span>
                      <span className="learning-path-catalog-copy">
                        <span className="learning-path-status path-status-label">{statusLabel(path.status, ui)}</span>
                        <strong>{pathCopy.title}</strong>
                        <span>{pathProgress}</span>
                      </span>
                      <span className="learning-path-open" aria-hidden="true">{isArabic ? '←' : '→'}</span>
                      <span className="visually-hidden">{path.status === 'available' ? ui.openPath : ui.viewOutline}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
            <p className="learning-session-note"><span aria-hidden="true">✦</span>{copy.catalog.sessionNote}</p>
          </>
        )}

        {route.kind === 'learning-path' && (() => {
          const path = LEARNING_PATHS.find((item) => item.id === route.pathId);
          const pathCopy = copy.paths[route.pathId];
          const pathIsAvailable = path?.status === 'available';
          const summaries = pathCopy.lessonSummaries ?? [];
          const progressPercent = pathIsAvailable ? (completedCount / HTML_LESSON_IDS.length) * 100 : 0;
          const allComplete = pathIsAvailable && completedCount === HTML_LESSON_IDS.length;
          const nextIndex = allComplete
            ? HTML_LESSON_IDS.length - 1
            : HTML_LESSON_IDS.findIndex((lessonId) => !completed.has(lessonId));
          const nextLesson = pathIsAvailable && summaries[nextIndex] ? summaries[nextIndex] : null;

          return (
            <>
              <nav className="learning-breadcrumb" aria-label={isArabic ? 'مسار التنقل' : 'Breadcrumb'}>
                <a href="/paths">{ui.allPaths}</a>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{pathCopy.title}</span>
              </nav>

              <header className="learning-system-intro learning-path-intro">
                <p className="eyebrow"><span className="eyebrow-line" />{pathCopy.eyebrow}</p>
                <div className="learning-title-row">
                  <h1>{pathCopy.title}</h1>
                  <span className={`learning-path-status path-status-label path-status-${path?.status ?? 'future'}`}>
                    {path ? statusLabel(path.status, ui) : ui.future}
                  </span>
                </div>
                <p className="learning-system-lead">{pathCopy.summary}</p>
              </header>

              <div className="learning-path-facts">
                <section className="learning-path-fact" aria-labelledby="path-audience-title">
                  <h2 id="path-audience-title">{pathCopy.forWhomLabel}</h2>
                  <p>{pathCopy.forWhom}</p>
                </section>
                <section className="learning-path-fact" aria-labelledby="path-outcomes-title">
                  <h2 id="path-outcomes-title">{pathCopy.outcomesLabel}</h2>
                  <ul>
                    {pathCopy.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
                  </ul>
                </section>
              </div>

              <section className="learning-path-concepts" aria-labelledby="path-concepts-title">
                <h2 id="path-concepts-title">{pathCopy.conceptsLabel}</h2>
                <ul>
                  {pathCopy.concepts.map((concept) => <li key={concept}>{concept}</li>)}
                </ul>
              </section>

              {pathIsAvailable && (
                <section className="learning-path-progress" aria-labelledby="path-progress-title">
                  <div className="learning-path-progress-copy">
                    <h2 id="path-progress-title">{ui.pathProgress}</h2>
                    <p>{fillTemplate(ui.sessionProgress, { completed: completedCount, total: HTML_LESSON_IDS.length })}</p>
                  </div>
                  <div
                    className="learning-path-progress-track"
                    role="progressbar"
                    aria-label={ui.pathProgress}
                    aria-valuemin={0}
                    aria-valuemax={HTML_LESSON_IDS.length}
                    aria-valuenow={completedCount}
                  >
                    <span style={{ width: `${progressPercent}%` }} />
                  </div>
                  <p className="learning-session-note">{ui.sessionNote}</p>
                  {nextLesson && (
                    <a className="button button-primary learning-path-continue" href={getHtmlLessonHref(nextLesson.id)}>
                      {allComplete ? ui.openLesson : completedCount > 0 ? ui.continueLearning : ui.startPath}
                      <span className="button-arrow" aria-hidden="true">{isArabic ? '←' : '→'}</span>
                    </a>
                  )}
                </section>
              )}

              <section className="learning-path-sequence" aria-labelledby="path-sequence-title">
                <div className="learning-path-sequence-heading">
                  <div>
                    <p className="eyebrow"><span className="eyebrow-line" />{isArabic ? 'تسلسل تعلّم' : 'LEARNING SEQUENCE'}</p>
                    <h2 id="path-sequence-title">{pathCopy.sequenceLabel}</h2>
                  </div>
                  {pathIsAvailable && <span className="learning-sequence-count" dir="ltr">{summaries.length.toString().padStart(2, '0')} {isArabic ? 'دروس' : 'LESSONS'}</span>}
                </div>

                {pathIsAvailable ? (
                  <ol className="learning-path-lessons">
                    {summaries.map((lesson, index) => {
                      const isComplete = completed.has(lesson.id);
                      const isNext = !allComplete && lesson.id === nextLessonId;
                      const stateLabel = isComplete ? ui.completedStatus : isNext ? ui.nextStatus : ui.availableStatus;
                      return (
                        <li className={`learning-path-lesson ${isComplete ? 'is-complete' : ''} ${isNext ? 'is-next' : ''}`} key={lesson.id}>
                          <a href={getHtmlLessonHref(lesson.id)} className="learning-path-lesson-link">
                            <span className="learning-path-lesson-marker" aria-hidden="true">{isComplete ? '✓' : String(index + 1).padStart(2, '0')}</span>
                            <span className="learning-path-lesson-copy">
                              <span className="learning-path-lesson-status">{stateLabel}</span>
                              <strong>{lesson.title}</strong>
                              <span>{lesson.summary}</span>
                            </span>
                            <span className="learning-path-open" aria-hidden="true">{isArabic ? '←' : '→'}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <>
                    <ol className="learning-outline-list">
                      {pathCopy.outline.map((item, index) => (
                        <li key={item}>
                          <span dir="ltr">{String(index + 1).padStart(2, '0')}</span>
                          <p>{item}</p>
                          <span className="learning-path-status path-status-label">{ui.planned}</span>
                        </li>
                      ))}
                    </ol>
                    <p className="learning-future-note">{pathCopy.plannedNote}</p>
                  </>
                )}
              </section>

              {pathIsAvailable && <p className="learning-future-note">{pathCopy.availableNote}</p>}
              <a className="learning-text-link" href="/paths">{ui.allPaths}<span aria-hidden="true"> {isArabic ? '←' : '→'}</span></a>
            </>
          );
        })()}

        {route.kind === 'not-found' && (
          <section className="learning-not-found" aria-labelledby="learning-not-found-title">
            <p className="eyebrow"><span className="eyebrow-line" />VANTA</p>
            <h1 id="learning-not-found-title">{ui.notFoundTitle}</h1>
            <p>{ui.notFoundBody}</p>
            <div className="learning-not-found-actions">
              <a className="button button-primary" href="/paths">{ui.allPaths}</a>
              <a className="button button-quiet" href="/">{ui.backHome}</a>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default LearningSystemPage;
