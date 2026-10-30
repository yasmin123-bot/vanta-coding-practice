import { FOUNDATION_PATH_IDS, getLearningPathHref, getLessonHref, LEARNING_PATHS, type FoundationPathId, type LearningPathId, type PathStatus } from '../content/learningSystem';
import { getLearningPathLessonSummaries } from '../i18n/foundationLessonCopy';
import { messages, type Locale } from '../i18n/messages';
import { getStudentPortalCopy } from '../i18n/studentPortal';
import { useAuth } from '../auth/AuthProvider';
import { useStudentProgress } from '../state/StudentProgressProvider';
import { summarizeFoundationLearningProgress } from '../utils/learningProgress';
import LearningHeader from './LearningHeader';
import ProgrammingLanguageLabel, { type ProgrammingLanguage } from './ProgrammingLanguageLabel';

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

function isFoundationPathId(pathId: LearningPathId): pathId is FoundationPathId {
  return (FOUNDATION_PATH_IDS as readonly LearningPathId[]).includes(pathId);
}

function languageForPath(pathId: LearningPathId): ProgrammingLanguage | null {
  if (pathId === 'html-fundamentals') return 'html';
  if (pathId === 'css-fundamentals') return 'css';
  if (pathId === 'javascript-fundamentals') return 'javascript';
  return null;
}

function LearningSystemPage({ locale, onSwitchLocale, route }: LearningSystemPageProps) {
  const landingCopy = messages[locale];
  const copy = landingCopy.learningSystem;
  const portalCopy = getStudentPortalCopy(locale);
  const ui = copy.ui;
  const isArabic = locale === 'ar';
  const numberLocale = isArabic ? 'ar' : 'en-US';
  const { user } = useAuth();
  const studentProgress = useStudentProgress();
  const isAuthenticated = Boolean(user);
  const progressGate = isAuthenticated && !studentProgress.hasLoaded
    && (studentProgress.loading || studentProgress.error);

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
        stageLabel={metaStageLabel}
      />

      <main className="learning-system-main section-frame">
        {isAuthenticated && studentProgress.loading && !studentProgress.hasLoaded ? (
          <p className="student-loading-state" role="status"><span className="student-loading-mark" aria-hidden="true" />{portalCopy.common.loading}</p>
        ) : isAuthenticated && studentProgress.error && !studentProgress.hasLoaded ? (
          <section className="student-gate-panel" aria-labelledby="learning-data-error-title">
            <p className="eyebrow"><span className="eyebrow-line" />Mabda / {portalCopy.common.paths}</p>
            <h1 id="learning-data-error-title">{portalCopy.common.loadErrorTitle}</h1>
            <p>{portalCopy.common.loadErrorBody}</p>
            <button className="button button-primary" type="button" onClick={() => { void studentProgress.refresh(); }}>
              {portalCopy.common.retry}
            </button>
          </section>
        ) : !progressGate && route.kind === 'path-catalog' && (
          <>
            <header className="learning-system-intro">
              <p className="eyebrow"><span className="eyebrow-line" />{copy.catalog.eyebrow}</p>
              <h1>{copy.catalog.title}</h1>
              <p className="learning-system-lead">{copy.catalog.description}</p>
            </header>

            <ol className="learning-path-catalog" aria-label={copy.catalog.title}>
              {LEARNING_PATHS.map((path, index) => {
                const pathCopy = copy.paths[path.id];
                const language = languageForPath(path.id);
                const foundationPathId = path.status === 'available' && isFoundationPathId(path.id) ? path.id : null;
                const foundationPath = foundationPathId !== null;
                const summaries = foundationPathId ? getLearningPathLessonSummaries(locale, foundationPathId) : [];
                const pathStarted = foundationPathId !== null && studentProgress.paths.some((row) => row.path_id === foundationPathId);
                const progressSummary = foundationPathId
                  ? summarizeFoundationLearningProgress(foundationPathId, studentProgress.lessons, pathStarted)
                  : null;
                const pathProgress = progressSummary
                  ? fillTemplate(portalCopy.dashboard.pathProgress, {
                    completed: new Intl.NumberFormat(numberLocale).format(progressSummary.completedLessonCount),
                    total: new Intl.NumberFormat(numberLocale).format(summaries.length),
                  })
                  : pathCopy.summary;
                const pathLevel = path.id === 'html-fundamentals' ? ui.beginnerLevel : ui.foundationalLevel;
                const lessonAvailability = foundationPath
                  ? fillTemplate(ui.lessonCountLabel, { count: new Intl.NumberFormat(numberLocale).format(summaries.length) })
                  : ui.plannedLessonsUnavailable;
                const studentPathState = progressSummary?.pathCompleted ? ui.pathCompleted
                  : pathStarted ? ui.pathInProgress : ui.pathNotStarted;
                return (
                  <li className={`learning-path-catalog-row path-status-${path.status}`} key={path.id}>
                    <a className="learning-path-catalog-link" href={getLearningPathHref(path.id)}>
                      <span className="learning-path-index" dir="ltr">0{index + 1}</span>
                      <span className="learning-path-catalog-copy">
                        <span className="learning-path-status path-status-label">{statusLabel(path.status, ui)}</span>
                        <strong>{language ? <ProgrammingLanguageLabel language={language} label={pathCopy.title}>{pathCopy.title}</ProgrammingLanguageLabel> : pathCopy.title}</strong>
                        <span>{pathProgress}</span>
                        <span className="learning-path-catalog-meta">
                          <span>{ui.pathLevelLabel}: {pathLevel}</span>
                          <span>{lessonAvailability}</span>
                          {isAuthenticated && studentProgress.hasLoaded && foundationPath && <span>{studentPathState}</span>}
                        </span>
                      </span>
                      <span className="learning-path-open" aria-hidden="true">{isArabic ? '←' : '→'}</span>
                      <span className="visually-hidden">{path.status === 'available' ? ui.openPath : ui.viewOutline}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
            <p className="learning-session-note"><span aria-hidden="true">✦</span>{isAuthenticated ? portalCopy.common.accountOnly : portalCopy.progress.catalogNote}</p>
            {studentProgress.error && <p className="student-form-error" role="alert">{portalCopy.common.dataError}</p>}
          </>
        )}

        {!progressGate && route.kind === 'learning-path' && (() => {
          const path = LEARNING_PATHS.find((item) => item.id === route.pathId);
          const pathCopy = copy.paths[route.pathId];
          const foundationPathId = path?.status === 'available' && isFoundationPathId(route.pathId) ? route.pathId : null;
          const foundationPath = foundationPathId !== null;
          const summaries = foundationPathId ? getLearningPathLessonSummaries(locale, foundationPathId) : [];
          const pathStarted = foundationPathId !== null
            && (studentProgress.paths.some((row) => row.path_id === foundationPathId)
              || studentProgress.lessons.some((row) => row.path_id === foundationPathId));
          const progressSummary = foundationPathId
            ? summarizeFoundationLearningProgress(foundationPathId, studentProgress.lessons, pathStarted)
            : null;
          const completed = progressSummary?.completedLessonIds ?? new Set<string>();
          const completedCount = progressSummary?.completedLessonCount ?? 0;
          const progressPercent = foundationPath && isAuthenticated
            ? (completedCount / summaries.length) * 100
            : 0;
          const allComplete = isAuthenticated && progressSummary?.pathCompleted === true;
          const nextLesson = foundationPath && isAuthenticated && progressSummary
            ? summaries.find((lesson) => lesson.id === progressSummary.resumeLessonId) ?? null
            : null;
          const pathState = allComplete ? ui.pathCompleted
            : pathStarted ? ui.pathInProgress : ui.pathNotStarted;
          const pathLevel = route.pathId === 'html-fundamentals' ? ui.beginnerLevel : ui.foundationalLevel;
          const language = languageForPath(route.pathId);

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
                  <h1>{language ? <ProgrammingLanguageLabel language={language} label={pathCopy.title}>{pathCopy.title}</ProgrammingLanguageLabel> : pathCopy.title}</h1>
                  <span className={`learning-path-status path-status-label path-status-${path?.status ?? 'future'}`}>
                    {path ? statusLabel(path.status, ui) : ui.future}
                  </span>
                </div>
                <p className="learning-system-lead">{pathCopy.summary}</p>
              </header>

              <div className="learning-path-meta" aria-label={pathCopy.title}>
                <span><strong>{ui.pathLevelLabel}:</strong> {pathLevel}</span>
                <span>{foundationPath
                  ? fillTemplate(ui.lessonCountLabel, { count: new Intl.NumberFormat(numberLocale).format(summaries.length) })
                  : ui.plannedLessonsUnavailable}</span>
                {isAuthenticated && studentProgress.hasLoaded && foundationPath && <span className="student-path-state">{pathState}</span>}
              </div>

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

              {foundationPath && isAuthenticated && progressSummary && studentProgress.hasLoaded && (
                <section className="learning-path-progress" aria-labelledby="path-progress-title">
                  <div className="learning-path-progress-copy">
                    <h2 id="path-progress-title">{ui.pathProgress}</h2>
                    <p>{fillTemplate(portalCopy.dashboard.pathProgress, {
                      completed: new Intl.NumberFormat(numberLocale).format(completedCount),
                      total: new Intl.NumberFormat(numberLocale).format(summaries.length),
                    })}</p>
                  </div>
                  <div
                    className="learning-path-progress-track"
                    role="progressbar"
                    aria-label={ui.pathProgress}
                    aria-valuemin={0}
                    aria-valuemax={summaries.length}
                    aria-valuenow={isAuthenticated ? completedCount : 0}
                  >
                    <span style={{ width: `${progressPercent}%` }} />
                  </div>
                  <p className="learning-session-note">{portalCopy.common.accountOnly}</p>
                  {nextLesson && (
                    <a className="button button-primary learning-path-continue" href={getLessonHref(nextLesson.id)}>
                      {allComplete ? ui.openLesson : pathStarted ? ui.continueLearning : ui.startPath}
                      <span className="button-arrow" aria-hidden="true">{isArabic ? '←' : '→'}</span>
                    </a>
                  )}
                </section>
              )}
              {foundationPath && !isAuthenticated && (
                <p className="learning-session-note">{portalCopy.progress.catalogNote}</p>
              )}
              {foundationPath && isAuthenticated && studentProgress.loading && !studentProgress.hasLoaded && (
                <p className="learning-session-note" role="status">{portalCopy.common.loading}</p>
              )}
              {foundationPath && isAuthenticated && studentProgress.error && (
                <p className="student-form-error" role="alert">
                  {portalCopy.common.dataError}{' '}
                  <button type="button" onClick={() => { void studentProgress.refresh(); }}>{portalCopy.common.retry}</button>
                </p>
              )}

              <section className="learning-path-sequence" aria-labelledby="path-sequence-title">
                <div className="learning-path-sequence-heading">
                  <div>
                    <p className="eyebrow"><span className="eyebrow-line" />{ui.sequenceEyebrow}</p>
                    <h2 id="path-sequence-title">{pathCopy.sequenceLabel}</h2>
                  </div>
                  {foundationPath && <span className="learning-sequence-count">{fillTemplate(ui.lessonCountLabel, { count: new Intl.NumberFormat(numberLocale).format(summaries.length) })}</span>}
                </div>

                {foundationPath ? (
                  <ol className="learning-path-lessons">
                    {summaries.map((lesson, index) => {
                      const isComplete = isAuthenticated && completed.has(lesson.id);
                      const isNext = isAuthenticated && !allComplete && lesson.id === progressSummary?.recommendedLessonId;
                      const isCurrent = isAuthenticated && !isComplete && lesson.id === progressSummary?.lastOpenedLessonId;
                      const stateLabel = isComplete ? ui.completedStatus : isNext ? ui.nextStatus : ui.availableStatus;
                      return (
                        <li className={`learning-path-lesson ${isComplete ? 'is-complete' : ''} ${isNext ? 'is-next' : ''} ${isCurrent ? 'is-current' : ''}`} key={lesson.id}>
                          <a href={getLessonHref(lesson.id)} className="learning-path-lesson-link">
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

              {foundationPath && <p className="learning-future-note">{pathCopy.availableNote}</p>}
              <a className="learning-text-link" href="/paths">{ui.allPaths}<span aria-hidden="true"> {isArabic ? '←' : '→'}</span></a>
            </>
          );
        })()}

        {!progressGate && route.kind === 'not-found' && (
          <section className="learning-not-found" aria-labelledby="learning-not-found-title">
            <p className="eyebrow"><span className="eyebrow-line" />Mabda</p>
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
