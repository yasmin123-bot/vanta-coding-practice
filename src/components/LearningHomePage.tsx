import { LEARNING_PATHS, getLearningPathHref, type FoundationPathId } from '../content/learningSystem';
import { messages, type Locale } from '../i18n/messages';
import { getLearningPathLessonSummaries } from '../i18n/foundationLessonCopy';
import { getStudentPortalCopy } from '../i18n/studentPortal';
import { useAuth } from '../auth/AuthProvider';
import { useStudentProgress } from '../state/StudentProgressProvider';
import { getFoundationLearningState, summarizeFoundationLearningProgress } from '../utils/learningProgress';
import AppIcon from './AppIcon';
import LearningHeader from './LearningHeader';
import ProgrammingLanguageLabel from './ProgrammingLanguageLabel';

type LearningHomePageProps = {
  locale: Locale;
  onSwitchLocale: () => void;
};

const languagePathDefinitions: Array<{
  id: FoundationPathId;
  language: 'html' | 'css' | 'javascript';
  name: string;
  descriptionKey: 'htmlPathBody' | 'cssPathBody' | 'javascriptPathBody';
}> = [
  { id: 'html-fundamentals', language: 'html', name: 'HTML', descriptionKey: 'htmlPathBody' },
  { id: 'css-fundamentals', language: 'css', name: 'CSS', descriptionKey: 'cssPathBody' },
  { id: 'javascript-fundamentals', language: 'javascript', name: 'JavaScript', descriptionKey: 'javascriptPathBody' },
];

function fill(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, String(value)), template);
}

function LearningHomePage({ locale, onSwitchLocale }: LearningHomePageProps) {
  const { user } = useAuth();
  const progress = useStudentProgress();
  const portalCopy = getStudentPortalCopy(locale);
  const learningCopy = messages[locale].learningSystem;
  const homeCopy = portalCopy.home;
  const isArabic = locale === 'ar';
  const isAuthenticated = Boolean(user);
  const hasRealProgress = isAuthenticated && progress.hasLoaded;
  const metadataName = [user?.user_metadata?.full_name, user?.user_metadata?.name]
    .find((value): value is string => typeof value === 'string' && value.trim().length > 0)?.trim();
  const displayName = progress.profile.display_name.trim() || metadataName || '';
  const numberFormat = new Intl.NumberFormat(isArabic ? 'ar' : 'en-US');

  return (
    <div className={`app-shell student-page student-dashboard-page mabda-home-page ${isArabic ? 'is-arabic' : 'is-english'}`}>
      <LearningHeader locale={locale} onSwitchLocale={onSwitchLocale} allPathsLabel={portalCopy.common.paths} />
      <main className="mabda-home-main">
        <header className="mabda-home-hero mabda-home-hero--simple" id="top">
          <div className="mabda-home-hero-copy">
            <p className="mabda-home-eyebrow">{isAuthenticated ? homeCopy.welcomeBack : homeCopy.welcomeGuest}</p>
            <h1>{displayName || portalCopy.intro.tagline}</h1>
            <p className="mabda-home-hero-lead">{homeCopy.heroBody}</p>
            <div className="mabda-home-hero-actions">
              <a className="button button-primary" href="/paths">
                {homeCopy.heroAction}<AppIcon name="arrow" size={18} />
              </a>
            </div>
            {!isAuthenticated && <p className="mabda-home-guest-note">{homeCopy.guestNote}</p>}
          </div>
        </header>

        {progress.error && isAuthenticated && (
          <p className="student-form-error" role="alert">
            {portalCopy.common.dataError}{' '}
            <button type="button" onClick={() => { void progress.refresh(); }}>{portalCopy.common.retry}</button>
          </p>
        )}
        {isAuthenticated && progress.loading && !progress.hasLoaded && (
          <p className="mabda-home-loading" role="status">{portalCopy.common.loading}</p>
        )}

        <section className="mabda-home-section mabda-home-path-section" id="learning-paths" aria-labelledby="mabda-home-paths-title">
          <header className="mabda-home-section-heading">
            <p className="mabda-home-section-kicker">{portalCopy.appShell.learningPaths}</p>
            <h2 id="mabda-home-paths-title">{homeCopy.pathsTitle}</h2>
          </header>
          <div className="mabda-home-path-list">
            {languagePathDefinitions.map(({ id, language, name, descriptionKey }) => {
              const path = LEARNING_PATHS.find((item) => item.id === id);
              if (!path) return null;
              const lessons = getLearningPathLessonSummaries(locale, id);
              const started = hasRealProgress && (
                progress.paths.some((item) => item.path_id === id)
                || progress.lessons.some((item) => item.path_id === id)
              );
              const summary = summarizeFoundationLearningProgress(
                id,
                hasRealProgress ? progress.lessons : [],
                started,
              );
              const state = getFoundationLearningState(summary);
              const stateLabel = state === 'completed' ? learningCopy.ui.pathCompleted
                : state === 'in-progress' ? learningCopy.ui.pathInProgress
                  : state === 'getting-started' ? learningCopy.ui.pathGettingStarted
                    : learningCopy.ui.pathNotStarted;
              const showProgress = hasRealProgress && started;
              const progressPercent = lessons.length ? Math.round((summary.completedLessonCount / lessons.length) * 100) : 0;

              return (
                <a className="mabda-home-path-row" href={getLearningPathHref(id)} key={id}>
                  <span className="mabda-home-path-icon" aria-hidden="true">
                    <ProgrammingLanguageLabel language={language} label={name} className="mabda-home-path-language-icon">{name}</ProgrammingLanguageLabel>
                  </span>
                  <span className="mabda-home-path-copy">
                    <span className="mabda-home-path-heading">
                      <strong>{name}</strong>
                      <span className="mabda-home-path-count">
                        {fill(learningCopy.ui.lessonCountLabel, { count: numberFormat.format(lessons.length) })}
                      </span>
                    </span>
                    <span className="mabda-home-path-description">{homeCopy[descriptionKey]}</span>
                    {showProgress && (
                      <span className="mabda-home-path-progress">
                        <span className="mabda-home-path-progress-label">
                          <span>{fill(portalCopy.profile.pathProgress, {
                            completed: numberFormat.format(summary.completedLessonCount),
                            total: numberFormat.format(lessons.length),
                          })}</span>
                          <span>{numberFormat.format(progressPercent)}%</span>
                        </span>
                        <span
                          className="mabda-home-progress"
                          role="progressbar"
                          aria-label={fill(portalCopy.profile.pathProgress, {
                            completed: numberFormat.format(summary.completedLessonCount),
                            total: numberFormat.format(lessons.length),
                          })}
                          aria-valuemin={0}
                          aria-valuemax={lessons.length}
                          aria-valuenow={summary.completedLessonCount}
                        >
                          <span style={{ width: `${progressPercent}%` }} />
                        </span>
                      </span>
                    )}
                  </span>
                  {hasRealProgress && (
                    <span className={`mabda-home-path-status is-${state}`}>
                      {stateLabel}
                    </span>
                  )}
                  <AppIcon name="arrow" size={18} />
                </a>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default LearningHomePage;
