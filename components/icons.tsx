import type { SVGProps } from 'react';

type IconName =
  | 'home' | 'skills' | 'sessions' | 'analytics' | 'profile' | 'bolt' | 'coin' | 'flame'
  | 'target' | 'clock' | 'check' | 'arrowUp' | 'arrowDown' | 'lock' | 'close' | 'flag'
  | 'spark' | 'book' | 'info' | 'chevronRight' | 'refresh';

const paths: Record<IconName, React.ReactNode> = {
  home: <><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-7h6v7"/></>,
  skills: <><path d="m12 2 1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/></>,
  sessions: <><path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
  analytics: <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/></>,
  profile: <><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4-6 8-6s6.5 2 8 6"/></>,
  bolt: <path d="m13 2-7 11h6l-1 9 7-12h-6l1-8Z"/>,
  coin: <><circle cx="12" cy="12" r="8"/><path d="M9 12h6M12 9v6"/></>,
  flame: <path d="M13 2s1 4-2 6c-2 1.5-3.5 3.5-3.5 6A4.5 4.5 0 0 0 16 16c0-1.6-.6-3-2-4 0 2-1 3-2 3-1.2 0-2-.9-2-2.1 0-1.9 1.7-3 3-4.2 1.5-1.4 2-3.6 0-6.7Z"/>,
  target: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="m21 3-6 6"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  arrowUp: <><path d="m7 14 5-5 5 5"/><path d="M12 9v10"/></>,
  arrowDown: <><path d="m7 10 5 5 5-5"/><path d="M12 5v10"/></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
  flag: <><path d="M5 22V3"/><path d="M5 4h11l-2 4 2 4H5"/></>,
  spark: <path d="m12 2 2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z"/>,
  book: <><path d="M4 5a4 4 0 0 1 4-2h4v17H8a4 4 0 0 0-4 2V5Z"/><path d="M20 5a4 4 0 0 0-4-2h-4v17h4a4 4 0 0 1 4 2V5Z"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
  chevronRight: <path d="m9 6 6 6-6 6"/>,
  refresh: <><path d="M20 6v5h-5"/><path d="M4 18v-5h5"/><path d="M18.5 9A7 7 0 0 0 6 6.5L4 11M5.5 15A7 7 0 0 0 18 17.5L20 13"/></>,
};

export function Icon({ name, size = 18, ...props }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {paths[name]}
    </svg>
  );
}
