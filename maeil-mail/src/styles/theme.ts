import { theme as sharedTheme, type AppTheme } from '@bombom/shared/theme';

const MAEIL_MAIL_PRIMARY_COLORS: Pick<
  AppTheme['colors'],
  'primary' | 'primaryDark' | 'primaryLight' | 'primaryInfo'
> = {
  primary: '#17C881',
  primaryDark: '#699b7f',
  primaryLight: '#d9eddf',
  primaryInfo: '#edfdf3',
};

export const theme: AppTheme = {
  ...sharedTheme,
  colors: {
    ...sharedTheme.colors,
    ...MAEIL_MAIL_PRIMARY_COLORS,
  },
};
