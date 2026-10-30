import type { ReactNode, SVGProps } from 'react';

export type AppIconName = 'home' | 'paths' | 'practice' | 'quiz' | 'profile' | 'more' | 'menu' | 'close' | 'settings' | 'language' | 'challenge' | 'project' | 'arrow';

type AppIconProps = SVGProps<SVGSVGElement> & {
  name: AppIconName;
  size?: number;
};

const paths: Record<AppIconName, ReactNode> = {
  home: <><path d="m3 10.5 9-7 9 7" /><path d="M5.5 9.5V21h13V9.5M9 21v-7h6v7" /></>,
  paths: <><path d="M3.5 5.5A2.5 2.5 0 0 1 6 3h12a2.5 2.5 0 0 1 2.5 2.5v15A2.5 2.5 0 0 0 18 18H6a2.5 2.5 0 0 0-2.5 2.5z" /><path d="M3.5 5.5H18a2.5 2.5 0 0 1 2.5 2.5M7 7h8m-8 4h8m-8 4h5" /></>,
  practice: <><path d="m8 4-6 8 6 8M16 4l6 8-6 8M14 3l-4 18" /></>,
  quiz: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4.5V3h6v1.5M8.5 11h7m-7 4h4m1 1 1.5 1.5L19 13" /></>,
  profile: <><circle cx="12" cy="8" r="3.5" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>,
  more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 3.1-.2-.1a1.7 1.7 0 0 0-1.9.3l-.1.1h-3.6l-.1-.2a1.7 1.7 0 0 0-1.6-1.1 1.7 1.7 0 0 0-1.4.8l-.1.2-3.1-1.8.1-.2a1.7 1.7 0 0 0-.3-1.9l-.1-.1v-3.6l.2-.1a1.7 1.7 0 0 0 1.1-1.6 1.7 1.7 0 0 0-.8-1.4l-.2-.1 1.8-3.1.2.1a1.7 1.7 0 0 0 1.9-.3l.1-.1h3.6l.1.2a1.7 1.7 0 0 0 1.6 1.1 1.7 1.7 0 0 0 1.4-.8l.1-.2 3.1 1.8-.1.2a1.7 1.7 0 0 0 .3 1.9l.1.1v3.6l-.2.1A1.7 1.7 0 0 0 19.4 15Z" /></>,
  language: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  challenge: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><path d="m13.5 10.5 7-7M17 3.5h3.5V7" /></>,
  project: <><path d="m12 3 8.5 4.8v8.4L12 21l-8.5-4.8V7.8z" /><path d="m3.8 7.9 8.2 4.7 8.2-4.7M12 12.6V21" /></>,
  arrow: <><path d="M4 12h15M13 6l6 6-6 6" /></>,
};

export default function AppIcon({ name, size = 20, className, ...props }: AppIconProps) {
  return (
    <svg
      className={['mabda-app-icon', `mabda-app-icon-${name}`, className].filter(Boolean).join(' ')}
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
