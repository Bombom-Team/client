import styled from '@emotion/styled';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { noticesQueries } from '@/apis/notices/notices.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import { NoticeDetailView } from '@/pages/notices/NoticeDetailView';

export const Route = createFileRoute('/_admin/notices/$noticeId/')({
  component: NoticeDetailPage,
});

function NoticeDetailPage() {
  return (
    <Layout title="공지사항 상세">
      <ErrorBoundary fallback={<div>에러가 발생했습니다.</div>}>
        <Suspense fallback={<div>로딩 중...</div>}>
          <NoticeDetailContent />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

function NoticeDetailContent() {
  const { noticeId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const id = parseInt(noticeId);

  const { data: notice } = useSuspenseQuery(noticesQueries.detail(id));

  const { mutate: deleteNotice } = useMutation({
    ...noticesQueries.mutation.delete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticesQueries.all });
      goToList();
    },
  });

  const goToList = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate({ to: '/notices', search: { page: 0, size: 10 } } as any);
  };

  const handleEdit = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate({
      to: '/notices/$noticeId/edit',
      params: { noticeId: id.toString() },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  };

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteNotice(id);
    }
  };

  if (!notice) {
    return (
      <Container>
        <div>공지사항을 찾을 수 없습니다.</div>
        <ButtonGroup>
          <Button onClick={goToList}>목록으로 돌아가기</Button>
        </ButtonGroup>
      </Container>
    );
  }

  return (
    <NoticeDetailView notice={notice}>
      <ButtonGroup>
        <Button onClick={goToList}>목록</Button>
        <Button variant="secondary" onClick={handleEdit}>
          수정
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          삭제
        </Button>
      </ButtonGroup>
    </NoticeDetailView>
  );
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  background-color: ${({ theme }) => theme.colors.white};
`;

const ButtonGroup = styled.div`
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
`;
