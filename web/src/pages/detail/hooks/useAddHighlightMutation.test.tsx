import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useAddHighlightMutation } from './useAddHighlightMutation';
import { addHighlightToDOM } from '../utils/highlight';
import { postHighlight } from '@/apis/highlight/highlight.api';
import type {
  PostHighlightParams,
  PostHighlightResponse,
} from '@/apis/highlight/highlight.api';
import type { PropsWithChildren } from 'react';

jest.mock('@bombom/shared/ui-web', () => ({ toast: { error: jest.fn() } }));
jest.mock('@/apis/highlight/highlight.api', () => ({
  postHighlight: jest.fn(),
}));
jest.mock('@/apis/queries', () => ({
  queries: {
    articleHighlights: ({ articleId }: { articleId: number }) => ({
      queryKey: ['articles', 'highlights', articleId],
    }),
  },
}));
jest.mock('../utils/highlight', () => ({ addHighlightToDOM: jest.fn() }));

const HIGHLIGHT_PARAMS: PostHighlightParams = {
  articleId: 1,
  color: '#FFD6C2',
  text: '형광펜',
  location: {
    startXPath: './p[1]',
    startOffset: 0,
    endXPath: './p[1]',
    endOffset: 3,
  },
};

const renderAddHighlightMutation = () => {
  const queryClient = new QueryClient();
  const contentRef = { current: document.createElement('div') };
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderHook(
    ({ articleId }) => useAddHighlightMutation({ articleId, contentRef }),
    { wrapper, initialProps: { articleId: 1 } },
  );
};

// 테스트가 원하는 시점에 저장 응답을 돌려준다.
const mockPendingPostHighlight = () => {
  let resolveResponse: (response: PostHighlightResponse) => void = () => {};
  jest.mocked(postHighlight).mockReturnValue(
    new Promise((resolve) => {
      resolveResponse = resolve;
    }),
  );

  return () => resolveResponse({ ...HIGHLIGHT_PARAMS, articleId: 1, id: 10 });
};

describe('useAddHighlightMutation', () => {
  it('저장 응답이 오면 보고 있는 글에 형광펜을 그린다', async () => {
    const respond = mockPendingPostHighlight();
    const { result } = renderAddHighlightMutation();

    act(() => result.current.mutate(HIGHLIGHT_PARAMS));
    await act(async () => respond());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(addHighlightToDOM).toHaveBeenCalledTimes(1);
  });

  it('저장 응답이 오기 전에 다른 글로 넘어가면 형광펜을 그리지 않는다', async () => {
    const respond = mockPendingPostHighlight();
    const { result, rerender } = renderAddHighlightMutation();

    act(() => result.current.mutate(HIGHLIGHT_PARAMS));
    rerender({ articleId: 2 });
    await act(async () => respond());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(addHighlightToDOM).not.toHaveBeenCalled();
  });
});
