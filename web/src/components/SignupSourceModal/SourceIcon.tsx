import type { SignupSource } from '@/apis/signupSource/signupSource.api';

const ICON_PATHS: Record<SignupSource, string[]> = {
  INSTAGRAM: [
    'M8.5 4h7A4.5 4.5 0 0 1 20 8.5v7a4.5 4.5 0 0 1-4.5 4.5h-7A4.5 4.5 0 0 1 4 15.5v-7A4.5 4.5 0 0 1 8.5 4z',
    'M12 8.4a3.6 3.6 0 1 1 0 7.2 3.6 3.6 0 0 1 0-7.2z',
    'M16.6 7.4h.01',
  ],
  THREADS: [
    'M12 8.6a3.4 3.4 0 1 1 0 6.8 3.4 3.4 0 0 1 0-6.8z',
    'M15.4 12v1.4a2.4 2.4 0 0 0 4.8 0V12a8.2 8.2 0 1 0-3.3 6.6',
  ],
  X: ['M5.5 5.5l13 13', 'M18.5 5.5l-13 13'],
  YOUTUBE: [
    'M6.5 6h11A3.5 3.5 0 0 1 21 9.5v5a3.5 3.5 0 0 1-3.5 3.5h-11A3.5 3.5 0 0 1 3 14.5v-5A3.5 3.5 0 0 1 6.5 6z',
    'M10.4 9.6v4.8l4.1-2.4z',
  ],
  SEARCH: ['M11 5a6 6 0 1 1 0 12 6 6 0 0 1 0-12z', 'M20 20l-4.3-4.3'],
  FRIEND: [
    'M9 5.8a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4z',
    'M3.5 19c.8-3 3-4.6 5.5-4.6s4.7 1.6 5.5 4.6',
    'M16 6.5a3 3 0 0 1 0 5.6',
    'M18 14.6c1.4.6 2.3 2 2.6 4.4',
  ],
  BLOG_CAFE: ['M5 19h3.6L19 8.6 15.4 5 5 15.4z', 'M13.6 6.8l3.6 3.6'],
  NEWSLETTER: [
    'M6 5.5h12A2.5 2.5 0 0 1 20.5 8v8a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 16V8A2.5 2.5 0 0 1 6 5.5z',
    'M4.5 7l7.5 6 7.5-6',
  ],
  APP_STORE: [
    'M9 3h6a2.5 2.5 0 0 1 2.5 2.5v13A2.5 2.5 0 0 1 15 21H9a2.5 2.5 0 0 1-2.5-2.5v-13A2.5 2.5 0 0 1 9 3z',
    'M10.5 18h3',
  ],
  ETC: ['M6 12h.01', 'M12 12h.01', 'M18 12h.01'],
};

interface SourceIconProps {
  source: SignupSource;
}

const SourceIcon = ({ source }: SourceIconProps) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={source === 'ETC' ? 3 : 1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[source].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
};

export default SourceIcon;
