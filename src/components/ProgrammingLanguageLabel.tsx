import type { ReactNode } from 'react';
import '../styles/programming-language-icons.css';

export type ProgrammingLanguage = 'html' | 'css' | 'javascript';

type ProgrammingLanguageLabelProps = {
  language: ProgrammingLanguage;
  children: ReactNode;
  label?: string;
  className?: string;
};

const languageNames: Record<ProgrammingLanguage, string> = {
  html: 'HTML',
  css: 'CSS',
  javascript: 'JavaScript',
};

const languageIconSources: Record<ProgrammingLanguage, string> = {
  html: '/assets/programming-languages/html5-original.svg',
  css: '/assets/programming-languages/css3-original.svg',
  javascript: '/assets/programming-languages/javascript-original.svg',
};

export function ProgrammingLanguageLabel({ language, children, label, className }: ProgrammingLanguageLabelProps) {
  const accessibleLabel = label ?? languageNames[language];
  const classes = ['programming-language-label', className].filter(Boolean).join(' ');

  return (
    <span className={classes} dir="ltr" title={accessibleLabel}>
      <img
        className="programming-language-label__icon"
        src={languageIconSources[language]}
        alt=""
        aria-hidden="true"
      />
      <span className="programming-language-label__text">{children}</span>
    </span>
  );
}

export default ProgrammingLanguageLabel;
