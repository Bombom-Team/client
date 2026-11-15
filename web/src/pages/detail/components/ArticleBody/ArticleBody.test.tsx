import { theme } from '@bombom/shared/theme';
import { ThemeProvider } from '@emotion/react';
import { render } from '@testing-library/react';
import { createRef } from 'react';
import ArticleBody from './ArticleBody';
import { useHighlights } from '../../hooks/useHighlights';
import type { ArticleFontSizePercentage } from '../../constants/articleFontSize';
import type { Highlight } from '../../types/highlight';
import type { RefObject } from 'react';

jest.mock('@bombom/shared/ui-web', () => ({
  toast: { error: jest.fn() },
  useModal: () => ({
    modalRef: { current: null },
    openModal: jest.fn(),
    closeModal: jest.fn(),
    isOpen: false,
  }),
}));
jest.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: undefined }),
}));
jest.mock('@tanstack/react-router', () => ({
  useNavigate: () => jest.fn(),
}));
jest.mock('@/apis/queries', () => ({
  queries: {
    contentByArticleId: () => ({}),
    answerByArticleId: () => ({}),
  },
}));
jest.mock('@/libs/googleAnalytics/gaEvents', () => ({ trackEvent: jest.fn() }));
jest.mock('./useFloatingToolbarSelection', () => ({
  useFloatingToolbarSelection: () => ({
    activeSelectionRange: null,
    activeHighlightId: null,
  }),
}));
jest.mock('../../hooks/useHighlights', () => ({ useHighlights: jest.fn() }));
jest.mock('../../hooks/useAddHighlightMutation', () => ({
  useAddHighlightMutation: () => ({ mutate: jest.fn() }),
}));
jest.mock('../../hooks/useRemoveHighlighMutation', () => ({
  useRemoveHighlightMutation: () => ({ mutate: jest.fn() }),
}));
jest.mock('../../hooks/useUpdateHighlightMutation', () => ({
  useUpdateHighlightMutation: () => ({ mutate: jest.fn() }),
}));
jest.mock('../../hooks/useExternalLinkHandler', () => ({
  useExternalLinkHandler: jest.fn(),
}));
jest.mock('../../hooks/useMaeilMailAnswerButton', () => ({
  useMaeilMailAnswerButton: jest.fn(),
}));
jest.mock('../FloatingToolbar/FloatingToolbar', () => () => null);
jest.mock('../MaeilMailAnswerModal/MaeilMailAnswerModal', () => () => null);
jest.mock('../MemoPanel/MemoPanel', () => () => null);

const ARTICLE_CONTENT = '<p>첫 번째 문단입니다.</p><p>두 번째 문단입니다.</p>';

const createHighlight = (id: number, paragraphIndex: number): Highlight => ({
  id,
  articleId: 1,
  color: '#FFD6C2',
  text: '번째',
  location: {
    startXPath: `./p[${paragraphIndex}]`,
    startOffset: 2,
    endXPath: `./p[${paragraphIndex}]`,
    endOffset: 4,
  },
});

const FIRST_HIGHLIGHT = createHighlight(1, 1);
const SECOND_HIGHLIGHT = createHighlight(2, 2);

const mockHighlightList = (highlights: Highlight[]) => {
  jest.mocked(useHighlights).mockReturnValue({
    highlights,
    isHighlightLoaded: true,
  });
};

const renderArticleBody = (
  contentRef: RefObject<HTMLDivElement | null>,
  fontSizePercentage: ArticleFontSizePercentage = 100,
) => (
  <ThemeProvider theme={theme}>
    <ArticleBody
      contentRef={contentRef}
      articleId={1}
      articleTitle="제목"
      newsletterName="뉴스레터"
      articleContent={ARTICLE_CONTENT}
      fontSizePercentage={fontSizePercentage}
    />
  </ThemeProvider>
);

const getHighlightIds = (contentRef: RefObject<HTMLDivElement | null>) =>
  Array.from(
    contentRef.current?.querySelectorAll('mark[data-highlight-id]') ?? [],
  ).map((mark) => Number((mark as HTMLElement).dataset.highlightId));

describe('ArticleBody 형광펜 복원', () => {
  beforeAll(() => {
    // jsdom에는 ResizeObserver가 없다.
    window.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it('형광펜 목록을 불러오면 본문에 그리고, 글자 크기를 바꿔도 유지한다', () => {
    const contentRef = createRef<HTMLDivElement>();
    mockHighlightList([FIRST_HIGHLIGHT, SECOND_HIGHLIGHT]);

    const { rerender } = render(renderArticleBody(contentRef));
    rerender(renderArticleBody(contentRef, 130));

    expect(getHighlightIds(contentRef)).toEqual([1, 2]);
  });

  it('목록이 갱신되어 형광펜이 빠지면 본문에서도 지운다', () => {
    const contentRef = createRef<HTMLDivElement>();
    mockHighlightList([FIRST_HIGHLIGHT, SECOND_HIGHLIGHT]);
    const { rerender } = render(renderArticleBody(contentRef));

    mockHighlightList([SECOND_HIGHLIGHT]);
    rerender(renderArticleBody(contentRef));

    expect(getHighlightIds(contentRef)).toEqual([2]);
  });
});
