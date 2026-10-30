import { useEffect, useRef } from 'react';
import { LEARNING_PATHS, getLearningPathHref, type LearningPathId } from '../content/learningSystem';
import { messages, type Locale } from '../i18n/messages';
import { getStudentPortalCopy } from '../i18n/studentPortal';
import { useAuth } from '../auth/AuthProvider';
import { getStudentProgressName, useStudentProgress } from '../state/StudentProgressProvider';
import { useAppNavigation } from '../state/AppNavigationProvider';
import AppIcon from './AppIcon';
import BrandLogo from './BrandLogo';
import ProgrammingLanguageLabel from './ProgrammingLanguageLabel';
import StudentNavActions from './StudentNavActions';
import ThemeToggle from './ThemeToggle';
import StudentAvatar from './StudentAvatar';

type LearningHeaderProps = {
  locale: Locale;
  onSwitchLocale: () => void;
  allPathsLabel: string;
  stageLabel?: string;
};

const primaryPathDefinitions: Array<{ id: LearningPathId; language: 'html' | 'css' | 'javascript' }> = [
  { id: 'html-fundamentals', language: 'html' },
  { id: 'css-fundamentals', language: 'css' },
  { id: 'javascript-fundamentals', language: 'javascript' },
];

function LearningHeader({ locale, onSwitchLocale, allPathsLabel, stageLabel }: LearningHeaderProps) {
  const isArabic = locale === 'ar';
  const portalCopy = getStudentPortalCopy(locale);
  const learningCopy = messages[locale].learningSystem;
  const { user } = useAuth();
  const studentProgress = useStudentProgress();
  const { menuOpen, openMenu, closeMenu, toggleMenu } = useAppNavigation();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const path = window.location.pathname;
  const search = window.location.search;
  const homeHref = user ? '/dashboard' : '/';
  const profileHref = user ? '/profile' : '/login?next=%2Fprofile';
  const practiceHref = '/lesson/start?view=practice';
  const isHomeActive = path === '/' || path === '/dashboard';
  const isPathsActive = path === '/paths' || path.startsWith('/paths/');
  const isPracticeActive = path.startsWith('/lesson/') && new URLSearchParams(search).get('view') === 'practice';
  const isProfileActive = path === '/profile';
  const pathItems = primaryPathDefinitions.flatMap((definition) => {
    const item = LEARNING_PATHS.find((candidate) => candidate.id === definition.id);
    return item ? [{ ...definition, item }] : [];
  });

  useEffect(() => {
    if (!menuOpen) return undefined;
    const priorFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const focusableElements = () => Array.from(
      drawerRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [],
    ).filter((element) => element.getAttribute('aria-hidden') !== 'true');

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = focusableElements();
      if (!focusable.length) {
        event.preventDefault();
        drawerRef.current?.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = priorOverflow;
      const returnTarget = menuButtonRef.current ?? priorFocus;
      if (returnTarget?.isConnected) returnTarget.focus();
    };
  }, [closeMenu, menuOpen]);

  const closeAfterNavigation = () => closeMenu();

  return (
    <>
      <header className="mabda-app-header" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="mabda-app-header-inner">
          <a className="mabda-app-brand" href={homeHref} aria-label="Mabda — مبدأ, by VANTA">
            <BrandLogo variant="mark" decorative />
            <span className="mabda-app-brand-copy">
              <span className="mabda-app-brand-name" dir="ltr">Mabda <i aria-hidden="true">|</i> <b dir="rtl">مبدأ</b></span>
              <span className="mabda-app-brand-byline" dir="ltr">by VANTA</span>
            </span>
          </a>
          {stageLabel && <div className="mabda-app-header-context" dir="auto">{stageLabel}</div>}
          {user && <a className="mabda-app-avatar-link" href="/profile" aria-label={portalCopy.nav.profile}>
            <StudentAvatar
              userId={user.id}
              avatarPath={studentProgress.profile.avatar_path}
              updatedAt={studentProgress.profile.updated_at}
              displayName={getStudentProgressName(user, studentProgress.profile.display_name)}
              locale={locale}
              size="header"
              decorative
            />
          </a>}
          <button
            ref={menuButtonRef}
            className="mabda-app-menu-trigger"
            type="button"
            aria-label={portalCopy.appShell.openMenu}
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? 'mabda-app-navigation-dialog' : undefined}
            onClick={toggleMenu}
          >
            <AppIcon name="menu" size={21} />
            <span>{portalCopy.appShell.more}</span>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          className="mabda-app-drawer-layer"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeMenu();
          }}
        >
          <aside
            className="mabda-app-drawer"
            id="mabda-app-navigation-dialog"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mabda-app-drawer-title"
            dir={isArabic ? 'rtl' : 'ltr'}
            tabIndex={-1}
          >
            <div className="mabda-app-drawer-heading">
              <div>
                <p className="mabda-app-drawer-kicker">Mabda · by VANTA</p>
                <h2 id="mabda-app-drawer-title">{portalCopy.appShell.menuTitle}</h2>
              </div>
              <button
                ref={closeButtonRef}
                className="mabda-app-icon-button"
                type="button"
                aria-label={portalCopy.appShell.closeMenu}
                onClick={closeMenu}
              >
                <AppIcon name="close" size={20} />
              </button>
            </div>

            <nav className="mabda-app-drawer-nav" aria-label={portalCopy.appShell.primaryNavigation}>
              <a className="mabda-app-drawer-link" href={homeHref} aria-current={isHomeActive ? 'page' : undefined} onClick={closeAfterNavigation}>
                <AppIcon name="home" /><span>{portalCopy.common.home}</span>
              </a>
              <a className="mabda-app-drawer-link" href="/paths" aria-current={isPathsActive ? 'page' : undefined} onClick={closeAfterNavigation}>
                <AppIcon name="paths" /><span>{allPathsLabel}</span>
              </a>
              <a className="mabda-app-drawer-link" href={practiceHref} aria-current={isPracticeActive ? 'page' : undefined} onClick={closeAfterNavigation}>
                <AppIcon name="practice" /><span>{portalCopy.appShell.practice}</span>
              </a>
              <a className="mabda-app-drawer-link" href={profileHref} aria-current={isProfileActive ? 'page' : undefined} onClick={closeAfterNavigation}>
                <AppIcon name="profile" /><span>{portalCopy.nav.profile}</span>
              </a>
            </nav>

            <section className="mabda-app-drawer-section" aria-labelledby="mabda-app-paths-title">
              <h3 id="mabda-app-paths-title">{portalCopy.appShell.learningPaths}</h3>
              <ul className="mabda-app-drawer-paths">
                {pathItems.map(({ id, language, item }) => {
                  const pathCopy = learningCopy.paths[id];
                  const available = item.status === 'available';
                  const status = available ? learningCopy.ui.available : learningCopy.ui.planned;
                  const href = getLearningPathHref(id);
                  return (
                    <li key={id}>
                      <a href={href} aria-current={path === href ? 'page' : undefined} onClick={closeAfterNavigation}>
                        <ProgrammingLanguageLabel language={language} label={pathCopy.title}>{pathCopy.title}</ProgrammingLanguageLabel>
                        <span className={`mabda-app-path-status ${available ? 'is-available' : 'is-planned'}`}>{status}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
              <a className="mabda-app-quiz-link" href={getLearningPathHref('html-fundamentals')} onClick={closeAfterNavigation}>
                <AppIcon name="quiz" size={19} />
                <span><strong>{portalCopy.appShell.quizzes}</strong><small>{portalCopy.appShell.quizNote}</small></span>
                <AppIcon className="mabda-app-chevron" name="arrow" size={17} />
              </a>
            </section>

            <section className="mabda-app-future-links" aria-label={portalCopy.appShell.comingSoon}>
              <div className="mabda-app-future-link" aria-disabled="true">
                <AppIcon name="challenge" /><span>{portalCopy.appShell.challenges}</span><small>{portalCopy.appShell.comingSoon}</small>
              </div>
              <div className="mabda-app-future-link" aria-disabled="true">
                <AppIcon name="project" /><span>{portalCopy.appShell.projects}</span><small>{portalCopy.appShell.comingSoon}</small>
              </div>
            </section>

            <section className="mabda-app-preferences" aria-labelledby="mabda-app-preferences-title">
              <h3 id="mabda-app-preferences-title">{portalCopy.appShell.preferences}</h3>
              <div className="mabda-app-preference-row">
                <span><AppIcon name="language" size={18} />{portalCopy.appShell.language}</span>
                <button className="mabda-app-language-choice" type="button" onClick={onSwitchLocale}>
                  {isArabic ? 'English' : 'العربية'}
                </button>
              </div>
              <div className="mabda-app-preference-row">
                <span><AppIcon name="settings" size={18} />{portalCopy.appShell.appearance}</span>
                <ThemeToggle locale={locale} />
              </div>
            </section>

            <section className="mabda-app-account" aria-labelledby="mabda-app-account-title">
              <h3 id="mabda-app-account-title">{portalCopy.appShell.account}</h3>
              <StudentNavActions locale={locale} compact onNavigate={closeAfterNavigation} />
            </section>
          </aside>
        </div>
      )}

      <nav className="mabda-mobile-nav" aria-label={portalCopy.appShell.bottomNavigation} dir={isArabic ? 'rtl' : 'ltr'}>
        <a className="mabda-mobile-nav-item" href={homeHref} aria-current={isHomeActive ? 'page' : undefined}>
          <AppIcon name="home" /><span>{portalCopy.common.home}</span>
        </a>
        <a className="mabda-mobile-nav-item" href="/paths" aria-current={isPathsActive ? 'page' : undefined}>
          <AppIcon name="paths" /><span>{allPathsLabel}</span>
        </a>
        <a className="mabda-mobile-nav-item" href={practiceHref} aria-current={isPracticeActive ? 'page' : undefined}>
          <AppIcon name="practice" /><span>{portalCopy.appShell.practice}</span>
        </a>
        <a className="mabda-mobile-nav-item" href={profileHref} aria-current={isProfileActive ? 'page' : undefined}>
          <AppIcon name="profile" /><span>{portalCopy.nav.profile}</span>
        </a>
        <button className="mabda-mobile-nav-item" type="button" aria-expanded={menuOpen} aria-controls={menuOpen ? 'mabda-app-navigation-dialog' : undefined} onClick={openMenu}>
          <AppIcon name="more" /><span>{portalCopy.appShell.more}</span>
        </button>
      </nav>
    </>
  );
}

export default LearningHeader;
