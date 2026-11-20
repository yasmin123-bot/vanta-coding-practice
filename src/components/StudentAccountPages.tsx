import { useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import type { AuthError } from '@supabase/supabase-js';
import { FOUNDATION_PATH_IDS, getLessonHref, type FoundationLessonId } from '../content/learningSystem';
import { getLearningLessonCopy, getLearningPathLessonSummaries } from '../i18n/foundationLessonCopy';
import type { Locale } from '../i18n/messages';
import { messages } from '../i18n/messages';
import { getStudentPortalCopy } from '../i18n/studentPortal';
import { supabaseClient, supabaseSetupState } from '../lib/supabaseClient';
import { getStudentProgressName, useStudentProgress } from '../state/StudentProgressProvider';
import { useAuth } from '../auth/AuthProvider';
import { countCompletedFoundationLessons, getFoundationLearningState, summarizeFoundationLearningProgress } from '../utils/learningProgress';
import { safeReturnPath } from '../utils/safeReturnPath';
import { EMAIL_OTP_COOLDOWN_SECONDS, EMAIL_OTP_MAX_ATTEMPTS, getEmailOtpCooldownSeconds, isExpiredEmailOtpError, normalizeEmailOtp } from '../utils/emailOtp';
import LearningHeader from './LearningHeader';
import LearningHomePage from './LearningHomePage';
import AppIcon from './AppIcon';
import BrandLogo from './BrandLogo';
import ThemeToggle from './ThemeToggle';
import StudentAvatar from './StudentAvatar';
import ProgrammingLanguageLabel, { type ProgrammingLanguage } from './ProgrammingLanguageLabel';
import { getProfileAvatarFileError, type ProfileAvatarErrorCode } from '../services/profileAvatar';
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

function otpErrorMessage(error: AuthError, copy: ReturnType<typeof getStudentPortalCopy>) {
  if (error.status === 429 || error.code?.includes('rate_limit') || error.code?.includes('over_email_send_rate_limit')) {
    return copy.auth.errorRateLimit;
  }
  return isExpiredEmailOtpError(error) ? copy.auth.errorOtpExpired : copy.auth.errorOtpInvalid;
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
    <header className="mabda-auth-toolbar section-frame" dir="ltr" aria-label={getStudentPortalCopy(locale).auth.eyebrow}>
      <ThemeToggle locale={locale} />
      <button
        className="language-toggle"
        type="button"
        onClick={onSwitchLocale}
        aria-label={messages[locale].nav.switchLanguage}
      >
        <span className="language-toggle-mark" aria-hidden="true"><AppIcon name="language" size={16} /></span>
        <span>{isArabic ? 'EN' : 'عربي'}</span>
      </button>
    </header>
  );
}

function AuthBrandHeader() {
  return (
    <header className="mabda-auth-brand" aria-label="Mabda — مبدأ, by VANTA">
      <BrandLogo variant="mark" decorative />
      <p className="mabda-auth-brand-name" dir="ltr">Mabda <span aria-hidden="true">|</span> <b dir="rtl">مبدأ</b></p>
      <p className="mabda-auth-endorsement" dir="ltr">by VANTA</p>
    </header>
  );
}

export function StudentAuthPage({
  locale,
  onSwitchLocale,
  onNavigate,
  mode,
}: {
  locale: Locale;
  onSwitchLocale: () => void;
  onNavigate: (href: string) => void;
  mode: StudentAuthMode;
}) {
  const { user, recoverySession, loading: authLoading, serviceError } = useAuth();
  const copy = getStudentPortalCopy(locale);
  const isArabic = locale === 'ar';
  const query = useMemo(() => new URLSearchParams(window.location.search), []);
  const returnPath = safeReturnPath(query.get('next'));
  const loginHref = `/login?next=${encodeURIComponent(returnPath)}`;
  const signupHref = `/signup?next=${encodeURIComponent(returnPath)}`;
  const internalAuthLink = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onNavigate(href);
  };
  const callbackHasError = useMemo(() => {
    const fragment = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    return ['error', 'error_code'].some((key) => query.has(key) || fragment.has(key));
  }, [query]);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [callbackExpired, setCallbackExpired] = useState(callbackHasError);
  const [authStep, setAuthStep] = useState<'form' | 'otp' | 'new-password' | 'complete'>('form');
  const [otpFlow, setOtpFlow] = useState<'signup' | 'recovery' | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [resendAt, setResendAt] = useState(0);
  const [resendSeconds, setResendSeconds] = useState(0);
  const signupAttemptRef = useRef(false);
  const otpInputRef = useRef<HTMLInputElement>(null);

  const title = mode === 'signup' && authStep === 'otp' ? copy.auth.verifyEmailTitle
    : mode === 'forgot-password' && authStep === 'otp' ? copy.auth.verifyRecoveryTitle
      : mode === 'forgot-password' && authStep === 'complete' ? copy.auth.resetTitle
        : mode === 'forgot-password' && authStep === 'new-password' ? copy.auth.resetTitle
        : mode === 'login' ? copy.auth.loginTitle
    : mode === 'signup' ? copy.auth.signupTitle
      : mode === 'forgot-password' ? copy.auth.forgotTitle
        : mode === 'reset-password' ? copy.auth.resetTitle
          : copy.auth.callbackTitle;
  const body = mode === 'signup' && authStep === 'otp' ? copy.auth.verifyEmailBody
    : mode === 'forgot-password' && authStep === 'otp' ? copy.auth.verifyRecoveryBody
      : mode === 'forgot-password' && authStep === 'complete' ? copy.auth.passwordUpdated
        : mode === 'forgot-password' && authStep === 'new-password' ? copy.auth.resetBody
        : mode === 'login' ? copy.auth.loginBody
    : mode === 'signup' ? copy.auth.signupBody
      : mode === 'forgot-password' ? copy.auth.forgotBody
        : mode === 'reset-password' ? copy.auth.resetBody
          : copy.auth.callbackBody;
  useEffect(() => {
    if (!authLoading && user && (mode === 'login' || (mode === 'signup' && !signupAttemptRef.current))) {
      window.location.replace(returnPath);
    }
  }, [authLoading, mode, returnPath, user]);

  useEffect(() => {
    if (mode === 'forgot-password' && !authLoading && user && recoverySession && authStep === 'form') {
      setAuthStep('new-password');
    }
  }, [authLoading, authStep, mode, recoverySession, user]);

  useEffect(() => {
    if (authStep === 'otp') otpInputRef.current?.focus();
  }, [authStep]);

  useEffect(() => {
    if (!resendAt) return;
    const updateCountdown = () => setResendSeconds(getEmailOtpCooldownSeconds(resendAt));
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [resendAt]);

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

    if (mode === 'signup' && authStep === 'form') {
      if (displayName.trim().length < 2) return setErrorMessage(copy.auth.validationName);
      if (password.length < 8) return setErrorMessage(copy.auth.validationPassword);
      if (password !== confirmPassword) return setErrorMessage(copy.auth.validationConfirm);
    }
    const isOtpRecoveryPassword = mode === 'forgot-password' && authStep === 'new-password';
    if (mode === 'reset-password' || isOtpRecoveryPassword) {
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

      if (mode === 'signup' && authStep === 'form') {
        signupAttemptRef.current = true;
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
          const { error: signOutError } = await supabaseClient.auth.signOut({ scope: 'local' });
          setErrorMessage(signOutError ? copy.auth.emailConfirmationSessionActive : copy.auth.emailConfirmationRequired);
          return;
        }
        setPassword('');
        setConfirmPassword('');
        setOtpFlow('signup');
        setOtpCode('');
        setOtpAttempts(0);
        setResendAt(Date.now() + EMAIL_OTP_COOLDOWN_SECONDS * 1000);
        setAuthStep('otp');
        setNotice(copy.auth.signupOtpSentBody);
        return;
      }

      if (mode === 'forgot-password' && authStep === 'form') {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: new URL(`/reset-password?next=${encodeURIComponent(returnPath)}`, window.location.origin).toString(),
        });
        if (error) throw error;
        setOtpFlow('recovery');
        setOtpCode('');
        setOtpAttempts(0);
        setResendAt(Date.now() + EMAIL_OTP_COOLDOWN_SECONDS * 1000);
        setAuthStep('otp');
        setNotice(copy.auth.resetSentBody);
        return;
      }

      if (isOtpRecoveryPassword) {
        const { error } = await supabaseClient.auth.updateUser({ password });
        if (error) throw error;
        setPassword('');
        setConfirmPassword('');
        const { error: signOutError } = await supabaseClient.auth.signOut({ scope: 'local' });
        setAuthStep('complete');
        setNotice(copy.auth.passwordUpdated);
        if (signOutError) setErrorMessage(copy.auth.passwordUpdatedActiveSession);
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

  const verifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setNotice('');
    const token = normalizeEmailOtp(otpCode);
    if (token.length !== 6) {
      setErrorMessage(copy.auth.validationOtpCode);
      return;
    }
    if (otpAttempts >= EMAIL_OTP_MAX_ATTEMPTS) {
      setErrorMessage(copy.auth.otpAttemptsLimit);
      return;
    }
    if (!supabaseClient || !otpFlow) {
      setErrorMessage(setupMessage(supabaseSetupState, copy) || copy.auth.setupOnly);
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabaseClient.auth.verifyOtp({
        email: email.trim(),
        token,
        type: otpFlow === 'signup' ? 'email' : 'recovery',
      });
      if (error) {
        const nextAttempts = otpAttempts + 1;
        setOtpAttempts(nextAttempts);
        setErrorMessage(nextAttempts >= EMAIL_OTP_MAX_ATTEMPTS ? copy.auth.otpAttemptsLimit : otpErrorMessage(error, copy));
        return;
      }
      if (!data.user || !data.session) {
        setErrorMessage(copy.auth.errorGeneric);
        return;
      }

      setOtpCode('');
      if (otpFlow === 'recovery') {
        setPassword('');
        setConfirmPassword('');
        setAuthStep('new-password');
        return;
      }

      window.location.replace(returnPath);
    } catch (error) {
      setErrorMessage(error instanceof Error && 'status' in error
        ? authErrorMessage(error as AuthError, copy)
        : copy.auth.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  const resendOtp = async () => {
    setErrorMessage('');
    setNotice('');
    if (resendSeconds > 0 || submitting) return;
    if (!supabaseClient || !otpFlow) {
      setErrorMessage(setupMessage(supabaseSetupState, copy) || copy.auth.setupOnly);
      return;
    }

    setSubmitting(true);
    try {
      const { error } = otpFlow === 'signup'
        ? await supabaseClient.auth.resend({
            type: 'signup',
            email: email.trim(),
            options: { emailRedirectTo: new URL(`/auth/callback?next=${encodeURIComponent(returnPath)}`, window.location.origin).toString() },
          })
        : await supabaseClient.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: new URL(`/reset-password?next=${encodeURIComponent(returnPath)}`, window.location.origin).toString(),
          });
      if (error) throw error;
      setOtpCode('');
      setOtpAttempts(0);
      setResendAt(Date.now() + EMAIL_OTP_COOLDOWN_SECONDS * 1000);
      setNotice(copy.auth.otpResentBody);
    } catch (error) {
      setErrorMessage(error instanceof Error && 'status' in error
        ? authErrorMessage(error as AuthError, copy)
        : copy.auth.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  };

  const returnToEmailForm = () => {
    setAuthStep('form');
    setOtpFlow(null);
    setOtpCode('');
    setErrorMessage('');
    setNotice('');
  };

  const isFormMode = mode !== 'callback';
  const isRecoveryFormReady = mode === 'forgot-password' && authStep === 'new-password' && Boolean(user && recoverySession);
  const waitingForRecoverySession = mode === 'forgot-password' && authStep === 'new-password' && !isRecoveryFormReady;
  const showOtpForm = authStep === 'otp' && (mode === 'signup' || mode === 'forgot-password');
  const showCompletion = mode === 'forgot-password' && authStep === 'complete';
  const showPrimaryForm = isFormMode && !showOtpForm && !showCompletion && !waitingForRecoverySession
    && !(mode === 'reset-password' && (authLoading || !user || !recoverySession));
  const needsEmail = mode === 'login' || mode === 'signup' || (mode === 'forgot-password' && authStep === 'form');
  const needsPassword = mode === 'login' || mode === 'signup' || mode === 'reset-password' || isRecoveryFormReady;
  const needsName = mode === 'signup';
  const needsConfirmation = mode === 'signup' || mode === 'reset-password' || isRecoveryFormReady;
  const setupNotice = setupMessage(supabaseSetupState, copy);
  const submitLabel = submitting ? copy.auth.submitBusy : mode === 'login' ? copy.auth.signInAction
    : mode === 'signup' ? copy.auth.createAccountAction
      : mode === 'forgot-password' && authStep === 'new-password' ? copy.common.updatePassword
        : mode === 'forgot-password' ? copy.common.sendReset
        : copy.common.updatePassword;

  return (
    <div className={`app-shell student-page student-auth-page mabda-auth-page ${isArabic ? 'is-arabic' : 'is-english'}`} data-testid="auth-page">
      <AuthGatewayHeader locale={locale} onSwitchLocale={onSwitchLocale} />
      <main className="mabda-auth-main section-frame">
        <div className="mabda-auth-shell" dir="ltr">
          <AuthBrandHeader />
          <section className="mabda-auth-panel" dir={isArabic ? 'rtl' : 'ltr'} aria-labelledby="student-auth-title">
            <div className="mabda-auth-panel-head">
              <h1 id="student-auth-title">{title}</h1>
              <p>{body}</p>
            </div>

            {setupNotice && <p className="student-setup-notice" role="status">{setupNotice}</p>}
            {serviceError && <p className="student-form-error" role="alert">{copy.common.serviceError}</p>}
            {errorMessage && <p className="student-form-error" role="alert" aria-live="assertive">{errorMessage}</p>}
            {notice && <p className="student-form-success" role="status" aria-live="polite">{notice}</p>}

            {mode === 'callback' && (
              <div className="student-callback-state" role="status" aria-live="polite">
                {!authLoading && !callbackExpired && !user && <span className="student-loading-mark" aria-hidden="true" />}
                <p>{user ? copy.auth.callbackReady : callbackExpired ? copy.auth.callbackFailed : copy.auth.callbackBody}</p>
                {(callbackExpired || serviceError) && (
                  <a className="button button-primary" href="/login" onClick={internalAuthLink('/login')}>{copy.common.backToLogin}</a>
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
                <a className="button button-primary" href="/forgot-password" onClick={internalAuthLink('/forgot-password')}>{copy.auth.resetLink}</a>
              </div>
            )}

            {showOtpForm && (
              <form className="student-auth-form mabda-auth-form mabda-auth-otp-form" aria-busy={submitting} onSubmit={verifyOtp}>
                <div className="mabda-auth-field">
                  <label htmlFor="auth-email-otp">{copy.auth.otpCodeLabel}</label>
                  <input
                    ref={otpInputRef}
                    autoComplete="one-time-code"
                    dir="ltr"
                    id="auth-email-otp"
                    inputMode="numeric"
                    maxLength={6}
                    name="email-otp"
                    placeholder="000000"
                    required
                    aria-describedby="auth-email-otp-hint"
                    value={otpCode}
                    onChange={(event) => { setOtpCode(normalizeEmailOtp(event.target.value)); setErrorMessage(''); }}
                  />
                  <small id="auth-email-otp-hint">{copy.auth.otpCodeHint}</small>
                </div>
                <button className="button button-primary student-auth-submit" type="submit" disabled={submitting || authLoading || otpAttempts >= EMAIL_OTP_MAX_ATTEMPTS}>
                  <span className="student-submit-copy">{submitting ? copy.auth.submitBusy : copy.auth.verifyOtpAction}</span>
                  {submitting ? <span className="student-submit-spinner" aria-hidden="true" /> : <span className="student-submit-arrow" aria-hidden="true">{isArabic ? '←' : '→'}</span>}
                </button>
                <div className="student-auth-otp-actions">
                  <button className="student-auth-inline-button" type="button" onClick={() => { void resendOtp(); }} disabled={submitting || resendSeconds > 0}>
                    {resendSeconds > 0
                      ? copy.auth.resendIn.replace('{seconds}', new Intl.NumberFormat(isArabic ? 'ar' : 'en-US').format(resendSeconds))
                      : copy.auth.resendOtpAction}
                  </button>
                  <button className="student-auth-inline-button" type="button" onClick={returnToEmailForm} disabled={submitting}>
                    {copy.auth.changeOtpEmail}
                  </button>
                </div>
              </form>
            )}

            {waitingForRecoverySession && (
              <div className="student-callback-state" role="status" aria-live="polite">
                <span className="student-loading-mark" aria-hidden="true" />
                <p>{copy.common.loading}</p>
              </div>
            )}

            {showCompletion && (
              <div className="student-callback-state" role="status" aria-live="polite">
                <p>{copy.auth.passwordUpdated}</p>
                <a className="button button-primary" href={loginHref} onClick={internalAuthLink(loginHref)}>{copy.common.backToLogin}</a>
              </div>
            )}

            {showPrimaryForm && (
              <form
                className="student-auth-form mabda-auth-form"
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
                  <div className="mabda-auth-field">
                    <label htmlFor="auth-full-name">{copy.auth.fullName}</label>
                    <input
                      autoComplete="name"
                      dir="auto"
                      id="auth-full-name"
                      maxLength={80}
                      minLength={2}
                      name="display-name"
                      placeholder={copy.auth.fullNamePlaceholder}
                      required
                      value={displayName}
                      onChange={(event) => { setDisplayName(event.target.value); setErrorMessage(''); }}
                    />
                  </div>
                )}

                {needsEmail && (
                  <div className="mabda-auth-field">
                    <label htmlFor="auth-email">{copy.common.email}</label>
                    <input
                      autoComplete="email"
                      dir="ltr"
                      id="auth-email"
                      name="email"
                      placeholder={copy.common.emailPlaceholder}
                      required
                      type="email"
                      value={email}
                      onChange={(event) => { setEmail(event.target.value); setErrorMessage(''); }}
                    />
                  </div>
                )}

                {needsPassword && (
                  <div className="mabda-auth-field">
                    <label htmlFor="auth-password">{copy.common.password}</label>
                    <div className="mabda-auth-password" dir="ltr">
                      <input
                        autoComplete={mode === 'reset-password' || isRecoveryFormReady ? 'new-password' : mode === 'signup' ? 'new-password' : 'current-password'}
                        dir="ltr"
                        id="auth-password"
                        minLength={mode === 'login' ? undefined : 8}
                        name="password"
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => { setPassword(event.target.value); setErrorMessage(''); }}
                      />
                      <button className="student-password-toggle mabda-password-toggle" type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? copy.common.hidePassword : copy.common.showPassword} aria-pressed={showPassword}>
                        <span aria-hidden="true">{showPassword ? '◉' : '◎'}</span>
                      </button>
                    </div>
                    {(mode === 'signup' || mode === 'reset-password' || isRecoveryFormReady) && <small>{copy.common.minimumPassword}</small>}
                  </div>
                )}

                {needsConfirmation && (
                  <div className="mabda-auth-field">
                    <label htmlFor="auth-confirm-password">{copy.common.confirmPassword}</label>
                    <div className="mabda-auth-password" dir="ltr">
                      <input
                        autoComplete="new-password"
                        dir="ltr"
                        id="auth-confirm-password"
                        minLength={8}
                        name="confirm-password"
                        required
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(event) => { setConfirmPassword(event.target.value); setErrorMessage(''); }}
                      />
                      <button className="student-password-toggle mabda-password-toggle" type="button" onClick={() => setShowConfirmPassword((current) => !current)} aria-label={showConfirmPassword ? copy.common.hidePassword : copy.common.showPassword} aria-pressed={showConfirmPassword}>
                        <span aria-hidden="true">{showConfirmPassword ? '◉' : '◎'}</span>
                      </button>
                    </div>
                  </div>
                )}

                <button className="button button-primary student-auth-submit" type="submit" disabled={submitting || authLoading}>
                  <span className="student-submit-copy">{submitLabel}</span>
                  {submitting
                    ? <span className="student-submit-spinner" aria-hidden="true" />
                    : <span className="student-submit-arrow" aria-hidden="true">{isArabic ? '←' : '→'}</span>}
                </button>
              </form>
            )}

            <nav className="student-auth-links mabda-auth-links" aria-label={isArabic ? 'روابط الحساب' : 'Account links'}>
              {mode === 'login' && (
                <>
                  <a href={`/forgot-password?next=${encodeURIComponent(returnPath)}`} onClick={internalAuthLink(`/forgot-password?next=${encodeURIComponent(returnPath)}`)}>{copy.auth.forgotLink}</a>
                  <p>{copy.common.noAccount} <a href={signupHref} onClick={internalAuthLink(signupHref)}>{copy.auth.signupLink}</a></p>
                </>
              )}
              {mode === 'signup' && <p>{copy.common.haveAccount} <a href={loginHref} onClick={internalAuthLink(loginHref)}>{copy.auth.loginLink}</a></p>}
              {mode === 'forgot-password' && <a href={loginHref} onClick={internalAuthLink(loginHref)}>{copy.common.backToLogin}</a>}
              {mode === 'reset-password' && <a href={loginHref} onClick={internalAuthLink(loginHref)}>{copy.common.backToLogin}</a>}
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
    <div className={`app-shell student-page student-auth-page mabda-auth-page student-auth-gateway-page ${isArabic ? 'is-arabic' : 'is-english'}`}>
      <AuthGatewayHeader locale={locale} onSwitchLocale={onSwitchLocale} />
      <main className="mabda-auth-main section-frame">
        <div className="mabda-auth-shell mabda-auth-loading-shell">
          <AuthBrandHeader />
          <div className="student-auth-gateway-status" role="status" aria-live="polite">
            <span className="student-loading-mark" aria-hidden="true" />
            <h1 className="mabda-auth-loading-title">{copy.auth.gatewayLoading}</h1>
          </div>
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
          <p className="eyebrow"><span className="eyebrow-line" />Mabda / {pageTitle}</p>
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
          <p className="eyebrow"><span className="eyebrow-line" />Mabda / {copy.dashboard.eyebrow}</p>
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

function lessonCopy(locale: Locale, lessonId: FoundationLessonId) {
  return lessonId === 'html-introduction'
    ? messages[locale].lesson
    : getLearningLessonCopy(locale, lessonId);
}

function profilePathLanguage(pathId: (typeof FOUNDATION_PATH_IDS)[number]): ProgrammingLanguage {
  if (pathId === 'html-fundamentals') return 'html';
  if (pathId === 'css-fundamentals') return 'css';
  return 'javascript';
}

function profilePathName(pathId: (typeof FOUNDATION_PATH_IDS)[number]): string {
  if (pathId === 'html-fundamentals') return 'HTML';
  if (pathId === 'css-fundamentals') return 'CSS';
  return 'JavaScript';
}

function StudentDashboard({ locale, onSwitchLocale }: { locale: Locale; onSwitchLocale: () => void }) {
  return <LearningHomePage locale={locale} onSwitchLocale={onSwitchLocale} />;
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarState, setAvatarState] = useState<'idle' | 'saving' | 'saved' | 'cleanup-warning' | ProfileAvatarErrorCode | 'error'>('idle');
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const joined = user?.created_at
    ? new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en-US', { dateStyle: 'long' }).format(new Date(user.created_at))
    : '—';
  const verified = Boolean(user?.email_confirmed_at);
  const formattedNumber = new Intl.NumberFormat(locale === 'ar' ? 'ar' : 'en-US');
  const completedLessonCount = countCompletedFoundationLessons(progress.lessons);
  const milestoneProgress = Math.min(completedLessonCount, 5);
  const foundationPathProgress = FOUNDATION_PATH_IDS.map((pathId) => {
    const lessonSummaries = getLearningPathLessonSummaries(locale, pathId);
    const pathStarted = progress.paths.some((path) => path.path_id === pathId)
      || progress.lessons.some((lesson) => lesson.path_id === pathId);
    const summary = summarizeFoundationLearningProgress(pathId, progress.lessons, pathStarted);
    return {
      pathId,
      lessonSummaries,
      summary,
      state: getFoundationLearningState(summary),
      percentage: lessonSummaries.length
        ? Math.round((summary.completedLessonCount / lessonSummaries.length) * 100)
        : 0,
    };
  });
  const quizResults = [...progress.lessons]
    .filter((lesson) => lesson.quiz_score !== null && lesson.quiz_total !== null)
    .sort((a, b) => Date.parse(b.last_opened_at) - Date.parse(a.last_opened_at));

  useEffect(() => setNameInput(displayName), [displayName]);

  useEffect(() => {
    if (!avatarPreview) return undefined;
    return () => URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

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

  const selectAvatar = (file: File | undefined) => {
    if (!file) return;
    const fileError = getProfileAvatarFileError(file);
    if (fileError) {
      setAvatarState(fileError);
      setAvatarFile(null);
      setAvatarPreview(null);
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarState('idle');
  };

  const saveAvatar = async () => {
    if (!avatarFile || avatarState === 'saving') return;
    setAvatarState('saving');
    const result = await progress.updateAvatar(avatarFile);
    setAvatarState(result);
    if (result === 'saved' || result === 'cleanup-warning') {
      setAvatarFile(null);
      setAvatarPreview(null);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const avatarFeedback = avatarState === 'file-too-large' ? copy.profile.avatarTooLarge
    : avatarState === 'unsupported-type' ? copy.profile.avatarUnsupportedType
      : avatarState === 'invalid-image' ? copy.profile.avatarInvalidImage
        : avatarState === 'saving' ? copy.profile.avatarSaving
          : avatarState === 'saved' ? copy.profile.avatarSaved
            : avatarState === 'cleanup-warning' ? copy.profile.avatarCleanupWarning
              : avatarState === 'error' || avatarState === 'not-signed-in' || avatarState === 'upload-failed' || avatarState === 'profile-update-failed'
                ? copy.profile.avatarSaveFailed
                : '';

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
          <div className="student-profile-avatar-column">
            <StudentAvatar
              userId={user?.id ?? ''}
              avatarPath={progress.profile.avatar_path}
              updatedAt={progress.profile.updated_at}
              displayName={displayName}
              locale={locale}
              previewUrl={avatarPreview}
            />
            <div className="student-profile-avatar-actions">
              <strong>{copy.profile.avatarLabel}</strong>
              <p>{copy.profile.avatarDescription}</p>
              <input
                ref={avatarInputRef}
                className="student-profile-avatar-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                aria-label={copy.profile.avatarChoose}
                onChange={(event) => selectAvatar(event.currentTarget.files?.[0])}
              />
              <button className="button button-quiet" type="button" onClick={() => avatarInputRef.current?.click()} disabled={avatarState === 'saving'}>
                {progress.profile.avatar_path ? copy.profile.avatarReplace : copy.profile.avatarChoose}
              </button>
              {avatarFile && (
                <div className="student-profile-avatar-selection">
                  <button className="button button-primary" type="button" onClick={() => { void saveAvatar(); }} disabled={avatarState === 'saving'}>
                    {avatarState === 'saving' ? copy.profile.avatarSaving : copy.profile.avatarSave}
                  </button>
                  <button className="student-profile-avatar-cancel" type="button" onClick={() => {
                    setAvatarFile(null);
                    setAvatarPreview(null);
                    setAvatarState('idle');
                    if (avatarInputRef.current) avatarInputRef.current.value = '';
                  }} disabled={avatarState === 'saving'}>{copy.profile.avatarCancel}</button>
                </div>
              )}
              <small>{copy.profile.avatarTypeHelp}</small>
              {avatarFeedback && <p className={`student-profile-avatar-feedback ${avatarState === 'saved' ? 'is-success' : avatarState === 'cleanup-warning' ? 'is-warning' : avatarState === 'idle' ? '' : 'is-error'}`} role={avatarState === 'error' || avatarState === 'unsupported-type' || avatarState === 'file-too-large' || avatarState === 'invalid-image' || avatarState === 'upload-failed' || avatarState === 'profile-update-failed' || avatarState === 'not-signed-in' ? 'alert' : 'status'} aria-live="polite">{avatarFeedback}</p>}
            </div>
          </div>
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
            <div><dt>{copy.profile.emailVerified}</dt><dd><span className={`student-verification ${verified ? 'is-verified' : ''}`}>{verified ? copy.profile.verified : copy.profile.pending}</span></dd></div>
          </dl>
          <a className="button button-quiet" href="/dashboard">{copy.profile.backDashboard}<span aria-hidden="true">{isArabic ? '←' : '→'}</span></a>
        </section>
        <div className="student-profile-learning">
          <div className="student-profile-course-grid">
            {progress.loading && !progress.hasLoaded ? (
              <section className="student-profile-card" aria-live="polite" role="status">
                <p className="student-loading-state"><span className="student-loading-mark" aria-hidden="true" />{copy.common.loading}</p>
              </section>
            ) : foundationPathProgress.map(({ pathId, lessonSummaries, summary, state, percentage }) => {
              const pathName = profilePathName(pathId);
              const language = profilePathLanguage(pathId);
              const stateLabel = state === 'completed' ? copy.profile.pathCompleted
                : state === 'in-progress' ? copy.profile.inProgress
                  : state === 'getting-started' ? copy.profile.gettingStarted
                    : copy.profile.notStarted;
              const actionLabel = state === 'completed' ? copy.profile.reviewLessons
                : state === 'not-started' ? copy.profile.startLearning
                  : copy.profile.continueLearning;
              return (
                <section className="student-profile-card student-profile-course-card" key={pathId} aria-labelledby={`profile-progress-${pathId}`}>
                  <div className="student-profile-card-heading">
                    <h2 id={`profile-progress-${pathId}`}>
                      <ProgrammingLanguageLabel language={language} label={pathName}>{pathName}</ProgrammingLanguageLabel>
                    </h2>
                    <span className={`student-profile-learning-state is-${state}`}>{stateLabel}</span>
                  </div>
                  <p className="student-profile-learning-label">{copy.profile.learningStateLabel}</p>
                  <div
                    className="student-progress-track"
                    role="progressbar"
                    aria-label={`${pathName} — ${copy.profile.pathProgress}`}
                    aria-valuemin={0}
                    aria-valuemax={lessonSummaries.length}
                    aria-valuenow={summary.completedLessonCount}
                  >
                    <span style={{ width: `${percentage}%` }} />
                  </div>
                  <p className="student-profile-course-count" dir={isArabic ? 'rtl' : 'ltr'}>
                    {copy.progress.lessonCount
                      .replace('{completed}', formattedNumber.format(summary.completedLessonCount))
                      .replace('{total}', formattedNumber.format(lessonSummaries.length))}
                  </p>
                  <a className="button button-quiet student-profile-course-action" href={getLessonHref(summary.resumeLessonId)}>
                    {actionLabel}<span aria-hidden="true">{isArabic ? '←' : '→'}</span>
                  </a>
                  <details className="student-profile-course-details">
                    <summary>
                      <span>{copy.profile.browseLessons}</span>
                      <span>{formattedNumber.format(lessonSummaries.length)}</span>
                    </summary>
                    <ul className="student-profile-quiz-list">
                      {lessonSummaries.map((lesson) => {
                        const completed = summary.completedLessonIds.has(lesson.id);
                        return (
                          <li key={lesson.id}>
                            <span>
                              <a href={getLessonHref(lesson.id)}>{lesson.title}</a>
                              <small>{lesson.summary}</small>
                            </span>
                            <strong>{completed ? copy.profile.lessonCompleted : copy.profile.lessonNotCompleted}</strong>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                </section>
              );
            })}
          </div>

          <div className="student-profile-secondary-grid">
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
            <h2 id="profile-achievements-title">{copy.profile.milestoneFive}</h2>
            <div className="student-milestone-progress" role="progressbar" aria-label={copy.profile.milestoneFive} aria-valuemin={0} aria-valuemax={5} aria-valuenow={milestoneProgress} aria-valuetext={copy.profile.milestoneProgress(formattedNumber.format(milestoneProgress))}>
              <span style={{ width: `${(milestoneProgress / 5) * 100}%` }} />
            </div>
            <p>{completedLessonCount >= 5 ? copy.profile.milestoneReached : copy.profile.milestoneProgress(formattedNumber.format(milestoneProgress))}</p>
            <p className="student-profile-empty">{copy.profile.futureAchievementsNote}</p>
          </section>
          </div>
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
