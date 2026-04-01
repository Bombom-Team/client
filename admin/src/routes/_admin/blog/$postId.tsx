import styled from '@emotion/styled';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BlogEditor } from '@/pages/blog/BlogEditor';

export const Route = createFileRoute('/_admin/blog/$postId')({
  component: BlogEditorPage,
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

function BlogEditorPage() {
  return (
    <ErrorBoundary FallbackComponent={EditorErrorFallback}>
      <Suspense fallback={<LoadingState>불러오는 중...</LoadingState>}>
        <BlogEditor />
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
