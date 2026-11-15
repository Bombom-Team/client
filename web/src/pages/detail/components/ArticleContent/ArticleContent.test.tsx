import { theme } from '@bombom/shared/theme';
import { ThemeProvider } from '@emotion/react';
import { render } from '@testing-library/react';
import { createRef } from 'react';
import ArticleContent from './ArticleContent';
import type { ArticleFontSizePercentage } from '../../constants/articleFontSize';
import type { RefObject } from 'react';

const renderArticleContent = (
  ref: RefObject<HTMLDivElement | null>,
  fontSizePercentage: ArticleFontSizePercentage,
) => (
  <ThemeProvider theme={theme}>
    <ArticleContent
      ref={ref}
      newsletterName="뉴스레터"
      content="<p>본문 글자입니다.</p>"
      fontSizePercentage={fontSizePercentage}
    />
  </ThemeProvider>
);

describe('ArticleContent', () => {
  beforeAll(() => {
    // jsdom에는 ResizeObserver가 없다.
    window.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it('글자 크기가 바뀌어 다시 렌더링되면 본문에 그린 형광펜을 유지한다', () => {
    const ref = createRef<HTMLDivElement>();
    const { rerender } = render(renderArticleContent(ref, 100));
    const mark = document.createElement('mark');
    mark.dataset.highlightId = '1';
    mark.textContent = '형광펜';
    ref.current?.querySelector('p')?.appendChild(mark);

    rerender(renderArticleContent(ref, 130));

    expect(mark.isConnected).toBe(true);
  });
});
