import { useTheme } from '../state/ThemeProvider';
import type { Locale } from '../i18n/messages';

export default function ThemeToggle({ locale }: { locale: Locale }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const label = locale === 'ar'
    ? (isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن')
    : (isDark ? 'Switch to light mode' : 'Switch to dark mode');
  return (
    <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={label} title={label} aria-pressed={isDark}>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        {isDark ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></> : <path d="M20.5 13.4A8.6 8.6 0 0 1 10.6 3.5a8.6 8.6 0 1 0 9.9 9.9Z" />}
      </svg>
      <span>{locale === 'ar' ? (isDark ? 'فاتح' : 'داكن') : (isDark ? 'Light' : 'Dark')}</span>
    </button>
  );
}
