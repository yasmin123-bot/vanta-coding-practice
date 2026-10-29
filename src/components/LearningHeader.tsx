import { messages, type Locale } from '../i18n/messages';
import { useAuth } from '../auth/AuthProvider';
import StudentNavActions from './StudentNavActions';

type LearningHeaderProps = {
  locale: Locale;
  onSwitchLocale: () => void;
  allPathsLabel: string;
  stageLabel?: string;
};

function LearningHeader({
  locale,
  onSwitchLocale,
  allPathsLabel,
  stageLabel,
}: LearningHeaderProps) {
  const isArabic = locale === 'ar';
  const copy = messages[locale];
  const { user } = useAuth();

  return (
    <header className="site-header learning-system-header section-frame">
      <a className="brand-link" href={user ? '/dashboard' : '/'} aria-label="VANTA — Create Beyond">
        <img className="learning-brand-emblem" src="/brand/vanta-emblem.png" alt="" aria-hidden="true" width={145} height={121} />
        <img className="learning-brand-wordmark" src="/brand/vanta-wordmark.png" alt="VANTA — Create Beyond" width={287} height={72} />
      </a>
      <div className="learning-header-actions">
        {stageLabel && <span className="learning-header-stage" dir="auto">{stageLabel}</span>}
        <a className="learning-header-link" href="/paths">{allPathsLabel}</a>
        <StudentNavActions locale={locale} />
        <button
          className="language-toggle"
          type="button"
          onClick={onSwitchLocale}
          aria-label={copy.nav.switchLanguage}
        >
          <span className="language-toggle-mark" aria-hidden="true">文</span>
          <span>{isArabic ? 'EN' : 'عربي'}</span>
        </button>
      </div>
    </header>
  );
}

export default LearningHeader;
