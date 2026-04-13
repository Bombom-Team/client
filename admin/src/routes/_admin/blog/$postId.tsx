import styled from '@emotion/styled';
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const BlogEditor = lazy(() =>
  import('@/pages/blog/BlogEditor').then((m) => ({ default: m.BlogEditor })),
);
const BlogViewer = lazy(() => import('@/pages/blog/BlogViewer'));

export const Route = createFileRoute('/_admin/blog/$postId')({
  component: BlogPostPage,
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search.mode === 'view' ? 'view' : 'edit',
  }),
});

function EditorErrorFallback() {
  const navigate = useNavigate();
  return (
    <ErrorFallback>
      <p>글을 불러오지 못했습니다.</p>
      <BackButton onClick={() => navigate({ to: '/blog' })} type="button">
        ← 목록으로 돌아가기
      </BackButton>
    </ErrorFallback>
  );
}

function BlogPostPage() {
  const { mode } = useSearch({ from: Route.id });
  const CurrentPage = mode === 'view' ? BlogViewer : BlogEditor;

  return (
    <ErrorBoundary FallbackComponent={EditorErrorFallback}>
      <Suspense fallback={<LoadingState>불러오는 중...</LoadingState>}>
        <CurrentPage />
      </Suspense>
    </ErrorBoundary>
  );
}

const ErrorFallback = styled.div`
  height: 100vh;

  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.gray700};
`;

const BackButton = styled.button`
  border: none;

  background: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSize.sm};

  cursor: pointer;
  text-decoration: underline;
`;

const LoadingState = styled.div`
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.gray500};
`;
