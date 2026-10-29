import { useEffect, useRef, useState } from 'react';
import { resolveVantaRoute } from './content/learningSystem';
import { messages, type Locale } from './i18n/messages';
import { getStudentPortalCopy } from './i18n/studentPortal';
import { useAuth } from './auth/AuthProvider';
import LearningLesson from './components/LearningLesson';
import LearningSystemPage from './components/LearningSystemPage';
import StartLesson from './components/StartLesson';
import { AuthGatewayLoadingPage, ProtectedStudentArea, StudentAuthPage } from './components/StudentAccountPages';
import StudentNavActions from './components/StudentNavActions';
import { useStudentProgress } from './state/StudentProgressProvider';

function readSavedLocale(): Locale {
  try {
    return window.localStorage.getItem('vanta-locale') === 'en' ? 'en' : 'ar';
  } catch {
    return 'ar';
  }
}

function App() {
  const [locale, setLocale] = useState<Locale>(readSavedLocale);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroLogoRef = useRef<HTMLDivElement>(null);
  const coreIdeaRef = useRef<HTMLElement>(null);
  const journeyRef = useRef<HTMLElement>(null);
  const copy = messages[locale];
  const studentCopy = getStudentPortalCopy(locale);
  const isArabic = locale === 'ar';
  const currentPath = window.location.pathname;
  const route = resolveVantaRoute(currentPath);
  const auth = useAuth();
  const studentProgress = useStudentProgress();
  const routeTitle = route.kind === 'lesson'
    ? route.lessonId === 'html-introduction'
      ? copy.lesson.metaTitle
      : copy.learningSystem.lessons[route.lessonId].metaTitle
    : route.kind === 'learning-path'
      ? copy.learningSystem.paths[route.pathId].metaTitle
      : route.kind === 'path-catalog'
        ? copy.learningSystem.catalog.metaTitle
        : route.kind === 'student-auth'
          ? route.mode === 'login' ? `${studentCopy.auth.loginTitle} | VANTA`
            : route.mode === 'signup' ? `${studentCopy.auth.signupTitle} | VANTA`
              : route.mode === 'forgot-password' ? `${studentCopy.auth.forgotTitle} | VANTA`
                : route.mode === 'reset-password' ? `${studentCopy.auth.resetTitle} | VANTA`
                  : `${studentCopy.auth.callbackTitle} | VANTA`
          : route.kind === 'student-area'
            ? `${route.page === 'dashboard' ? studentCopy.nav.dashboard : studentCopy.nav.profile} | VANTA`
            : route.kind === 'not-found'
          ? copy.learningSystem.ui.notFoundTitle
          : copy.metaTitle;
  const routeDescription = route.kind === 'lesson'
    ? route.lessonId === 'html-introduction'
      ? copy.lesson.metaDescription
      : copy.learningSystem.lessons[route.lessonId].metaDescription
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
              : copy.metaDescription;
  const isProtectedArea = route.kind === 'student-area';
  const isAuthGatewayPending = isProtectedArea && auth.loading;

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.title = isAuthGatewayPending ? `${studentCopy.authVisual.brandLine} | VANTA` : routeTitle;
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
    if (!auth.user) return;
    if (route.kind === 'learning-path' && route.pathId === 'html-fundamentals') {
      void studentProgress.openPath('html-fundamentals');
    }
    if (route.kind === 'lesson') {
      void studentProgress.openLesson(route.lessonId);
    }
  }, [auth.user?.id, currentPath, studentProgress.openLesson, studentProgress.openPath]);

  useEffect(() => {
    if (auth.loading || !isProtectedArea) return;
    if (!auth.user) {
      const next = `?next=${encodeURIComponent(`${currentPath}${window.location.search}`)}`;
      window.location.replace(`/login${next}`);
      return;
    }
  }, [auth.loading, auth.user, currentPath, isProtectedArea]);

  useEffect(() => {
    const logo = heroLogoRef.current;
    if (!logo) return;

    let revealFrame = window.requestAnimationFrame(() => {
      logo.classList.add('is-revealed');
    });
    let scrollFrame = 0;
    let isAwayFromTop = window.scrollY > 48;
    logo.classList.toggle('is-scrolled', isAwayFromTop);

    const syncScrollState = () => {
      if (scrollFrame !== 0) return;

      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        const nextAwayState = window.scrollY > 48;
        if (nextAwayState !== isAwayFromTop) {
          logo.classList.toggle('is-scrolled', nextAwayState);
          isAwayFromTop = nextAwayState;
        }
      });
    };

    window.addEventListener('scroll', syncScrollState, { passive: true });
    return () => {
      window.removeEventListener('scroll', syncScrollState);
      window.cancelAnimationFrame(revealFrame);
      if (scrollFrame !== 0) window.cancelAnimationFrame(scrollFrame);
    };
  }, []);

  useEffect(() => {
    const section = coreIdeaRef.current;
    if (!section) return;

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof IntersectionObserver === 'undefined'
    ) {
      section.classList.add('is-visible');
      return;
    }

    section.classList.add('is-pending');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        section.classList.remove('is-pending');
        section.classList.add('is-visible');
        observer.unobserve(section);
      },
      { threshold: 0.16, rootMargin: '0px 0px -6% 0px' },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = journeyRef.current;
    if (!section) return;

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof IntersectionObserver === 'undefined'
    ) {
      section.classList.add('is-visible');
      return;
    }

    section.classList.add('is-pending');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        section.classList.remove('is-pending');
        section.classList.add('is-visible');
        observer.unobserve(section);
      },
      { threshold: 0.16, rootMargin: '0px 0px -6% 0px' },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const switchLocale = () => {
    setLocale((current) => (current === 'ar' ? 'en' : 'ar'));
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  if (route.kind === 'student-auth') {
    return <StudentAuthPage locale={locale} onSwitchLocale={switchLocale} mode={route.mode} />;
  }

  if (isAuthGatewayPending) {
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

  return (
    <div className={`app-shell ${isArabic ? 'is-arabic' : 'is-english'}`}>
      <header className="site-header">
        <a className="brand-link" href="#top" onClick={closeMenu} aria-label="VANTA — Create Beyond">
          <img src="/brand/vanta-logo.png" alt="VANTA — Create Beyond" />
        </a>

        <button
          className="mobile-menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? copy.nav.closeMenu : copy.nav.menu}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
        </button>

        <nav
          className={`primary-navigation ${menuOpen ? 'is-open' : ''}`}
          id="primary-navigation"
          aria-label={isArabic ? 'التنقل الرئيسي' : 'Main navigation'}
        >
          <a href="#vision" onClick={closeMenu}>{copy.nav.vision}</a>
          <a href="#journey" onClick={closeMenu}>{copy.nav.journey}</a>
          <a href="#platform" onClick={closeMenu}>{copy.nav.platform}</a>
          <a href="#about" onClick={closeMenu}>{copy.nav.about}</a>
          <StudentNavActions locale={locale} onNavigate={closeMenu} />
        </nav>

        <button
          className="language-toggle"
          type="button"
          onClick={switchLocale}
          aria-label={copy.nav.switchLanguage}
        >
          <span className="language-toggle-mark" aria-hidden="true">文</span>
          <span>{isArabic ? 'EN' : 'عربي'}</span>
        </button>
      </header>

      <main id="top">
        <section className="hero section-frame" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow"><span className="eyebrow-line" />{copy.hero.eyebrow}</p>
            <h1 id="hero-title" className="hero-title">
              <span>{copy.hero.titleFirst}</span>
              <span className="accent-text">{copy.hero.titleAccent}</span>
            </h1>
            <p className="hero-description">{copy.hero.description}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#journey">
                <span>{copy.hero.primaryAction}</span>
                <span className="button-arrow" aria-hidden="true">↗</span>
              </a>
              <a className="button button-quiet" href="#vision">{copy.hero.secondaryAction}</a>
            </div>
            <p className="hero-note"><span className="note-mark" aria-hidden="true">✦</span>{copy.hero.note}</p>
          </div>

          <div className="hero-visual">
            <div
              ref={heroLogoRef}
              className="hero-brand-lockup"
              role="img"
              aria-label="VANTA — Create Beyond>"
            >
              <img
                className="hero-brand-emblem"
                src="/brand/vanta-emblem.png"
                alt=""
                aria-hidden="true"
                width={145}
                height={121}
                draggable={false}
              />
              <img
                className="hero-brand-wordmark"
                src="/brand/vanta-wordmark.png"
                alt=""
                aria-hidden="true"
                width={287}
                height={72}
                draggable={false}
              />
            </div>
          </div>
        </section>

        <section
          ref={coreIdeaRef}
          className="core-idea-section section-frame"
          id="approach"
          aria-labelledby="core-idea-title"
        >
          <div className="core-idea-copy">
            <p className="eyebrow"><span className="eyebrow-line" />{copy.coreIdea.eyebrow}</p>
            <h2 id="core-idea-title" className="core-idea-title">{copy.coreIdea.title}</h2>
            <p className="core-idea-description">{copy.coreIdea.description}</p>
            <div className="core-idea-roadmap">
              <span className="core-idea-roadmap-label">{copy.coreIdea.visionLabel}</span>
              <p>{copy.coreIdea.roadmapNote}</p>
            </div>
          </div>

          <div className="learning-model" role="group" aria-labelledby="learning-loop-title">
            <div className="learning-model-header">
              <h3 id="learning-loop-title" className="learning-model-title">{copy.coreIdea.loopLabel}</h3>
              <span className="learning-model-code" aria-hidden="true">V / 01</span>
            </div>
            <ol className="learning-steps">
              {copy.coreIdea.steps.map((step, index) => (
                <li className="learning-step" key={step.title}>
                  <span className="learning-step-number" aria-hidden="true">0{index + 1}</span>
                  <div className="learning-step-copy">
                    <h4>{step.title}</h4>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="learning-structure">
              <p className="learning-structure-label">{copy.coreIdea.structureLabel}</p>
              <ul className="learning-structure-list">
                {copy.coreIdea.structure.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section
          ref={journeyRef}
          className="journey-section section-frame"
          id="journey"
          aria-labelledby="journey-title"
        >
          <div className="section-heading">
            <p className="eyebrow"><span className="eyebrow-line" />{copy.journey.eyebrow}</p>
            <h2 id="journey-title">{copy.journey.title}</h2>
            <p className="section-description">{copy.journey.description}</p>
            <p className="journey-roadmap-note">
              <span className="note-mark" aria-hidden="true">✦</span>
              {copy.journey.roadmapNote}
            </p>
            <a className="journey-catalog-link" href="/paths">
              {copy.journey.pathCatalogAction}<span aria-hidden="true"> {isArabic ? '←' : '→'}</span>
            </a>
          </div>
          <ol className="journey-list">
            {copy.journey.steps.map((step, index) => {
              const stageHref = index === 0
                ? '/lesson/start'
                : index === 1
                  ? '/paths/html-fundamentals'
                  : null;
              const stageContent = (
                <>
                  <span className="step-number" aria-hidden="true">0{index + 1}</span>
                  <div className="journey-step-copy">
                    <p className="journey-step-level">{step.level}</p>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                    <span className={`journey-step-status ${stageHref ? 'is-available' : 'is-future'}`}>
                      {stageHref ? copy.journey.availableStatus : copy.journey.futureStatus}
                    </span>
                  </div>
                </>
              );

              return (
                <li className={`journey-step ${stageHref ? 'journey-step-is-link' : ''}`} key={step.title}>
                  {stageHref ? (
                    <a className="journey-stage-link" href={stageHref}>
                      {stageContent}
                    </a>
                  ) : stageContent}
                </li>
              );
            })}
          </ol>
        </section>

        <section className="vision-section section-frame" id="vision" aria-labelledby="vision-title">
          <div className="vision-intro">
            <p className="eyebrow"><span className="eyebrow-line" />{copy.vision.eyebrow}</p>
            <h2 id="vision-title">{copy.vision.title}</h2>
            <p className="section-description">{copy.vision.description}</p>
          </div>
          <div className="principle-list">
            {copy.vision.principles.map((principle, index) => (
              <article className="principle-card" key={principle.title}>
                <span className="principle-index">0{index + 1}</span>
                <div>
                  <h3>{principle.title}</h3>
                  <p>{principle.body}</p>
                </div>
                <span className="principle-mark" aria-hidden="true">↗</span>
              </article>
            ))}
          </div>
        </section>

        <section className="platform-section section-frame" id="platform" aria-labelledby="platform-title">
          <div className="section-heading platform-heading">
            <p className="eyebrow"><span className="eyebrow-line" />{copy.platform.eyebrow}</p>
            <h2 id="platform-title">{copy.platform.title}</h2>
            <p className="section-description">{copy.platform.description}</p>
          </div>
          <div className="platform-grid">
            {copy.platform.cards.map((card, index) => (
              <article className="platform-card" key={card.title}>
                <div className="platform-card-top">
                  <span className="platform-number">0{index + 1}</span>
                  <span className="roadmap-status">{copy.platform.status}</span>
                </div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <span className="platform-rule" aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        <section className="about-section section-frame" id="about" aria-labelledby="about-title">
          <div className="about-stamp" aria-hidden="true">
            <img src="/brand/vanta-logo.png" alt="" />
          </div>
          <div className="about-copy">
            <p className="eyebrow"><span className="eyebrow-line" />{copy.about.eyebrow}</p>
            <h2 id="about-title">{copy.about.title}</h2>
            <p className="section-description">{copy.about.description}</p>
            <p className="about-quote">{copy.about.quote}</p>
          </div>
        </section>

        <section className="closing-section section-frame" aria-labelledby="closing-title">
          <p className="eyebrow"><span className="eyebrow-line" />{copy.closing.eyebrow}</p>
          <h2 id="closing-title">{copy.closing.title}</h2>
          <p>{copy.closing.description}</p>
          <a className="button button-primary" href="#top">
            <span>{copy.closing.action}</span>
            <span className="button-arrow" aria-hidden="true">↑</span>
          </a>
        </section>
      </main>

      <footer className="site-footer section-frame">
        <div className="footer-brand">
          <img src="/brand/vanta-logo.png" alt="VANTA — Create Beyond" />
          <span>{copy.footer.tagline}</span>
        </div>
        <p>{copy.footer.copyright}</p>
        <a href="#top">{copy.footer.backToTop}<span aria-hidden="true"> ↑</span></a>
      </footer>
    </div>
  );
}

export default App;
