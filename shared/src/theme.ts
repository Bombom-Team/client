const fontFamily =
  '"NanumGothic", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

const fonts = {
  t1Regular: `400 0.625rem/0.875rem ${fontFamily}`, // 10px / 14px
  t1Bold: `700 0.625rem/0.875rem ${fontFamily}`, // 10px / 14px
  t2Regular: `400 0.6875rem/0.9375rem ${fontFamily}`, // 11px / 15px
  t2Bold: `700 0.6875rem/0.9375rem ${fontFamily}`, // 11px / 15px
  t3Regular: `400 0.75rem/1rem ${fontFamily}`, // 12px / 16px
  t3Bold: `700 0.75rem/1rem ${fontFamily}`, // 12px / 16px
  t4Regular: `400 0.8125rem/1.125rem ${fontFamily}`, // 13px / 18px
  t4Bold: `700 0.8125rem/1.125rem ${fontFamily}`, // 13px / 18px
  t5Regular: `400 0.875rem/1.1875rem ${fontFamily}`, // 14px / 19px
  t5Bold: `700 0.875rem/1.1875rem ${fontFamily}`, // 14px / 19px
  t6Regular: `400 1rem/1.375rem ${fontFamily}`, // 16px / 22px
  t6Bold: `700 1rem/1.375rem ${fontFamily}`, // 16px / 22px
  t7Regular: `400 1.125rem/1.5rem ${fontFamily}`, // 18px / 24px
  t7Bold: `700 1.125rem/1.5rem ${fontFamily}`, // 18px / 24px
  t8Regular: `400 1.25rem/1.6875rem ${fontFamily}`, // 20px / 27px
  t8Bold: `700 1.25rem/1.6875rem ${fontFamily}`, // 20px / 27px
  t9Regular: `400 1.375rem/1.875rem ${fontFamily}`, // 22px / 30px
  t9Bold: `700 1.375rem/1.875rem ${fontFamily}`, // 22px / 30px
  t10Regular: `400 1.5rem/2rem ${fontFamily}`, // 24px / 32px
  t10Bold: `700 1.5rem/2rem ${fontFamily}`, // 24px / 32px
  t11Regular: `400 1.75rem/2.375rem ${fontFamily}`, // 28px / 38px
  t11Bold: `700 1.75rem/2.375rem ${fontFamily}`, // 28px / 38px
  t12Regular: `400 1.875rem/2.5rem ${fontFamily}`, // 30px / 40px
  t12Bold: `700 1.875rem/2.5rem ${fontFamily}`, // 30px / 40px
  t13Regular: `400 2.125rem/2.875rem ${fontFamily}`, // 34px / 46px
  t13Bold: `700 2.125rem/2.875rem ${fontFamily}`, // 34px / 46px
  t14Regular: `400 2.5rem/3.375rem ${fontFamily}`, // 40px / 54px
  t14Bold: `700 2.5rem/3.375rem ${fontFamily}`, // 40px / 54px
  t15Regular: `400 3rem/4rem ${fontFamily}`, // 48px / 64px
  t15Bold: `700 3rem/4rem ${fontFamily}`, // 48px / 64px
  t16Regular: `400 3.5rem/4.75rem ${fontFamily}`, // 56px / 76px
  t16Bold: `700 3.5rem/4.75rem ${fontFamily}`, // 56px / 76px
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
