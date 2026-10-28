import { messages, type Locale } from '../i18n/messages';

type LearningHeaderProps = {
  locale: Locale;
  onSwitchLocale: () => void;
  allPathsLabel: string;
  homeLabel: string;
  stageLabel?: string;
};

function LearningHeader({
  locale,
  onSwitchLocale,
  allPathsLabel,
  homeLabel,
  stageLabel,
}: LearningHeaderProps) {
  const isArabic = locale === 'ar';
  const copy = messages[locale];

  return (
    <header className="site-header learning-system-header section-frame">
      <a className="brand-link" href="/" aria-label="VANTA — Create Beyond">
        <img className="learning-brand-emblem" src="/brand/vanta-emblem.png" alt="" aria-hidden="true" width={145} height={121} />
        <img className="learning-brand-wordmark" src="/brand/vanta-wordmark.png" alt="VANTA — Create Beyond" width={287} height={72} />
      </a>
      <div className="learning-header-actions">
        {stageLabel && <span className="learning-header-stage" dir="auto">{stageLabel}</span>}
        <a className="learning-header-link" href="/paths">{allPathsLabel}</a>
        <a className="learning-header-home" href="/">{homeLabel}</a>
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
