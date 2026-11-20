import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { FOUNDATION_PATH_IDS, getPathForLesson, resolveVantaRoute, type FoundationPathId } from './content/learningSystem';
import { messages, type Locale } from './i18n/messages';
import { getStudentPortalCopy } from './i18n/studentPortal';
import { useAuth } from './auth/AuthProvider';
import { useStudentProgress } from './state/StudentProgressProvider';
import { hasSeenIntro, markIntroSeen } from './utils/introState';

const LearningLesson = lazy(() => import('./components/LearningLesson'));
const LearningSystemPage = lazy(() => import('./components/LearningSystemPage'));
const StartLesson = lazy(() => import('./components/StartLesson'));
const StudentIntroPage = lazy(() => import('./components/StudentIntroPage'));
const LearningHomePage = lazy(() => import('./components/LearningHomePage'));
const LearningLevelsPage = lazy(() => import('./components/LearningLevelsPage'));
const BeginnerCoursePage = lazy(() => import('./components/BeginnerCoursePage'));
const BeginnerLessonPage = lazy(() => import('./components/BeginnerLessonPage'));
const BeginnerPlacementPage = lazy(() => import('./components/BeginnerPlacementPage'));
const BeginnerAssessmentPage = lazy(() => import('./components/BeginnerAssessmentPage'));
const BeginnerProjectPage = lazy(() => import('./components/BeginnerProjectPage'));
const PathAssessmentPage = lazy(() => import('./components/PathAssessmentPage'));
const GuidedProjectsPage = lazy(() => import('./components/GuidedProjectsPage'));
const AuthGatewayLoadingPage = lazy(() => import('./components/StudentAccountPages').then((pages) => ({ default: pages.AuthGatewayLoadingPage })));
const ProtectedStudentArea = lazy(() => import('./components/StudentAccountPages').then((pages) => ({ default: pages.ProtectedStudentArea })));
const StudentAuthPage = lazy(() => import('./components/StudentAccountPages').then((pages) => ({ default: pages.StudentAuthPage })));

function RouteLoading({ locale }: { locale: Locale }) {
  return (
    <main className="app-shell app-route-loading" aria-busy="true">
      <p className="student-loading-state" role="status" aria-live="polite">
        <span className="student-loading-mark" aria-hidden="true" />
        {locale === 'ar' ? 'جارٍ تحميل الصفحة…' : 'Loading page…'}
      </p>
    </main>
  );
}

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
  const lessonPathCopy = route.kind === 'lesson' && route.lessonId !== 'html-introduction'
    ? copy.learningSystem.paths[getPathForLesson(route.lessonId)]
    : null;
  const auth = useAuth();
  const studentProgress = useStudentProgress();
  const routeTitle = route.kind === 'lesson'
    ? route.lessonId === 'html-introduction'
      ? copy.lesson.metaTitle
      : lessonPathCopy?.metaTitle ?? copy.metaTitle
      : route.kind === 'levels'
        ? `${studentCopy.appShell.levels} | Mabda`
      : route.kind === 'beginner-course'
        ? `${copy.learningSystem.paths[route.pathId].title} — ${isArabic ? 'المبتدئ' : 'Beginner'} | Mabda`
      : route.kind === 'placement-test'
        ? `${isArabic ? 'اختبار تحديد المستوى' : 'Placement check'} — ${copy.learningSystem.paths[route.pathId].title} | Mabda`
      : route.kind === 'beginner-lesson'
        ? `${copy.learningSystem.paths[route.pathId].title} | Mabda`
      : route.kind === 'beginner-project'
        ? `${copy.learningSystem.ui.projectsTitle} — ${copy.learningSystem.paths[route.pathId].title} | Mabda`
      : route.kind === 'learning-path'
        ? copy.learningSystem.paths[route.pathId].metaTitle
      : route.kind === 'path-assessment'
        ? `${copy.learningSystem.ui.finalAssessmentTitle} — ${copy.learningSystem.paths[route.pathId].title} | Mabda`
        : route.kind === 'guided-projects'
          ? `${copy.learningSystem.ui.projectsPageTitle} | Mabda`
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
      : lessonPathCopy?.metaDescription ?? copy.metaDescription
    : route.kind === 'levels'
      ? (isArabic ? 'استكشف مستويات HTML وCSS وJavaScript وحدد نقطة بداية مناسبة.' : 'Explore HTML, CSS, and JavaScript levels and choose a starting point.')
    : route.kind === 'beginner-course'
      ? (isArabic ? 'مستوى مبتدئ منظم مع تقدم محفوظ محليًا لهذه الجلسة.' : 'A structured beginner level with progress stored locally for this session.')
    : route.kind === 'placement-test'
      ? (isArabic ? 'اختبار تشخيصي اختياري يقترح نقطة بداية بناءً على المهارات.' : 'An optional diagnostic that recommends a starting point based on skills.')
    : route.kind === 'beginner-lesson'
      ? copy.learningSystem.paths[route.pathId].metaDescription
    : route.kind === 'beginner-project'
      ? (isArabic ? 'المشروع العملي الختامي لمستوى المبتدئ.' : 'The practical capstone project for Beginner.')
    : route.kind === 'learning-path'
      ? copy.learningSystem.paths[route.pathId].metaDescription
        : route.kind === 'path-assessment'
          ? copy.learningSystem.ui.finalAssessmentBody
          : route.kind === 'guided-projects'
            ? copy.learningSystem.ui.projectsPageIntro
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
  const withRouteLoading = (children: ReactNode) => (
    <Suspense fallback={<RouteLoading locale={locale} />}>
      {children}
    </Suspense>
  );


  if (route.kind === 'student-auth') {
    const introEligible = route.mode === 'login' || route.mode === 'signup' || route.mode === 'forgot-password';
    if (introEligible && auth.loading) {
      return withRouteLoading(<AuthGatewayLoadingPage locale={locale} onSwitchLocale={switchLocale} />);
    }
    if (introEligible && !auth.user && !introCompleted) {
      return withRouteLoading(
        <StudentIntroPage
          locale={locale}
          onSwitchLocale={switchLocale}
          onContinue={() => {
            markIntroSeen();
            setIntroCompleted(true);
          }}
        />,
      );
    }
    return withRouteLoading(<StudentAuthPage key={route.mode} locale={locale} onSwitchLocale={switchLocale} onNavigate={navigateAuth} mode={route.mode} />);
  }

  if (isAuthGatewayPending) {
    return withRouteLoading(<AuthGatewayLoadingPage locale={locale} onSwitchLocale={switchLocale} />);
  }

  if (isProtectedArea && !auth.user) {
    return withRouteLoading(<AuthGatewayLoadingPage locale={locale} onSwitchLocale={switchLocale} />);
  }

  if (route.kind === 'student-area') {
    return withRouteLoading(<ProtectedStudentArea locale={locale} onSwitchLocale={switchLocale} page={route.page} />);
  }

  if (route.kind === 'levels') {
    return withRouteLoading(<LearningLevelsPage locale={locale} onSwitchLocale={switchLocale} />);
  }

  if (route.kind === 'beginner-course') {
    return withRouteLoading(<BeginnerCoursePage pathId={route.pathId} locale={locale} onSwitchLocale={switchLocale} />);
  }

  if (route.kind === 'beginner-lesson') {
    return withRouteLoading(<BeginnerLessonPage pathId={route.pathId} lessonId={route.lessonId} locale={locale} onSwitchLocale={switchLocale} />);
  }

  if (route.kind === 'placement-test') {
    return withRouteLoading(<BeginnerPlacementPage pathId={route.pathId} locale={locale} onSwitchLocale={switchLocale} />);
  }

  if (route.kind === 'beginner-project') {
    return withRouteLoading(<BeginnerProjectPage pathId={route.pathId} locale={locale} onSwitchLocale={switchLocale} />);
  }

  if (route.kind === 'lesson') {
    if (route.lessonId === 'html-introduction') {
      return withRouteLoading(
        <StartLesson
          locale={locale}
          onSwitchLocale={switchLocale}
          onComplete={(score, total) => studentProgress.completeLessonQuiz('html-introduction', score, total)}
        />,
      );
    }
    return withRouteLoading(
      <LearningLesson
        lessonId={route.lessonId}
        locale={locale}
        onSwitchLocale={switchLocale}
        onComplete={(score, total) => studentProgress.completeLessonQuiz(route.lessonId, score, total)}
      />,
    );
  }

  if (route.kind === 'path-catalog' || route.kind === 'learning-path' || route.kind === 'not-found') {
    return withRouteLoading(<LearningSystemPage locale={locale} onSwitchLocale={switchLocale} route={route} />);
  }

  if (route.kind === 'path-assessment') {
    return withRouteLoading(
      new URLSearchParams(window.location.search).get('level') === 'beginner'
        ? <BeginnerAssessmentPage pathId={route.pathId} locale={locale} onSwitchLocale={switchLocale} />
        : <PathAssessmentPage pathId={route.pathId} locale={locale} onSwitchLocale={switchLocale} />,
    );
  }

  if (route.kind === 'guided-projects') {
    return withRouteLoading(<GuidedProjectsPage locale={locale} onSwitchLocale={switchLocale} />);
  }

  if (route.kind === 'landing') {
    return withRouteLoading(<LearningHomePage locale={locale} onSwitchLocale={switchLocale} />);
  }

  return null;
}

export default App;
