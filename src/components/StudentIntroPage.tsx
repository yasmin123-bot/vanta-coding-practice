import type { Locale } from '../i18n/messages';
import { messages } from '../i18n/messages';
import { getStudentPortalCopy } from '../i18n/studentPortal';
import AppIcon from './AppIcon';
import BrandLogo from './BrandLogo';
import ThemeToggle from './ThemeToggle';

type StudentIntroPageProps = {
  locale: Locale;
  onSwitchLocale: () => void;
  onContinue: () => void;
};

export default function StudentIntroPage({ locale, onSwitchLocale, onContinue }: StudentIntroPageProps) {
  const isArabic = locale === 'ar';
  const copy = getStudentPortalCopy(locale);

  return (
    <div className={`app-shell student-page mabda-intro-page ${isArabic ? 'is-arabic' : 'is-english'}`} data-testid="welcome-intro">
      <header className="mabda-auth-toolbar section-frame" dir="ltr" aria-label={copy.intro.preferencesLabel}>
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

      <main className="mabda-intro-main section-frame" dir={isArabic ? 'rtl' : 'ltr'}>
        <section className="mabda-intro-identity" aria-labelledby="mabda-intro-name">
          <BrandLogo variant="mark" decorative />
          <h1 className="mabda-auth-brand-name" id="mabda-intro-name" dir="ltr">
            Mabda <span aria-hidden="true">|</span> <b dir="rtl">مبدأ</b>
          </h1>
          <p className="mabda-auth-endorsement" dir="ltr">by VANTA</p>
          <p className="mabda-intro-tagline">{copy.intro.tagline}</p>
        </section>

        <footer className="mabda-intro-footer">
          <p className="mabda-intro-secondary">{copy.intro.secondaryTagline}</p>
          <button className="button button-primary mabda-intro-next" type="button" onClick={onContinue}>
            <span>{copy.intro.next}</span>
            <span aria-hidden="true" dir="ltr">{isArabic ? '←' : '→'}</span>
          </button>
        </footer>
      </main>
    </div>
  );
}
