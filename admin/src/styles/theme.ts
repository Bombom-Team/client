const colors = {
  primary: '#4F46E5',
  primaryHover: '#4338CA',
  secondary: '#8B5CF6',
  background: '#F9FAFB',
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  sky: '#0EA5E9',
} as const;

export const theme = {
  colors,
  // 이름에서 색을 뽑아 쓰는 아바타용 팔레트. 이 색을 연하게 깐 배경 위에 같은 색을
  // 어둡게 눌러 글자로 올리므로(InquiryAvatar 참고), 너무 어두운 색은 글자가 검게
  // 뭉개진다. 중간 밝기의 선명한 색으로 고른다.
  avatarPalette: [
    colors.primary,
    colors.secondary,
    colors.success,
    colors.warning,
    colors.error,
    colors.sky,
  ],
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export type Theme = typeof theme;
