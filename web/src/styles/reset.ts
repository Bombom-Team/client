import { css } from '@emotion/react';

const reset = css`
  @import url('http://fonts.googleapis.com/earlyaccess/nanumgothic.css');

  /* Reset 기본 스타일 */
  html,
  body,
  div,
  span,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  a,
  img,
  ul,
  ol,
  li,
  table,
  tr,
  th,
  td,
  form,
  label,
  fieldset,
  legend,
  input,
  textarea,
  button,
  article,
  aside,
  footer,
  header,
  nav,
  section,
  main,
  figure,
  figcaption {
    margin: 0;
    padding: 0;
    border: 0;

    font: inherit;
  }

  body {
    font-family:
      'NanumGothic',
      'Pretendard Variable',
      Pretendard,
      -apple-system,
      BlinkMacSystemFont,
      'Apple SD Gothic Neo',
      Roboto,
      'Noto Sans KR',
      'Segoe UI',
      'Malgun Gothic',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
      sans-serif;
    line-height: 1;
  }

  ol,
  ul {
    list-style: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  * {
    box-sizing: border-box;
  }

  button {
    border: none;

    background-color: transparent;

    cursor: pointer;

    :disabled {
      cursor: not-allowed;
    }
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  p,
  span {
    white-space: pre-wrap;
  }

  html {
    font-size: 100%;

    --safe-area-inset-top: env(safe-area-inset-top, 0);
    --safe-area-inset-bottom: env(safe-area-inset-bottom, 0);

    -webkit-tap-highlight-color: rgb(0 0 0 / 0%);

    touch-action: pan-x pan-y;
    -webkit-touch-callout: none;

    user-select: none;
  }

  html.webview {
    --safe-area-inset-top: 0;
    --safe-area-inset-bottom: 0;
  }
`;

export default reset;
