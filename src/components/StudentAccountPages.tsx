import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type { AuthError } from '@supabase/supabase-js';
import { HTML_LESSON_IDS, HTML_PATH_ID, getHtmlLessonHref, type HtmlLessonId } from '../content/learningSystem';
import type { Locale } from '../i18n/messages';
import { messages } from '../i18n/messages';
import { getStudentPortalCopy } from '../i18n/studentPortal';
import { supabaseClient, supabaseSetupState } from '../lib/supabaseClient';
import { getStudentProgressName, useStudentProgress } from '../state/StudentProgressProvider';
import { useAuth } from '../auth/AuthProvider';
import { summarizeHtmlLearningProgress } from '../utils/learningProgress';
import { safeReturnPath } from '../utils/safeReturnPath';
import LearningHeader from './LearningHeader';
import type { StudentAuthMode } from '../content/learningSystem';

function authErrorMessage(error: AuthError, copy: ReturnType<typeof getStudentPortalCopy>) {
  const code = error.code ?? '';
  const message = error.message.toLowerCase();
  if (code === 'invalid_credentials' || message.includes('invalid login credentials')) return copy.auth.errorCredentials;
  if (code === 'email_not_confirmed' || message.includes('email not confirmed')) return copy.auth.errorUnconfirmed;
  if (code === 'user_already_exists' || message.includes('user already registered')) return copy.auth.errorExists;
  if (code.includes('rate_limit') || code.includes('over_email_send_rate_limit') || error.status === 429) return copy.auth.errorRateLimit;
  return copy.auth.errorGeneric;
}

function setupMessage(state: typeof supabaseSetupState, copy: ReturnType<typeof getStudentPortalCopy>) {
  if (state === 'unsafe-key') return copy.common.setupUnsafeKey;
  if (state === 'invalid-key') return copy.common.setupInvalidKey;
  if (state === 'invalid-url') return copy.common.setupInvalidUrl;
  if (state === 'missing') return copy.common.setupMissing;
  return '';
}

function PortalHeader({ locale, onSwitchLocale, stageLabel }: { locale: Locale; onSwitchLocale: () => void; stageLabel?: string }) {
  const copy = getStudentPortalCopy(locale);
  return (
    <LearningHeader
      locale={locale}
      onSwitchLocale={onSwitchLocale}
      allPathsLabel={copy.common.paths}
      stageLabel={stageLabel}
    />
  );
}

function AuthGatewayHeader({ locale, onSwitchLocale }: { locale: Locale; onSwitchLocale: () => void }) {
  const isArabic = locale === 'ar';
  return (
    <header className="site-header student-auth-header section-frame">
      <a className="student-auth-header-brand" href="/login" aria-label="VANTA — Create Beyond">
        <img src="/brand/vanta-emblem.png" alt="" aria-hidden="true" width="40" height="34" />
        <img src="/brand/vanta-wordmark.png" alt="VANTA — Create Beyond" width="156" height="40" />
      </a>
      <span className="student-auth-header-label" aria-hidden="true">{isArabic ? 'بوابة المتعلّم' : 'LEARNER GATEWAY'}</span>
      <button
        className="language-toggle"
        type="button"
        onClick={onSwitchLocale}
        aria-label={messages[locale].nav.switchLanguage}
      >
        <span className="language-toggle-mark" aria-hidden="true">文</span>
        <span>{isArabic ? 'EN' : 'عربي'}</span>
      </button>
    </header>
  );
}

export function StudentAuthPage({
  locale,
  onSwitchLocale,
  mode,
}: {
  locale: Locale;
  onSwitchLocale: () => void;
  mode: StudentAuthMode;
}) {
  const { user, recoverySession, loading: authLoading, serviceError } = useAuth();
  const copy = getStudentPortalCopy(locale);
  const isArabic = locale === 'ar';
  const query = useMemo(() => new URLSearchParams(window.location.search), []);
  const returnPath = safeReturnPath(query.get('next'));
  const loginHref = `/login?next=${encodeURIComponent(returnPath)}`;
  const signupHref = `/signup?next=${encodeURIComponent(returnPath)}`;
  const callbackHasError = useMemo(() => {
    const fragment = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    return ['error', 'error_code'].some((key) => query.has(key) || fragment.has(key));
  }, [query]);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [callbackExpired, setCallbackExpired] = useState(callbackHasError);

  const title = mode === 'login' ? copy.auth.loginTitle
    : mode === 'signup' ? copy.auth.signupTitle
      : mode === 'forgot-password' ? copy.auth.forgotTitle
        : mode === 'reset-password' ? copy.auth.resetTitle
          : copy.auth.callbackTitle;
  useEffect(() => {
    if (!authLoading && user && (mode === 'login' || mode === 'signup')) {
      window.location.replace(returnPath);
    }
  }, [authLoading, mode, returnPath, user]);

  useEffect(() => {
    if (mode !== 'callback' || authLoading) return;
    if (user) {
      window.location.replace(returnPath);
      return;
    }
    if (callbackHasError) return;
    const timer = window.setTimeout(() => setCallbackExpired(true), 10000);
    return () => window.clearTimeout(timer);
  }, [authLoading, callbackHasError, mode, returnPath, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setNotice('');

    if (mode === 'signup') {
      if (displayName.trim().length < 2) return setErrorMessage(copy.auth.validationName);
      if (password.length < 8) return setErrorMessage(copy.auth.validationPassword);
      if (password !== confirmPassword) return setErrorMessage(copy.auth.validationConfirm);
    }
    if (mode === 'reset-password') {
      if (!user || !recoverySession) return setErrorMessage(copy.auth.passwordResetMissingSession);
      if (password.length < 8) return setErrorMessage(copy.auth.validationPassword);
      if (password !== confirmPassword) return setErrorMessage(copy.auth.validationConfirm);
    }

    if (!supabaseClient) {
      setErrorMessage(setupMessage(supabaseSetupState, copy) || copy.auth.setupOnly);
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'login') {
        const { error } = await supabaseClient.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        window.location.assign(returnPath);
        return;
      }

      if (mode === 'signup') {
        const { data, error } = await supabaseClient.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: displayName.trim() },
            emailRedirectTo: new URL(`/auth/callback?next=${encodeURIComponent(returnPath)}`, window.location.origin).toString(),
          },
        });
        if (error) throw error;
        if (data.session) {
          window.location.assign(returnPath);
        } else {
          setNotice(copy.auth.confirmationBody);
        }
        return;
      }

      if (mode === 'forgot-password') {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: new URL(`/reset-password?next=${encodeURIComponent(returnPath)}`, window.location.origin).toString(),
        });
        if (error) throw error;
        setNotice(copy.auth.resetSentBody);
        return;
      }

      if (mode === 'reset-password') {
        const { error } = await supabaseClient.auth.updateUser({ password });
        if (error) throw error;
        setPassword('');
        setConfirmPassword('');
        setNotice(copy.auth.passwordUpdated);
        return;
      }
    } catch (error) {
      setErrorMessage(error instanceof Error && 'status' in error
        ? authErrorMessage(error as AuthError, copy)
        : copy.auth.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  const isFormMode = mode !== 'callback';
  const needsEmail = mode === 'login' || mode === 'signup' || mode === 'forgot-password';
  const needsPassword = mode === 'login' || mode === 'signup' || mode === 'reset-password';
  const needsName = mode === 'signup';
  const needsConfirmation = mode === 'signup' || mode === 'reset-password';
  const setupNotice = setupMessage(supabaseSetupState, copy);
  const visual = copy.authVisual;
  const submitLabel = submitting ? copy.auth.submitBusy : mode === 'login' ? copy.common.signIn
    : mode === 'signup' ? copy.common.createAccount
      : mode === 'forgot-password' ? copy.common.sendReset
        : copy.common.updatePassword;

  return (
    <div className={`app-shell student-page student-auth-page ${isArabic ? 'is-arabic' : 'is-english'}`}>
      <AuthGatewayHeader locale={locale} onSwitchLocale={onSwitchLocale} />
      <main className="student-page-main student-auth-main section-frame">
        <div className="student-auth-layout" dir="ltr">
          <section className="student-auth-context" dir={isArabic ? 'rtl' : 'ltr'} aria-labelledby="student-auth-visual-title">
            <p className="eyebrow"><span className="eyebrow-line" />{copy.auth.eyebrow}</p>
            <p className="student-auth-brand-line">{visual.brandLine}</p>
            <h1 id="student-auth-visual-title">{visual.title}</h1>
            <p className="student-auth-description">{visual.body}</p>

            <div className="student-code-module">
              <div className="student-code-module-heading">
                <span>{visual.codeLabel}</span>
                <span className="student-code-module-index" dir="ltr">HTML / 01</span>
              </div>
              <div className="student-code-window" dir="ltr" aria-hidden="true">
                <div className="student-code-chrome"><i /><i /><i /><span>index.html</span></div>
                <pre><code>
                  <span className="student-code-line"><span className="student-code-line-number">01</span><span><b>&lt;main&gt;</b></span></span>
                  <span className="student-code-line"><span className="student-code-line-number">02</span><span><b>&lt;h1&gt;</b><em>Build with purpose</em><b>&lt;/h1&gt;</b></span></span>
                  <span className="student-code-line"><span className="student-code-line-number">03</span><span><b>&lt;p&gt;</b><em>One step at a time.</em><b>&lt;/p&gt;</b></span></span>
                  <span className="student-code-line"><span className="student-code-line-number">04</span><span><b>&lt;/main&gt;</b></span></span>
                </code></pre>
                <span className="student-code-caret" />
              </div>
            </div>

            <div className="student-auth-sequence">
              <p>{visual.sequenceLabel}</p>
              <ol>
                {visual.steps.map((step, index) => (
                  <li key={step} style={{ animationDelay: `${index * 75}ms` }}>
                    <span className="student-sequence-index" dir="ltr">0{index + 1}</span>
                    <span>{step}</span>
                    {index < visual.steps.length - 1 && <span className="student-sequence-arrow" aria-hidden="true" dir="ltr">{isArabic ? '←' : '→'}</span>}
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="student-auth-panel" dir={isArabic ? 'rtl' : 'ltr'} aria-labelledby="student-auth-title">
            <div className="student-auth-panel-head">
              <span className="student-auth-mark" aria-hidden="true">V / 01</span>
              <h2 id="student-auth-title">{title}</h2>
            </div>

            {setupNotice && <p className="student-setup-notice" role="status">{setupNotice}</p>}
            {serviceError && <p className="student-form-error" role="alert">{copy.common.serviceError}</p>}
            {errorMessage && <p className="student-form-error" role="alert">{errorMessage}</p>}
            {notice && <p className="student-form-success" role="status">{notice}</p>}

            {mode === 'callback' && (
              <div className="student-callback-state" role="status" aria-live="polite">
                {!authLoading && !callbackExpired && !user && <span className="student-loading-mark" aria-hidden="true" />}
                <p>{user ? copy.auth.callbackReady : callbackExpired ? copy.auth.callbackFailed : copy.auth.callbackBody}</p>
                {(callbackExpired || serviceError) && (
                  <a className="button button-primary" href="/login">{copy.common.backToLogin}</a>
                )}
              </div>
            )}

            {mode === 'reset-password' && authLoading && (
              <div className="student-callback-state" role="status" aria-live="polite">
                <span className="student-loading-mark" aria-hidden="true" />
                <p>{copy.common.loading}</p>
              </div>
            )}

            {mode === 'reset-password' && !authLoading && (!user || !recoverySession) && (
              <div className="student-callback-state">
                <p>{copy.auth.passwordResetMissingSession}</p>
                <a className="button button-primary" href="/forgot-password">{copy.auth.resetLink}</a>
              </div>
            )}

            {isFormMode && !(mode === 'reset-password' && (authLoading || !user || !recoverySession)) && (
              <form
                className="student-auth-form"
                aria-busy={submitting}
                onInvalidCapture={(event) => {
                  const field = event.target as HTMLInputElement;
                  if (field.validity.valueMissing) setErrorMessage(copy.auth.validationRequired);
                  else if (field.type === 'email' && field.validity.typeMismatch) setErrorMessage(copy.auth.validationEmail);
                  else if (field.validity.tooShort && field.name === 'password') setErrorMessage(copy.auth.validationPassword);
                  else if (field.name === 'display-name' && field.validity.tooShort) setErrorMessage(copy.auth.validationName);
                }}
                onSubmit={handleSubmit}
              >
                {needsName && (
                  <label className="student-field">
                    <span>{copy.common.displayName}</span>
                    <input
                      autoComplete="name"
                      dir="auto"
                      maxLength={80}
                      minLength={2}
                      name="display-name"
                      placeholder={copy.common.displayNamePlaceholder}
                      required
                      value={displayName}
                      onChange={(event) => { setDisplayName(event.target.value); setErrorMessage(''); }}
                    />
                  </label>
                )}

                {needsEmail && (
                  <label className="student-field">
                    <span>{copy.common.email}</span>
                    <input
                      autoComplete="email"
                      dir="ltr"
                      name="email"
                      placeholder={copy.common.emailPlaceholder}
                      required
                      type="email"
                      value={email}
                      onChange={(event) => { setEmail(event.target.value); setErrorMessage(''); }}
                    />
                  </label>
                )}

                {needsPassword && (
                  <label className="student-field">
                    <span>{copy.common.password}</span>
                    <span className="student-password-control">
                      <input
                        autoComplete={mode === 'reset-password' ? 'new-password' : mode === 'signup' ? 'new-password' : 'current-password'}
                        dir="ltr"
                        minLength={mode === 'login' ? undefined : 8}
                        name="password"
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => { setPassword(event.target.value); setErrorMessage(''); }}
                      />
                      <button className="student-password-toggle" type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? copy.common.hidePassword : copy.common.showPassword} aria-pressed={showPassword}>
                        <span className="student-password-icon" aria-hidden="true">{showPassword ? '◉' : '◎'}</span>
                      </button>
                    </span>
                    {(mode === 'signup' || mode === 'reset-password') && <small>{copy.common.minimumPassword}</small>}
                  </label>
                )}

                {needsConfirmation && (
                  <label className="student-field">
                    <span>{copy.common.confirmPassword}</span>
                    <input
                      autoComplete="new-password"
                      dir="ltr"
                      minLength={8}
                      name="confirm-password"
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(event) => { setConfirmPassword(event.target.value); setErrorMessage(''); }}
                    />
                  </label>
                )}

                <button className="button button-primary student-auth-submit" type="submit" disabled={submitting || authLoading}>
                  <span className="student-submit-copy">{submitLabel}</span>
                  {submitting
                    ? <span className="student-submit-spinner" aria-hidden="true" />
                    : <span className="student-submit-arrow" aria-hidden="true">{isArabic ? '←' : '→'}</span>}
                </button>
              </form>
            )}

            <nav className="student-auth-links" aria-label={isArabic ? 'روابط الحساب' : 'Account links'}>
              {mode === 'login' && (
                <>
                  <a href={`/forgot-password?next=${encodeURIComponent(returnPath)}`}>{copy.auth.forgotLink}</a>
                  <p>{copy.common.noAccount} <a href={signupHref}>{copy.auth.signupLink}</a></p>
                </>
              )}
              {mode === 'signup' && <p>{copy.common.haveAccount} <a href={loginHref}>{copy.auth.loginLink}</a></p>}
              {mode === 'forgot-password' && <a href={loginHref}>{copy.common.backToLogin}</a>}
              {mode === 'reset-password' && <a href={loginHref}>{copy.common.backToLogin}</a>}
            </nav>
          </section>
        </div>
      </main>
    </div>
  );
}

export function AuthGatewayLoadingPage({ locale, onSwitchLocale }: { locale: Locale; onSwitchLocale: () => void }) {
  const copy = getStudentPortalCopy(locale);
  const isArabic = locale === 'ar';
  return (
    <div className={`app-shell student-page student-auth-page student-auth-gateway-page ${isArabic ? 'is-arabic' : 'is-english'}`}>
      <AuthGatewayHeader locale={locale} onSwitchLocale={onSwitchLocale} />
      <main className="student-auth-gateway-wait section-frame">
        <div className="student-auth-gateway-status">
          <span className="student-auth-mark" aria-hidden="true">V / 01</span>
          <span className="student-loading-mark" aria-hidden="true" />
          <h1>{copy.authVisual.brandLine}</h1>
          <p role="status" aria-live="polite">{copy.auth.gatewayLoading}</p>
        </div>
      </main>
    </div>
  );
}

function AuthRequiredPage({ locale, onSwitchLocale, setupState }: { locale: Locale; onSwitchLocale: () => void; setupState: typeof supabaseSetupState }) {
  const copy = getStudentPortalCopy(locale);
  const isArabic = locale === 'ar';
  const next = safeReturnPath(window.location.pathname);
  const loginHref = `/login?next=${encodeURIComponent(next)}`;
  const signupHref = `/signup?next=${encodeURIComponent(next)}`;
  const notice = setupMessage(setupState, copy);
  const pageTitle = window.location.pathname === '/profile' ? copy.profile.title : copy.nav.dashboard;

  return (
    <div className={`app-shell student-page ${isArabic ? 'is-arabic' : 'is-english'}`}>
      <PortalHeader locale={locale} onSwitchLocale={onSwitchLocale} stageLabel={copy.dashboard.eyebrow} />
      <main className="student-page-main section-frame">
        <section className="student-gate-panel">
          <p className="eyebrow"><span className="eyebrow-line" />VANTA / {pageTitle}</p>
          <h1>{pageTitle}</h1>
          <p>{notice || copy.common.signInToSave}</p>
          <div className="student-page-actions">
            <a className="button button-primary" href={loginHref}>{copy.nav.login}</a>
            <a className="button button-quiet" href={signupHref}>{copy.nav.signup}</a>
          </div>
        </section>
      </main>
    </div>
  );
}

function SessionLoadingPage({ locale, onSwitchLocale }: { locale: Locale; onSwitchLocale: () => void }) {
  const copy = getStudentPortalCopy(locale);
  const isArabic = locale === 'ar';
  return (
    <div className={`app-shell student-page ${isArabic ? 'is-arabic' : 'is-english'}`}>
      <PortalHeader locale={locale} onSwitchLocale={onSwitchLocale} />
      <main className="student-page-main section-frame">
        <p className="student-loading-state" role="status"><span className="student-loading-mark" aria-hidden="true" />{copy.common.loading}</p>
      </main>
    </div>
  );
}

function StudentDataUnavailablePage({ locale, onSwitchLocale, onRetry, loading }: {
  locale: Locale;
  onSwitchLocale: () => void;
  onRetry: () => void;
  loading: boolean;
}) {
  const copy = getStudentPortalCopy(locale);
  const isArabic = locale === 'ar';
  return (
    <div className={`app-shell student-page ${isArabic ? 'is-arabic' : 'is-english'}`}>
      <PortalHeader locale={locale} onSwitchLocale={onSwitchLocale} stageLabel={copy.dashboard.eyebrow} />
      <main className="student-page-main section-frame">
        <section className="student-gate-panel" aria-labelledby="student-data-error-title">
          <p className="eyebrow"><span className="eyebrow-line" />VANTA / {copy.dashboard.eyebrow}</p>
          <h1 id="student-data-error-title">{copy.common.loadErrorTitle}</h1>
          <p>{copy.common.loadErrorBody}</p>
          <div className="student-page-actions">
            <button className="button button-primary" type="button" onClick={onRetry} disabled={loading}>
              {loading ? copy.common.saving : copy.common.retry}
            </button>
            <a className="button button-quiet" href="/login">{copy.common.backToLogin}</a>
          </div>
        </section>
      </main>
    </div>
  );
}

function lessonCopy(locale: Locale, lessonId: HtmlLessonId) {
  return lessonId === 'html-introduction'
    ? messages[locale].lesson
    : messages[locale].learningSystem.lessons[lessonId];
}

function StudentDashboard({ locale, onSwitchLocale }: { locale: Locale; onSwitchLocale: () => void }) {
  const { user } = useAuth();
  const progress = useStudentProgress();
  const copy = getStudentPortalCopy(locale);
  const learningCopy = messages[locale].learningSystem;
  const isArabic = locale === 'ar';
  const pathStarted = progress.paths.some((path) => path.path_id === HTML_PATH_ID);
  const summary = summarizeHtmlLearningProgress(progress.lessons, pathStarted);
  const recentQuizzes = [...progress.lessons]
    .filter((lesson) => lesson.quiz_score !== null && lesson.quiz_total !== null)
    .sort((left, right) => Date.parse(right.last_opened_at) - Date.parse(left.last_opened_at))
    .slice(0, 3);
  const displayName = getStudentProgressName(user, progress.profile.display_name);
  const htmlPathTitle = learningCopy.paths[HTML_PATH_ID].title;
  const formattedNumber = new Intl.NumberFormat(locale === 'ar' ? 'ar' : 'en-US');
  const fill = (template: string, values: Record<string, string | number>) => Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)), template,
  );
  const pathState = summary.pathCompleted ? copy.dashboard.pathCompleted
    : pathStarted ? copy.dashboard.pathInProgress : copy.dashboard.pathNotStarted;
  const percentFor = (score: number, total: number) => Math.round((score / total) * 100);

  return (
    <div className={`app-shell student-page student-dashboard-page ${isArabic ? 'is-arabic' : 'is-english'}`}>
      <PortalHeader locale={locale} onSwitchLocale={onSwitchLocale} stageLabel={copy.dashboard.eyebrow} />
      <main className="student-page-main section-frame">
        <header className="student-page-intro">
          <p className="eyebrow"><span className="eyebrow-line" />{copy.dashboard.eyebrow}</p>
          <h1>{fill(copy.dashboard.title, { name: displayName })}</h1>
          <p>{copy.dashboard.lead}</p>
        </header>

        {progress.error && (
          <p className="student-form-error" role="alert">
            {copy.common.dataError}{' '}
            <button type="button" onClick={() => { void progress.refresh(); }}>{copy.common.retry}</button>
          </p>
        )}
        <section className="student-stat-row" aria-label={copy.dashboard.eyebrow}>
          <article className="student-stat"><span>{copy.dashboard.pathsStarted}</span><strong>{formattedNumber.format(progress.paths.length)}</strong></article>
          <article className="student-stat"><span>{copy.dashboard.pathsCompleted}</span><strong>{formattedNumber.format(summary.pathCompleted ? 1 : 0)}</strong></article>
          <article className="student-stat"><span>{copy.dashboard.lessonsCompleted}</span><strong>{formattedNumber.format(summary.completedLessonCount)}<small> / {formattedNumber.format(HTML_LESSON_IDS.length)}</small></strong></article>
        </section>

        <section className="student-continue-panel" aria-labelledby="student-continue-title">
          <div>
            <p className="student-section-kicker">{copy.dashboard.currentPath} · {htmlPathTitle}</p>
            <span className="student-path-state">{pathState}</span>
            <h2 id="student-continue-title">{copy.dashboard.continueTitle}</h2>
            <p>{summary.pathCompleted ? copy.dashboard.allComplete : copy.dashboard.continueBody}</p>
            <div className="student-continue-details">
              <p><span>{copy.dashboard.currentLesson}</span><strong>{summary.lastOpenedLessonId ? lessonCopy(locale, summary.lastOpenedLessonId).title : copy.dashboard.noCurrentLesson}</strong></p>
              <p><span>{copy.dashboard.nextRecommended}</span><strong>{summary.recommendedLessonId ? lessonCopy(locale, summary.recommendedLessonId).title : copy.dashboard.allComplete}</strong></p>
            </div>
          </div>
          <a className="button button-primary" href={getHtmlLessonHref(summary.resumeLessonId)}>
            {summary.pathCompleted ? copy.dashboard.reviewAction : copy.dashboard.continueAction}
            <span aria-hidden="true">{isArabic ? '←' : '→'}</span>
          </a>
        </section>

        <section className="student-path-panel" aria-labelledby="student-path-title">
          <div className="student-path-panel-heading">
            <div>
              <p className="student-section-kicker">01 / HTML</p>
              <h2 id="student-path-title">{htmlPathTitle}</h2>
            </div>
            <span dir="auto">{fill(copy.dashboard.pathLessonCount, { count: formattedNumber.format(HTML_LESSON_IDS.length) })}</span>
            <strong dir="ltr">{fill(copy.dashboard.pathProgress, { completed: formattedNumber.format(summary.completedLessonCount), total: formattedNumber.format(HTML_LESSON_IDS.length) })}</strong>
          </div>
          <div className="student-progress-track" role="progressbar" aria-label={copy.dashboard.pathProgress} aria-valuemin={0} aria-valuemax={HTML_LESSON_IDS.length} aria-valuenow={summary.completedLessonCount}>
            <span style={{ width: `${(summary.completedLessonCount / HTML_LESSON_IDS.length) * 100}%` }} />
          </div>
          <ol className="student-lesson-list">
            {HTML_LESSON_IDS.map((lessonId, index) => {
              const row = progress.lessons.find((lesson) => lesson.lesson_id === lessonId);
              const isComplete = summary.completedLessonIds.has(lessonId);
              const isCurrent = summary.lastOpenedLessonId === lessonId && !isComplete;
              const title = lessonCopy(locale, lessonId).title;
              const status = isComplete ? copy.dashboard.completed : row ? copy.dashboard.started : copy.dashboard.notStarted;
              return (
                <li className={`${isComplete ? 'is-complete' : ''} ${isCurrent ? 'is-current' : ''}`} key={lessonId}>
                  <span className="student-lesson-index" dir="ltr">{isComplete ? '✓' : String(index + 1).padStart(2, '0')}</span>
                  <a href={getHtmlLessonHref(lessonId)}>{title}</a>
                  <span className="student-lesson-status">{status}</span>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="student-profile-card student-dashboard-quiz" aria-labelledby="dashboard-recent-quizzes-title">
          <div className="student-profile-card-heading">
            <h2 id="dashboard-recent-quizzes-title">{copy.dashboard.recentQuizResults}</h2>
            <span>{formattedNumber.format(recentQuizzes.length)}</span>
          </div>
          {recentQuizzes.length ? (
            <ul className="student-profile-quiz-list">
              {recentQuizzes.map((result) => {
                const score = result.quiz_score ?? 0;
                const total = result.quiz_total ?? 0;
                return (
                  <li key={result.lesson_id}>
                    <span>{lessonCopy(locale, result.lesson_id).title}</span>
                    <strong dir="ltr">{formattedNumber.format(score)} / {formattedNumber.format(total)} · {fill(copy.dashboard.scorePercent, { percent: formattedNumber.format(percentFor(score, total)) })}</strong>
                  </li>
                );
              })}
            </ul>
          ) : <p className="student-profile-empty">{copy.dashboard.noRecentQuizResults}</p>}
        </section>

        <div className="student-dashboard-footer">
          <p>{copy.dashboard.accountDataNote}</p>
          <a href="/profile">{copy.dashboard.profileLink}<span aria-hidden="true"> {isArabic ? '←' : '→'}</span></a>
        </div>
      </main>
    </div>
  );
}

function StudentProfile({ locale, onSwitchLocale }: { locale: Locale; onSwitchLocale: () => void }) {
  const { user } = useAuth();
  const progress = useStudentProgress();
  const copy = getStudentPortalCopy(locale);
  const isArabic = locale === 'ar';
  const displayName = getStudentProgressName(user, progress.profile.display_name);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(displayName);
  const [nameState, setNameState] = useState<'idle' | 'saving' | 'saved' | 'error' | 'invalid'>('idle');
  const joined = user?.created_at
    ? new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en-US', { dateStyle: 'long' }).format(new Date(user.created_at))
    : '—';
  const verified = Boolean(user?.email_confirmed_at);
  const pathStarted = progress.paths.some((path) => path.path_id === HTML_PATH_ID);
  const summary = summarizeHtmlLearningProgress(progress.lessons, pathStarted);
  const overallProgress = Math.round((summary.completedLessonCount / HTML_LESSON_IDS.length) * 100);
  const formattedNumber = new Intl.NumberFormat(locale === 'ar' ? 'ar' : 'en-US');
  const quizResults = [...progress.lessons]
    .filter((lesson) => lesson.quiz_score !== null && lesson.quiz_total !== null)
    .sort((a, b) => Date.parse(b.last_opened_at) - Date.parse(a.last_opened_at));

  useEffect(() => setNameInput(displayName), [displayName]);

  const submitDisplayName = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedName = nameInput.trim();
    if (normalizedName.length < 2 || normalizedName.length > 80) {
      setNameState('invalid');
      return;
    }
    setNameState('saving');
    const saved = await progress.updateDisplayName(normalizedName);
    setNameState(saved ? 'saved' : 'error');
    if (saved) setEditingName(false);
  };

  return (
    <div className={`app-shell student-page ${isArabic ? 'is-arabic' : 'is-english'}`}>
      <PortalHeader locale={locale} onSwitchLocale={onSwitchLocale} stageLabel={copy.profile.eyebrow} />
      <main className="student-page-main section-frame">
        <header className="student-page-intro">
          <p className="eyebrow"><span className="eyebrow-line" />{copy.profile.eyebrow}</p>
          <h1>{copy.profile.title}</h1>
          <p>{copy.profile.lead}</p>
        </header>
        {progress.error && (
          <p className="student-form-error" role="alert">
            {copy.common.dataError}{' '}
            <button type="button" onClick={() => { void progress.refresh(); }}>{copy.common.retry}</button>
          </p>
        )}
        <section className="student-profile-panel" aria-label={copy.profile.title}>
          <div className="student-profile-mark" aria-hidden="true">{displayName.slice(0, 1).toLocaleUpperCase(locale)}</div>
          <dl>
            <div className="student-profile-name-field">
              <dt>{copy.profile.displayName}</dt>
              <dd>
                {editingName ? (
                  <form className="student-profile-name-form" noValidate onSubmit={submitDisplayName}>
                    <input
                      aria-invalid={nameState === 'invalid'}
                      aria-label={copy.profile.displayName}
                      autoComplete="name"
                      dir="auto"
                      maxLength={80}
                      minLength={2}
                      required
                      value={nameInput}
                      onChange={(event) => { setNameInput(event.target.value); setNameState('idle'); }}
                    />
                    <small>{copy.common.displayNameHint}</small>
                    {nameState === 'invalid' && <span className="student-form-error" role="alert">{copy.common.displayNameValidation}</span>}
                    {nameState === 'error' && <span className="student-form-error" role="alert">{copy.common.displayNameUpdateFailed}</span>}
                    <div className="student-profile-name-actions">
                      <button className="button button-primary" type="submit" disabled={nameState === 'saving'}>
                        {nameState === 'saving' ? copy.common.saving : copy.common.save}
                      </button>
                      <button
                        className="button button-quiet"
                        type="button"
                        disabled={nameState === 'saving'}
                        onClick={() => { setEditingName(false); setNameInput(displayName); setNameState('idle'); }}
                      >
                        {copy.common.cancel}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="student-profile-name-view">
                    <span>{displayName}</span>
                    <button type="button" onClick={() => { setNameInput(displayName); setEditingName(true); setNameState('idle'); }}>
                      {copy.common.edit}
                    </button>
                  </div>
                )}
                {nameState === 'saved' && <span className="student-form-success" role="status">{copy.common.displayNameUpdated}</span>}
              </dd>
            </div>
            <div><dt>{copy.profile.email}</dt><dd dir="ltr">{user?.email ?? '—'}</dd></div>
            <div><dt>{copy.profile.joined}</dt><dd>{joined}</dd></div>
            <div><dt>{copy.profile.currentLevel}</dt><dd>{copy.profile.beginnerLevel}</dd></div>
            <div><dt>{copy.profile.emailVerified}</dt><dd><span className={`student-verification ${verified ? 'is-verified' : ''}`}>{verified ? copy.profile.verified : copy.profile.pending}</span></dd></div>
          </dl>
          <a className="button button-quiet" href="/dashboard">{copy.profile.backDashboard}<span aria-hidden="true">{isArabic ? '←' : '→'}</span></a>
        </section>
        <div className="student-profile-learning-grid">
          <section className="student-profile-card" aria-labelledby="profile-progress-title">
            <div className="student-profile-card-heading">
              <h2 id="profile-progress-title">{copy.profile.pathProgress}</h2>
              <span dir="ltr">{formattedNumber.format(overallProgress)}%</span>
            </div>
            <p className="student-profile-path-name">{messages[locale].learningSystem.paths[HTML_PATH_ID].title}</p>
            <div className="student-progress-track" role="progressbar" aria-label={copy.profile.overallProgress} aria-valuemin={0} aria-valuemax={100} aria-valuenow={overallProgress}>
              <span style={{ width: `${overallProgress}%` }} />
            </div>
            <dl className="student-profile-counts">
              <div><dt>{copy.profile.pathsStarted}</dt><dd>{formattedNumber.format(progress.paths.length)}</dd></div>
              <div><dt>{copy.profile.pathsCompleted}</dt><dd>{formattedNumber.format(summary.pathCompleted ? 1 : 0)}</dd></div>
              <div><dt>{copy.profile.lessonsCompleted}</dt><dd dir="ltr">{formattedNumber.format(summary.completedLessonCount)} / {formattedNumber.format(HTML_LESSON_IDS.length)}</dd></div>
            </dl>
          </section>

          <section className="student-profile-card" aria-labelledby="profile-quiz-title">
            <div className="student-profile-card-heading">
              <h2 id="profile-quiz-title">{copy.profile.quizResults}</h2>
              <span>{formattedNumber.format(quizResults.length)}</span>
            </div>
            {quizResults.length ? (
              <ul className="student-profile-quiz-list">
                {quizResults.map((result) => (
                  <li key={result.lesson_id}>
                    <span>{lessonCopy(locale, result.lesson_id).title}</span>
                    <strong dir="ltr">{formattedNumber.format(result.quiz_score ?? 0)} / {formattedNumber.format(result.quiz_total ?? 0)}</strong>
                  </li>
                ))}
              </ul>
            ) : <p className="student-profile-empty">{copy.profile.noQuizResults}</p>}
          </section>

          <section className="student-profile-card student-profile-future" aria-labelledby="profile-achievements-title">
            <h2 id="profile-achievements-title">{copy.profile.futureAchievements}</h2>
            <p>{copy.profile.futureAchievementsNote}</p>
          </section>
        </div>
      </main>
    </div>
  );
}

export function ProtectedStudentArea({
  locale,
  onSwitchLocale,
  page,
}: {
  locale: Locale;
  onSwitchLocale: () => void;
  page: 'dashboard' | 'profile';
}) {
  const auth = useAuth();
  const progress = useStudentProgress();
  if (auth.loading || (auth.user && progress.loading && !progress.hasLoaded)) {
    return <SessionLoadingPage locale={locale} onSwitchLocale={onSwitchLocale} />;
  }
  if (auth.user && progress.error && !progress.hasLoaded) {
    return (
      <StudentDataUnavailablePage
        locale={locale}
        onSwitchLocale={onSwitchLocale}
        onRetry={() => { void progress.refresh(); }}
        loading={progress.loading}
      />
    );
  }
  if (!auth.user || supabaseSetupState !== 'ready') return <AuthRequiredPage locale={locale} onSwitchLocale={onSwitchLocale} setupState={auth.setupState} />;
  return page === 'dashboard'
    ? <StudentDashboard locale={locale} onSwitchLocale={onSwitchLocale} />
    : <StudentProfile locale={locale} onSwitchLocale={onSwitchLocale} />;
}
