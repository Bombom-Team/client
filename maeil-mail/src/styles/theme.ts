import { theme as sharedTheme, type AppTheme } from '@bombom/shared/theme';

const MAEIL_MAIL_COLORS = {
  primaryDark: '#699b7f',
  primaryLight: '#d9eddf',
  primaryInfo: '#edfdf3',
} as const;

export const theme: AppTheme = {
  ...sharedTheme,
  colors: {
    ...sharedTheme.colors,
    ...MAEIL_MAIL_COLORS,
  },
};
