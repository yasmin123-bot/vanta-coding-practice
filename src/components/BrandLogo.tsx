import { productBrand } from '../brand/productBrand';
import type { Locale } from '../i18n/messages';
import { useTheme } from '../state/ThemeProvider';

type BrandLogoProps = {
  locale?: Locale;
  variant?: 'lockup' | 'mark' | 'bilingual';
  className?: string;
  decorative?: boolean;
};

export default function BrandLogo({ locale = 'en', variant = 'lockup', className = '', decorative = false }: BrandLogoProps) {
  const { theme } = useTheme();
  const src = theme === 'dark' ? productBrand.darkMark : variant === 'mark'
    ? productBrand.mark
    : productBrand.lockup[variant === 'bilingual' ? 'bilingual' : locale];
  return (
    <img
      className={`mabda-logo mabda-logo-${variant} ${className}`.trim()}
      src={src}
      alt={decorative ? '' : 'Mabda — مبدأ'}
      aria-hidden={decorative || undefined}
      draggable={false}
    />
  );
}
