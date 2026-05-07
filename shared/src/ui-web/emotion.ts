import '@emotion/react';
import type { AppTheme } from '../core/theme';

declare module '@emotion/react' {
  export interface Theme extends AppTheme {}
}
