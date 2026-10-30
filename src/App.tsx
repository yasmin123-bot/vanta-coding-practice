import { useEffect, useState } from 'react';
import { FOUNDATION_PATH_IDS, resolveVantaRoute, type FoundationPathId } from './content/learningSystem';
import { messages, type Locale } from './i18n/messages';
import { getStudentPortalCopy } from './i18n/studentPortal';
import { useAuth } from './auth/AuthProvider';
import LearningLesson from './components/LearningLesson';
import LearningSystemPage from './components/LearningSystemPage';
import StartLesson from './components/StartLesson';
import { AuthGatewayLoadingPage, ProtectedStudentArea, StudentAuthPage } from './components/StudentAccountPages';
import StudentIntroPage from './components/StudentIntroPage';
import { useStudentProgress } from './state/StudentProgressProvider';
import { hasSeenIntro, markIntroSeen } from './utils/introState';
import LearningHomePage from './components/LearningHomePage';
import { getLearningLessonCopy } from './i18n/foundationLessonCopy';

function readSavedLocale(): Locale {
  try {
    return window.localStorage.getItem('vanta-locale') === 'en' ? 'en' : 'ar';
  } catch {
    return 'ar';
  }
}

function App() {
  const [locale, setLocale] = useState<Locale>(readSavedLocale);
  const [introCompleted, setIntroCompleted] = useState(hasSeenIntro);
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const copy = messages[locale];
  const studentCopy = getStudentPortalCopy(locale);
  const isArabic = locale === 'ar';
  const route = resolveVantaRoute(currentPath);
  const lessonCopy = route.kind === 'lesson' && route.lessonId !== 'html-introduction'
    ? getLearningLessonCopy(locale, route.lessonId)
    : null;
  const auth = useAuth();
  const studentProgress = useStudentProgress();
  const routeTitle = route.kind === 'lesson'
    ? route.lessonId === 'html-introduction'
      ? copy.lesson.metaTitle
      : lessonCopy?.metaTitle ?? copy.metaTitle
    : route.kind === 'learning-path'
      ? copy.learningSystem.paths[route.pathId].metaTitle
      : route.kind === 'path-catalog'
        ? copy.learningSystem.catalog.metaTitle
        : route.kind === 'student-auth'
          ? route.mode === 'login' ? `${studentCopy.auth.loginTitle} | Mabda`
            : route.mode === 'signup' ? `${studentCopy.auth.signupTitle} | Mabda`
              : route.mode === 'forgot-password' ? `${studentCopy.auth.forgotTitle} | Mabda`
                : route.mode === 'reset-password' ? `${studentCopy.auth.resetTitle} | Mabda`
                  : `${studentCopy.auth.callbackTitle} | Mabda`
          : route.kind === 'student-area'
            ? `${route.page === 'dashboard' ? studentCopy.nav.dashboard : studentCopy.nav.profile} | Mabda`
            : route.kind === 'landing'
              ? `${studentCopy.common.home} | Mabda`
              : route.kind === 'not-found'
          ? copy.learningSystem.ui.notFoundTitle
          : copy.metaTitle;
  const routeDescription = route.kind === 'lesson'
    ? route.lessonId === 'html-introduction'
      ? copy.lesson.metaDescription
      : lessonCopy?.metaDescription ?? copy.metaDescription
    : route.kind === 'learning-path'
      ? copy.learningSystem.paths[route.pathId].metaDescription
        : route.kind === 'path-catalog'
          ? copy.learningSystem.catalog.metaDescription
          : route.kind === 'student-auth'
            ? route.mode === 'login' ? studentCopy.auth.loginBody
              : route.mode === 'signup' ? studentCopy.auth.signupBody
                : route.mode === 'forgot-password' ? studentCopy.auth.forgotBody
                  : route.mode === 'reset-password' ? studentCopy.auth.resetBody
                    : studentCopy.auth.callbackBody
            : route.kind === 'student-area'
              ? route.page === 'dashboard' ? studentCopy.dashboard.lead : studentCopy.profile.lead
              : route.kind === 'landing'
                ? studentCopy.home.heroBody
                : copy.metaDescription;
  const isProtectedArea = route.kind === 'student-area';
  const isAuthGatewayPending = isProtectedArea && (auth.loading || auth.signingOut);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.title = isAuthGatewayPending ? `${studentCopy.authVisual.brandLine} | Mabda` : routeTitle;
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      routeDescription,
    );

    try {
      window.localStorage.setItem('vanta-locale', locale);
    } catch {
      // The language switch still works for this session when storage is unavailable.
    }
  }, [isArabic, isAuthGatewayPending, locale, routeDescription, routeTitle, studentCopy.authVisual.brandLine]);

  useEffect(() => {
    const syncPath = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', syncPath);
    return () => window.removeEventListener('popstate', syncPath);
  }, []);

  useEffect(() => {
    if (!auth.user) return;
    if (route.kind === 'learning-path' && FOUNDATION_PATH_IDS.includes(route.pathId as FoundationPathId)) {
      void studentProgress.openPath(route.pathId as FoundationPathId);
    }
    if (route.kind === 'lesson') {
      void studentProgress.openLesson(route.lessonId);
    }
  }, [auth.user?.id, currentPath, studentProgress.openLesson, studentProgress.openPath]);

  useEffect(() => {
    if (auth.loading || auth.signingOut || !isProtectedArea) return;
    if (!auth.user) {
      const next = `?next=${encodeURIComponent(`${currentPath}${window.location.search}`)}`;
      window.location.replace(`/login${next}`);
      return;
    }
  }, [auth.loading, auth.signingOut, auth.user, currentPath, isProtectedArea]);

  const switchLocale = () => {
    setLocale((current) => (current === 'ar' ? 'en' : 'ar'));
  };

  const navigateAuth = (href: string) => {
    window.history.pushState({}, '', href);
    setCurrentPath(window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };


  if (route.kind === 'student-auth') {
    const introEligible = route.mode === 'login' || route.mode === 'signup' || route.mode === 'forgot-password';
    if (introEligible && auth.loading) {
      return <AuthGatewayLoadingPage locale={locale} onSwitchLocale={switchLocale} />;
    }
    if (introEligible && !auth.user && !introCompleted) {
      return (
        <StudentIntroPage
          locale={locale}
          onSwitchLocale={switchLocale}
          onContinue={() => {
            markIntroSeen();
            setIntroCompleted(true);
          }}
        />
      );
    }
    return <StudentAuthPage key={route.mode} locale={locale} onSwitchLocale={switchLocale} onNavigate={navigateAuth} mode={route.mode} />;
  }

  if (isAuthGatewayPending) {
    return <AuthGatewayLoadingPage locale={locale} onSwitchLocale={switchLocale} />;
  }

  if (isProtectedArea && !auth.user) {
    return <AuthGatewayLoadingPage locale={locale} onSwitchLocale={switchLocale} />;
  }

  if (route.kind === 'student-area') {
    return <ProtectedStudentArea locale={locale} onSwitchLocale={switchLocale} page={route.page} />;
  }

  if (route.kind === 'lesson') {
    if (route.lessonId === 'html-introduction') {
      return (
        <StartLesson
          locale={locale}
          onSwitchLocale={switchLocale}
          onComplete={(score, total) => studentProgress.completeLessonQuiz('html-introduction', score, total)}
        />
      );
    }
    return (
      <LearningLesson
        lessonId={route.lessonId}
        locale={locale}
        onSwitchLocale={switchLocale}
        onComplete={(score, total) => studentProgress.completeLessonQuiz(route.lessonId, score, total)}
      />
    );
  }

  if (route.kind === 'path-catalog' || route.kind === 'learning-path' || route.kind === 'not-found') {
    return <LearningSystemPage locale={locale} onSwitchLocale={switchLocale} route={route} />;
  }

  if (route.kind === 'landing') {
    return <LearningHomePage locale={locale} onSwitchLocale={switchLocale} />;
  }

  return null;
}

export default App;
