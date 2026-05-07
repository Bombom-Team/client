import { theme as sharedTheme, type AppTheme } from '@bombom/shared/theme';

export type MaeilMailTheme = AppTheme & {
  colors: AppTheme['colors'] & { primaryBomBom: string };
};

const MAEIL_MAIL_COLORS = {
  primary: '#17C881',
  primaryDark: '#699b7f',
  primaryLight: '#d9eddf',
  primaryInfo: '#edfdf3',
  primaryBomBom: '#FE5E04',
} as const;

export const theme: MaeilMailTheme = {
  ...sharedTheme,
  colors: {
    ...sharedTheme.colors,
    ...MAEIL_MAIL_COLORS,
  },
};
