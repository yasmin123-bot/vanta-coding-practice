import { FOUNDATION_LESSON_IDS_BY_PATH, FOUNDATION_PATH_IDS, HTML_PATH_ID, LEARNING_PATHS, getLearningPathHref, getLessonHref, type FoundationLessonId, type FoundationPathId, type LearningPathId } from '../content/learningSystem';
import { messages, type Locale } from '../i18n/messages';
import { getLearningPathLessonSummaries } from '../i18n/foundationLessonCopy';
import { getStudentPortalCopy } from '../i18n/studentPortal';
import { useAuth } from '../auth/AuthProvider';
import { getStudentProgressName, useStudentProgress } from '../state/StudentProgressProvider';
import { useAppNavigation } from '../state/AppNavigationProvider';
import { summarizeFoundationLearningProgress } from '../utils/learningProgress';
import AppIcon from './AppIcon';
import LearningHeader from './LearningHeader';
import ProgrammingLanguageLabel from './ProgrammingLanguageLabel';

type LearningHomePageProps = {
  locale: Locale;
  onSwitchLocale: () => void;
};

const languagePathDefinitions: Array<{
  id: LearningPathId;
  language: 'html' | 'css' | 'javascript';
  descriptionKey: 'htmlPathBody' | 'cssPathBody' | 'javascriptPathBody';
}> = [
  { id: 'html-fundamentals', language: 'html', descriptionKey: 'htmlPathBody' },
  { id: 'css-fundamentals', language: 'css', descriptionKey: 'cssPathBody' },
  { id: 'javascript-fundamentals', language: 'javascript', descriptionKey: 'javascriptPathBody' },
];

function fill(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, String(value)), template);
}

function lessonTitle(locale: Locale, lessonId: FoundationLessonId) {
  const pathId = FOUNDATION_PATH_IDS.find((candidate) => (
    FOUNDATION_LESSON_IDS_BY_PATH[candidate].some((candidateLessonId) => candidateLessonId === lessonId)
  ));
  const localizedSummary = pathId
    ? getLearningPathLessonSummaries(locale, pathId).find((lesson) => lesson.id === lessonId)
    : undefined;
  return localizedSummary?.title ?? (lessonId === 'html-introduction' ? messages[locale].lesson.title : lessonId);
}

function LearningHomePage({ locale, onSwitchLocale }: LearningHomePageProps) {
  const { user } = useAuth();
  const progress = useStudentProgress();
  const { openMenu } = useAppNavigation();
  const portalCopy = getStudentPortalCopy(locale);
  const learningCopy = messages[locale].learningSystem;
  const homeCopy = portalCopy.home;
  const dashboardCopy = portalCopy.dashboard;
  const isArabic = locale === 'ar';
  const isAuthenticated = Boolean(user);
  const hasRealProgress = isAuthenticated && progress.hasLoaded;
  const pathProgressSummaries = FOUNDATION_PATH_IDS.map((pathId) => {
    const pathStarted = progress.paths.some((path) => path.path_id === pathId)
      || progress.lessons.some((lesson) => lesson.path_id === pathId);
    return {
      pathId,
      pathStarted,
      lessons: getLearningPathLessonSummaries(locale, pathId),
      summary: summarizeFoundationLearningProgress(pathId, hasRealProgress ? progress.lessons : [], pathStarted),
    };
  });
  const recentActivity = hasRealProgress ? [
    ...progress.paths
      .filter((path) => FOUNDATION_PATH_IDS.includes(path.path_id as FoundationPathId))
      .map((path) => ({ pathId: path.path_id as FoundationPathId, lastOpenedAt: path.last_opened_at })),
    ...progress.lessons.map((lesson) => ({ pathId: lesson.path_id, lastOpenedAt: lesson.last_opened_at })),
  ].sort((left, right) => Date.parse(right.lastOpenedAt) - Date.parse(left.lastOpenedAt))[0] : undefined;
  const resumePathId = recentActivity?.pathId ?? HTML_PATH_ID;
  const resumePathProgress = pathProgressSummaries.find((path) => path.pathId === resumePathId)!;
  const pathStarted = resumePathProgress.pathStarted;
  const summary = resumePathProgress.summary;
  const resumeLessonId: FoundationLessonId = recentActivity ? summary.resumeLessonId : 'html-introduction';
  const startedPathCount = hasRealProgress ? pathProgressSummaries.filter((path) => path.pathStarted).length : 0;
  const completedPathCount = hasRealProgress
    ? pathProgressSummaries.filter((path) => path.pathStarted && path.summary.pathCompleted).length
    : 0;
  const completedLessonCount = hasRealProgress
    ? pathProgressSummaries.reduce((total, path) => total + path.summary.completedLessonCount, 0)
    : 0;
  const foundationLessonCount = FOUNDATION_PATH_IDS.reduce((total, pathId) => total + FOUNDATION_LESSON_IDS_BY_PATH[pathId].length, 0);
  const displayName = getStudentProgressName(user, progress.profile.display_name);
  const formattedNumber = new Intl.NumberFormat(isArabic ? 'ar' : 'en-US');
  const resumePath = learningCopy.paths[resumePathId];
  const pathCompleted = summary.pathCompleted;
  const pathState = pathCompleted ? dashboardCopy.pathCompleted
    : pathStarted ? dashboardCopy.pathInProgress
      : hasRealProgress ? dashboardCopy.pathNotStarted : learningCopy.ui.available;
  const resumeHref = getLessonHref(resumeLessonId);
  const currentLesson = summary.lastOpenedLessonId
    ? lessonTitle(locale, summary.lastOpenedLessonId)
    : dashboardCopy.noCurrentLesson;
  const nextLesson = summary.recommendedLessonId
    ? lessonTitle(locale, summary.recommendedLessonId)
    : dashboardCopy.allComplete;
  const quizResults = [...progress.lessons]
    .filter((lesson) => lesson.quiz_score !== null && lesson.quiz_total !== null)
    .sort((left, right) => Date.parse(right.last_opened_at) - Date.parse(left.last_opened_at))
    .slice(0, 3);
  const percentFor = (score: number, total: number) => total > 0 ? Math.round((score / total) * 100) : 0;
  const profileHref = isAuthenticated ? '/profile' : '/login?next=%2Fprofile';

  return (
    <div className={`app-shell student-page student-dashboard-page mabda-home-page ${isArabic ? 'is-arabic' : 'is-english'}`}>
      <LearningHeader locale={locale} onSwitchLocale={onSwitchLocale} allPathsLabel={portalCopy.common.paths} />
      <main className="mabda-home-main">
        <header className="mabda-home-hero" id="top">
          <div className="mabda-home-hero-copy">
            <p className="mabda-home-eyebrow">{homeCopy.heroEyebrow}</p>
            {isAuthenticated && <span className="mabda-home-welcome">{fill(dashboardCopy.title, { name: displayName })}</span>}
            <h1>{portalCopy.intro.tagline}</h1>
            <p className="mabda-home-hero-lead">{homeCopy.heroBody}</p>
            <div className="mabda-home-hero-actions">
              <a className="button button-primary" href={getLearningPathHref(resumePathId)}>
                {homeCopy.heroAction}<AppIcon name="arrow" size={18} />
              </a>
            </div>
            {!isAuthenticated && <p className="mabda-home-guest-note">{homeCopy.guestNote}</p>}
          </div>

          <section className="mabda-home-resume" aria-labelledby="mabda-home-resume-title">
            <div className="mabda-home-resume-heading">
              <div>
                <p className="mabda-home-section-kicker">{hasRealProgress ? dashboardCopy.currentPath : portalCopy.appShell.learningPaths}</p>
                <h2 id="mabda-home-resume-title">
                  <ProgrammingLanguageLabel language={resumePathId === 'html-fundamentals' ? 'html' : resumePathId === 'css-fundamentals' ? 'css' : 'javascript'} label={resumePath.title}>{resumePath.title}</ProgrammingLanguageLabel>
                </h2>
              </div>
              <span className={`mabda-home-state ${pathStarted ? 'is-available' : ''}`}>{pathState}</span>
            </div>
            <p className="mabda-home-resume-copy">{hasRealProgress && pathStarted ? dashboardCopy.continueBody : homeCopy[resumePathId === 'html-fundamentals' ? 'htmlPathBody' : resumePathId === 'css-fundamentals' ? 'cssPathBody' : 'javascriptPathBody']}</p>
            {hasRealProgress && pathStarted && (
              <>
                <div className="mabda-home-resume-meta">
                  <p><span>{dashboardCopy.currentLesson}</span><strong>{currentLesson}</strong></p>
                  <p><span>{dashboardCopy.nextRecommended}</span><strong>{nextLesson}</strong></p>
                </div>
                <div
                  className="mabda-home-progress"
                  role="progressbar"
                  aria-label={dashboardCopy.pathProgress}
                  aria-valuemin={0}
                  aria-valuemax={resumePathProgress.lessons.length}
                  aria-valuenow={summary.completedLessonCount}
                >
                  <span style={{ width: `${(summary.completedLessonCount / resumePathProgress.lessons.length) * 100}%` }} />
                </div>
                <span className="visually-hidden">
                  {fill(dashboardCopy.pathProgress, {
                    completed: formattedNumber.format(summary.completedLessonCount),
                    total: formattedNumber.format(resumePathProgress.lessons.length),
                  })}
                </span>
              </>
            )}
            {isAuthenticated && progress.loading && !progress.hasLoaded && (
              <p className="mabda-home-resume-copy" role="status">{portalCopy.common.loading}</p>
            )}
            <a className="button button-primary" href={resumeHref}>
              {hasRealProgress && pathStarted
                ? pathCompleted ? dashboardCopy.reviewAction : dashboardCopy.continueAction
                : homeCopy.firstLessonAction}
              <AppIcon name="arrow" size={17} />
            </a>
          </section>
        </header>

        {hasRealProgress && (
          <section className="mabda-home-stats" aria-label={dashboardCopy.eyebrow}>
            <article className="mabda-home-stat"><span>{dashboardCopy.pathsStarted}</span><strong>{formattedNumber.format(startedPathCount)}</strong></article>
            <article className="mabda-home-stat"><span>{dashboardCopy.pathsCompleted}</span><strong>{formattedNumber.format(completedPathCount)}</strong></article>
            <article className="mabda-home-stat"><span>{dashboardCopy.lessonsCompleted}</span><strong>{formattedNumber.format(completedLessonCount)}<small> / {formattedNumber.format(foundationLessonCount)}</small></strong></article>
          </section>
        )}

        {progress.error && isAuthenticated && (
          <p className="student-form-error" role="alert">
            {portalCopy.common.dataError}{' '}
            <button type="button" onClick={() => { void progress.refresh(); }}>{portalCopy.common.retry}</button>
          </p>
        )}

        <section className="mabda-home-section" id="journey" aria-labelledby="mabda-home-paths-title">
          <header className="mabda-home-section-heading">
            <p className="mabda-home-section-kicker">{portalCopy.appShell.learningPaths}</p>
            <h2 id="mabda-home-paths-title">{homeCopy.pathsTitle}</h2>
            <p>{homeCopy.pathsBody}</p>
          </header>
          <div className="mabda-home-path-grid">
            {languagePathDefinitions.map(({ id, language, descriptionKey }, index) => {
              const path = LEARNING_PATHS.find((item) => item.id === id);
              if (!path) return null;
              const copy = learningCopy.paths[id];
              const available = path.status === 'available';
              const status = available ? learningCopy.ui.available : learningCopy.ui.planned;
              const pathProgress = pathProgressSummaries.find((item) => item.pathId === id)!;
              const statusText = hasRealProgress && pathProgress.pathStarted
                ? pathProgress.summary.pathCompleted ? dashboardCopy.pathCompleted : dashboardCopy.pathInProgress
                : status;
              const progressPercent = pathProgress.lessons.length
                ? Math.round((pathProgress.summary.completedLessonCount / pathProgress.lessons.length) * 100)
                : 0;
              return (
                <a className="mabda-home-path-card" href={getLearningPathHref(id)} key={id}>
                  <div className="mabda-home-path-card-heading">
                    <div>
                      <p className="mabda-home-section-kicker" dir="ltr">0{index + 1}</p>
                      <h3><ProgrammingLanguageLabel language={language} label={copy.title}>{copy.title}</ProgrammingLanguageLabel></h3>
                    </div>
                    <span className={`mabda-home-state ${available ? 'is-available' : 'is-planned'}`}>{statusText}</span>
                  </div>
                  <p>{homeCopy[descriptionKey]}</p>
                  <p className="mabda-home-path-lesson-count">
                    {fill(learningCopy.ui.lessonCountLabel, { count: formattedNumber.format(pathProgress.lessons.length) })}
                  </p>
                  {hasRealProgress && pathProgress.pathStarted ? (
                    <div className="mabda-home-path-progress">
                      <span className="mabda-home-path-progress-label">
                        <span>{dashboardCopy.pathProgress.replace('{completed}', formattedNumber.format(pathProgress.summary.completedLessonCount)).replace('{total}', formattedNumber.format(pathProgress.lessons.length))}</span>
                        <span>{progressPercent}%</span>
                      </span>
                      <div className="mabda-home-progress" aria-hidden="true">
                        <span style={{ width: `${progressPercent}%` }} />
                      </div>
                    </div>
                  ) : <span className="mabda-home-path-action">
                    {available ? learningCopy.ui.openPath : learningCopy.ui.viewOutline}
                    <AppIcon name="arrow" size={16} />
                  </span>}
                </a>
              );
            })}
          </div>
        </section>

        <section className="mabda-home-section" id="platform" aria-labelledby="mabda-home-loop-title">
          <header className="mabda-home-section-heading">
            <p className="mabda-home-section-kicker">{homeCopy.loopTitle}</p>
            <h2 id="mabda-home-loop-title">{homeCopy.loopTitle}</h2>
          </header>
          <ol className="mabda-home-loop">
            {homeCopy.loopSteps.map((step, index) => (
              <li key={step}>
                <span className="mabda-home-loop-index" dir="ltr">0{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="mabda-home-content-grid" style={{ marginBlockStart: 14 }}>
            <article className="mabda-home-feature-panel is-primary">
              <span className="mabda-home-feature-icon"><AppIcon name="practice" size={21} /></span>
              <h3>{homeCopy.practiceTitle}</h3>
              <p>{homeCopy.practiceBody}</p>
              <a className="button button-primary" href="/lesson/start?view=practice">
                {homeCopy.practiceAction}<AppIcon name="arrow" size={17} />
              </a>
            </article>
            <article className="mabda-home-feature-panel">
              <span className="mabda-home-feature-icon"><AppIcon name="quiz" size={21} /></span>
              <h3>{homeCopy.quizTitle}</h3>
              <p>{homeCopy.quizBody}</p>
              <a className="button button-quiet" href={getLearningPathHref(HTML_PATH_ID)}>
                {homeCopy.quizAction}<AppIcon name="arrow" size={17} />
              </a>
            </article>
          </div>
        </section>

        <section className="mabda-home-section" id="about" aria-labelledby="mabda-home-actions-title">
          <header className="mabda-home-section-heading">
            <p className="mabda-home-section-kicker">Mabda</p>
            <h2 id="mabda-home-actions-title">{homeCopy.quickActionsTitle}</h2>
          </header>
          <div className="mabda-home-quick-actions">
            <a className="mabda-home-quick-action" href="/lesson/start?view=practice">
              <span className="mabda-home-quick-icon"><AppIcon name="practice" size={19} /></span>
              <strong>{portalCopy.appShell.practice}</strong>
            </a>
            <a className="mabda-home-quick-action" href={getLearningPathHref(HTML_PATH_ID)} aria-label={`${homeCopy.quizAction}. ${portalCopy.appShell.quizNote}`}>
              <span className="mabda-home-quick-icon"><AppIcon name="quiz" size={19} /></span>
              <strong>{portalCopy.appShell.quizzes}</strong>
              <small>{portalCopy.appShell.quizNote}</small>
            </a>
            <div className="mabda-home-quick-action" aria-disabled="true">
              <span className="mabda-home-quick-icon"><AppIcon name="challenge" size={19} /></span>
              <strong>{homeCopy.challengeAction}</strong>
              <small>{portalCopy.appShell.comingSoon}</small>
            </div>
            <div className="mabda-home-quick-action" aria-disabled="true">
              <span className="mabda-home-quick-icon"><AppIcon name="project" size={19} /></span>
              <strong>{homeCopy.projectAction}</strong>
              <small>{portalCopy.appShell.comingSoon}</small>
            </div>
            <a className="mabda-home-quick-action" href={profileHref}>
              <span className="mabda-home-quick-icon"><AppIcon name="profile" size={19} /></span>
              <strong>{homeCopy.profileAction}</strong>
            </a>
            <button className="mabda-home-quick-action" type="button" onClick={openMenu} aria-haspopup="dialog">
              <span className="mabda-home-quick-icon"><AppIcon name="settings" size={19} /></span>
              <strong>{homeCopy.settingsAction}</strong>
              <small>{homeCopy.settingsBody}</small>
            </button>
          </div>
        </section>

        {hasRealProgress && (
          <section className="mabda-home-section" aria-labelledby="mabda-home-results-title">
            <header className="mabda-home-section-heading">
              <p className="mabda-home-section-kicker">{dashboardCopy.recentQuizResults}</p>
              <h2 id="mabda-home-results-title">{dashboardCopy.recentQuizResults}</h2>
            </header>
            <div className="mabda-home-results">
              <section className="student-profile-card student-dashboard-quiz" aria-labelledby="mabda-home-quiz-card-title">
                <div className="student-profile-card-heading">
                  <h3 id="mabda-home-quiz-card-title">{dashboardCopy.recentQuizResults}</h3>
                  <span>{formattedNumber.format(quizResults.length)}</span>
                </div>
                {quizResults.length ? (
                  <ul className="student-profile-quiz-list">
                    {quizResults.map((result) => {
                      const score = result.quiz_score ?? 0;
                      const total = result.quiz_total ?? 0;
                      return (
                        <li key={result.lesson_id}>
                          <span>{lessonTitle(locale, result.lesson_id)}</span>
                          <strong dir="ltr">{formattedNumber.format(score)} / {formattedNumber.format(total)} · {fill(dashboardCopy.scorePercent, { percent: formattedNumber.format(percentFor(score, total)) })}</strong>
                        </li>
                      );
                    })}
                  </ul>
                ) : <p className="student-profile-empty">{dashboardCopy.noRecentQuizResults}</p>}
              </section>
              <section className="student-profile-card" aria-labelledby="mabda-home-next-title">
                <h3 id="mabda-home-next-title">{dashboardCopy.continueTitle}</h3>
                <p className="student-profile-path-name">{pathStarted ? nextLesson : dashboardCopy.noCurrentLesson}</p>
                <a className="button button-quiet" href={resumeHref}>
                  {dashboardCopy.continueAction}<AppIcon name="arrow" size={16} />
                </a>
              </section>
            </div>
          </section>
        )}

        <section className="mabda-home-vision" id="vision" aria-label={portalCopy.intro.secondaryTagline}>
          <p>{portalCopy.intro.secondaryTagline}</p>
        </section>
        {isAuthenticated && progress.hasLoaded && <p className="mabda-home-data-note">{dashboardCopy.accountDataNote}</p>}
      </main>
    </div>
  );
}

export default LearningHomePage;
