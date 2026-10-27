import { useEffect, useState } from 'react';
import { messages, type Locale } from './i18n/messages';

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
  const copy = messages[locale];
  const isArabic = locale === 'ar';

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.title = copy.metaTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy.metaDescription);

    try {
      window.localStorage.setItem('vanta-locale', locale);
    } catch {
      // The language switch still works for this session when storage is unavailable.
    }
  }, [isArabic, locale]);

  const switchLocale = () => {
    setLocale((current) => (current === 'ar' ? 'en' : 'ar'));
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

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

          <aside className="hero-visual" aria-label={isArabic ? 'رسم توضيحي لفلسفة التعلّم في VANTA' : 'Illustration of the VANTA learning philosophy'}>
            <div className="visual-corner visual-corner-top" aria-hidden="true" />
            <div className="visual-corner visual-corner-bottom" aria-hidden="true" />
            <div className="visual-orbit orbit-one" aria-hidden="true" />
            <div className="visual-orbit orbit-two" aria-hidden="true" />
            <div className="visual-core">
              <span className="visual-index">01 / 06</span>
              <img className="visual-logo" src="/brand/vanta-logo.png" alt="" />
              <span className="visual-core-label">{copy.hero.visualLabel}</span>
            </div>
            <div className="visual-copy-card">
              <span className="visual-kicker">{copy.hero.visualLabel}</span>
              <h2>{copy.hero.visualTitle}</h2>
              <p>{copy.hero.visualBody}</p>
              <div className="visual-card-footer">
                <span className="signal-dot" aria-hidden="true" />
                <span>{copy.hero.visualFoot}</span>
              </div>
            </div>
            <span className="visual-coordinate coordinate-one" aria-hidden="true">V / 001</span>
            <span className="visual-coordinate coordinate-two" aria-hidden="true">LEARN — BUILD</span>
          </aside>
        </section>

        <section className="journey-section section-frame" id="journey" aria-labelledby="journey-title">
          <div className="section-heading">
            <p className="eyebrow"><span className="eyebrow-line" />{copy.journey.eyebrow}</p>
            <h2 id="journey-title">{copy.journey.title}</h2>
            <p className="section-description">{copy.journey.description}</p>
          </div>
          <ol className="journey-list">
            {copy.journey.steps.map((step, index) => (
              <li className="journey-step" key={step.title}>
                <span className="step-number">0{index + 1}</span>
                <span className="step-connector" aria-hidden="true" />
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
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
