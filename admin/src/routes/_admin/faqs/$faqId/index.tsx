import styled from '@emotion/styled';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { faqsQueries } from '@/apis/faqs/faqs.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import { FaqDetailView } from '@/pages/faqs/FaqDetailView';

export const Route = createFileRoute('/_admin/faqs/$faqId/')({
  component: FaqDetailPage,
});

function FaqDetailPage() {
  return (
    <Layout title="FAQ 상세">
      <ErrorBoundary fallback={<div>에러가 발생했습니다.</div>}>
        <Suspense fallback={<div>로딩 중...</div>}>
          <FaqDetailContent />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

function FaqDetailContent() {
  const { faqId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const id = parseInt(faqId);

  const { data: faq } = useSuspenseQuery(faqsQueries.detail(id));

  const { mutate: deleteFaq } = useMutation({
    ...faqsQueries.mutation.delete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqsQueries.all });
      goToList();
    },
  });

  const goToList = () => {
    navigate({
      to: '/faqs',
      search: { page: 0, size: 10, faqCategory: undefined },
    });
  };

  const handleEdit = () => {
    navigate({
      to: '/faqs/$faqId/edit',
      params: { faqId: id.toString() },
    });
  };

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteFaq(id);
    }
  };

  if (!faq) {
    return (
      <Container>
        <div>FAQ를 찾을 수 없습니다.</div>
        <ButtonGroup>
          <Button onClick={goToList}>목록으로 돌아가기</Button>
        </ButtonGroup>
      </Container>
    );
  }

  return (
    <FaqDetailView faq={faq}>
      <ButtonGroup>
        <Button onClick={goToList}>목록</Button>
        <Button variant="secondary" onClick={handleEdit}>
          수정
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          삭제
        </Button>
      </ButtonGroup>
    </FaqDetailView>
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
