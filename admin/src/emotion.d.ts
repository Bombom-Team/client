import '@emotion/react';
import type { Theme as CustomTheme } from './styles/theme';

declare module '@emotion/react' {
  export interface Theme extends CustomTheme {}
}
