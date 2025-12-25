import { Global, css } from '@emotion/react';
import type { Theme } from './theme';

export const GlobalStyles = () => (
  <Global
    styles={(theme: Theme) => css`
      * {
        margin: 0;
        padding: 0;

        box-sizing: border-box;
      }

      body {
        background-color: ${theme.colors.background};
        color: ${theme.colors.gray900};
        font-family:
          -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
          Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        font-size: ${theme.fontSize.base};

        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      button {
        border: none;

        background: none;
        font-family: inherit;

        cursor: pointer;
      }

      input,
      textarea {
        font-family: inherit;
        font-size: inherit;
      }
    `}
  />
);
