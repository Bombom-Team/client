import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useUpdateHighlightMutation } from './useUpdateHighlightMutation';
import { patchHighlight } from '@/apis/highlight/highlight.api';
import type { PropsWithChildren } from 'react';

jest.mock('@bombom/shared/ui-web', () => ({ toast: { error: jest.fn() } }));
jest.mock('@/apis/highlight/highlight.api', () => ({
  patchHighlight: jest.fn(),
}));
jest.mock('@/apis/queries', () => ({
  queries: {
    articleHighlights: ({ articleId }: { articleId: number }) => ({
      queryKey: ['articles', 'highlights', articleId],
    }),
  },
}));

describe('useUpdateHighlightMutation', () => {
  it('응답이 오기 전에 다른 글로 넘어가면 요청한 글의 형광펜 목록을 무효화한다', async () => {
    let respond: () => void = () => {};
    jest.mocked(patchHighlight).mockReturnValue(
      new Promise((resolve) => {
        respond = () => resolve(undefined);
      }),
    );
    const queryClient = new QueryClient();
    const invalidateQueries = jest.spyOn(queryClient, 'invalidateQueries');
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result, rerender } = renderHook(
      ({ articleId }) => useUpdateHighlightMutation({ articleId }),
      { wrapper, initialProps: { articleId: 1 } },
    );

    act(() => result.current.mutate({ id: 10, memo: '메모' }));
    await waitFor(() => expect(patchHighlight).toHaveBeenCalled());
    rerender({ articleId: 2 });
    await act(async () => respond());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['articles', 'highlights', 1],
    });
  });
});
