const fontFamily =
  '"NanumGothic", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

const fonts = {
  heading1: `700 3rem/3.75rem ${fontFamily}`,
  heading2: `700 2.125rem/3.125rem ${fontFamily}`,
  heading3: `700 1.75rem/2.375rem ${fontFamily}`,
  heading4: `700 1.5rem/2rem ${fontFamily}`,
  heading5: `700 1.125rem/1.75rem ${fontFamily}`,
  heading6: `700 1rem/1.5rem ${fontFamily}`,
  bodyLarge: `400 1.125rem/1.75rem ${fontFamily}`,
  body1: `400 1rem/1.5rem ${fontFamily}`,
  body2: `400 0.875rem/1.375rem ${fontFamily}`,
  body3: `400 0.75rem/1.25rem ${fontFamily}`,
  body4: `400 0.625rem/1.125rem ${fontFamily}`,
  caption: `400 0.75rem/1.125rem ${fontFamily}`,
};

const colors = {
  primary: '#FE5E04',
  primaryDark: '#E35400',
  primaryLight: '#FFD6C2',
  primaryInfo: '#ffebe0',
  textPrimary: '#181818',
  textSecondary: '#5C5C5C',
  textTertiary: '#747474',
  icons: '#7C7B7B',
  stroke: '#D7D7D7',
  dividers: '#EDEDED',
  disabledText: '#8A8A8A',
  disabledBackground: '#EFEFEF',
  white: '#FFFFFF',
  black: '#000000',
  red: '#f00000',
  navy: '#111827',
  error: '#FF4D4F',
  info: '#0D6EFD',
  success: '#198754',
  backgroundHover: '#F9F9F9',
};

const heights = {
  headerPC: '72px',
  headerMobile: '56px',
  bottomNav: '64px',
};

const safeArea = {
  top: 'var(--safe-area-inset-top)',
  bottom: 'var(--safe-area-inset-bottom)',
};

const zIndex = {
  behind: -1, // 뒤쪽 배경 요소
  base: 0, // 기본 레벨
  content: 1, // 일반 콘텐츠 요소
  elevated: 10, // 드롭다운, 툴팁, 폼 요소
  panel: 50, // 패널, 사이드바
  header: 100, // 헤더, 네비게이션
  floating: 800, // 플로팅 요소
  overlay: 1000, // 모달, 오버레이, 플로팅 버튼
  toast: 9000, // 토스트, 알림 (최상위)
};

export const theme = {
  fonts,
  colors,
  heights,
  safeArea,
  zIndex,
};

export type AppTheme = typeof theme;
