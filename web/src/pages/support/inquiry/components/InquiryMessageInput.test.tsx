import { ApiError } from '@bombom/shared/apis';
import { theme } from '@bombom/shared/theme';
import { ThemeProvider } from '@emotion/react';
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import InquiryMessageInput from './InquiryMessageInput';
import { uploadInquiryImages } from '@/apis/inquiry/inquiry.api';
import { toast } from '@/components/Toast/utils/toastActions';

jest.mock('@bombom/shared/env', () => ({
  ENV: { baseUrl: 'https://api.example.com' },
}));

jest.mock('@/apis/inquiry/inquiry.api', () => ({
  uploadInquiryImages: jest.fn(),
}));

jest.mock('@/components/Toast/utils/toastActions', () => ({
  toast: { error: jest.fn() },
}));

jest.mock('@/components/Button/Button', () =>
  jest.requireActual('../../../../../../shared/src/ui-web/Button/Button'),
);

const renderInput = () => {
  const onMutationError = jest.fn();
  const onSubmit = jest.fn().mockResolvedValue(undefined);
  const queryClient = new QueryClient({
    mutationCache: new MutationCache({ onError: onMutationError }),
    defaultOptions: { mutations: { retry: false } },
  });
  const { container } = render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <InquiryMessageInput onSubmit={onSubmit} />
      </ThemeProvider>
    </QueryClientProvider>,
  );
  const fileInput =
    container.querySelector<HTMLInputElement>('input[type="file"]');
  if (!fileInput) throw new Error('파일 입력을 찾을 수 없습니다.');

  return { fileInput, onMutationError, onSubmit, queryClient };
};

describe('InquiryMessageInput', () => {
  it('업로드 실패를 전역 오류 처리에 전달하고 서버 안내와 입력 내용을 유지한다', async () => {
    const error = new ApiError(413, '파일 용량이 너무 큽니다.');
    jest.mocked(uploadInquiryImages).mockRejectedValueOnce(error);
    const { fileInput, onMutationError, queryClient } = renderInput();
    const textarea = screen.getByPlaceholderText('문의 내용을 입력해주세요');

    fireEvent.change(textarea, { target: { value: '문의 내용' } });
    fireEvent.change(fileInput, {
      target: {
        files: [new File(['image'], 'test.png', { type: 'image/png' })],
      },
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(error.message);
      expect(onMutationError).toHaveBeenCalledTimes(1);
    });
    expect((textarea as HTMLTextAreaElement).value).toBe('문의 내용');
    expect(
      (screen.getByRole('button', { name: '이미지 첨부' }) as HTMLButtonElement)
        .disabled,
    ).toBe(false);
    queryClient.clear();
  });

  it('업로드한 이미지와 입력 내용을 전송하고 성공하면 입력창을 비운다', async () => {
    const imageUrl = 'https://example.com/test.png';
    jest
      .mocked(uploadInquiryImages)
      .mockResolvedValueOnce({ imageUrls: [imageUrl] });
    const { fileInput, onSubmit, queryClient } = renderInput();
    const textarea = screen.getByPlaceholderText('문의 내용을 입력해주세요');

    fireEvent.change(textarea, { target: { value: ' 문의 내용 ' } });
    fireEvent.change(fileInput, {
      target: {
        files: [new File(['image'], 'test.png', { type: 'image/png' })],
      },
    });

    await screen.findByAltText('첨부 미리보기');
    fireEvent.click(screen.getByRole('button', { name: '전송' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        content: '문의 내용',
        imageUrls: [imageUrl],
      });
      expect((textarea as HTMLTextAreaElement).value).toBe('');
    });
    expect(screen.queryByAltText('첨부 미리보기')).toBeNull();
    queryClient.clear();
  });
});
