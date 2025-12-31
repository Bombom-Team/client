import styled from '@emotion/styled';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { newslettersQueries } from '@/apis/newsletters/newsletters.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import NewsletterDetailView from '@/pages/newsletters/NewsletterDetailView';

const NewsletterDetailPage = () => {
  return (
    <Layout title="뉴스레터 상세">
      <ErrorBoundary fallback={<div>에러가 발생했습니다.</div>}>
        <Suspense fallback={<div>로딩 중...</div>}>
          <NewsletterDetailContent />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
};

const NewsletterDetailContent = () => {
  const { newsletterId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const id = Number(newsletterId);
  const listSearch = {
    keyword: '',
    category: '',
    previousStrategy: '',
    sort: 'LATEST',
  };

  const { data: newsletter } = useSuspenseQuery(newslettersQueries.detail(id));

  const { mutate: deleteNewsletter, isPending } = useMutation({
    ...newslettersQueries.mutation.delete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newslettersQueries.all });
      goToList();
    },
  });

  const goToList = () => {
    navigate({ to: '/newsletters', search: listSearch });
  };

  const handleEdit = () => {
    navigate({
      to: '/newsletters/$newsletterId/edit',
      params: { newsletterId: id.toString() },
    });
  };

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteNewsletter(id);
    }
  };

  if (!newsletter) {
    return (
      <Container>
        <div>뉴스레터를 찾을 수 없습니다.</div>
        <ButtonGroup>
          <Button onClick={goToList}>목록으로 돌아가기</Button>
        </ButtonGroup>
      </Container>
    );
  }

  return (
    <NewsletterDetailView newsletter={newsletter}>
      <ButtonGroup>
        <Button onClick={goToList}>목록</Button>
        <Button variant="secondary" onClick={handleEdit}>
          수정
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={isPending}>
          {isPending ? '삭제 중...' : '삭제'}
        </Button>
      </ButtonGroup>
    </NewsletterDetailView>
  );
};

export const Route = createFileRoute('/_admin/newsletters/$newsletterId/')({
  component: NewsletterDetailPage,
});

const Container = styled.div`
  max-width: 900px;
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
