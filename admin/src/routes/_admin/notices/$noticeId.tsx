import styled from '@emotion/styled';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { NOTICE_CATEGORY_LABELS } from '@/types/notice';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { noticesQueries } from '@/apis/notices/notices.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';

export const Route = createFileRoute('/_admin/notices/$noticeId')({
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
    alert(`공지사항 ID ${id}를 수정합니다. (수정 기능은 아직 미구현)`);
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
    <Container>
      <HeaderContainer>
        <CategoryBadge category={notice.noticeCategory}>
          {NOTICE_CATEGORY_LABELS[notice.noticeCategory] ?? notice.noticeCategory}
        </CategoryBadge>
        <Title>{notice.title}</Title>
        <DateText>{notice.createdAt}</DateText>
      </HeaderContainer>

      <Content>{notice.content}</Content>

      <ButtonGroup>
        <Button onClick={goToList}>목록</Button>
        <Button variant="secondary" onClick={handleEdit}>
          수정
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          삭제
        </Button>
      </ButtonGroup>
    </Container>
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

const Content = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.base};
  line-height: 1.6;
  white-space: pre-wrap;
`;

const ButtonGroup = styled.div`
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
`;

const Title = styled.h1`
  flex: 1;
  margin: 0;
  line-height: 1.3;
  word-break: break-all;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize['2xl']};
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const CategoryBadge = styled.span<{ category: string }>`
  flex-shrink: 0;
  margin-top: 6px;

  padding: 4px 8px;
  border-radius: 4px;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
`;

const DateText = styled.span`
  flex-shrink: 0;
  margin-left: auto;
  margin-top: 10px;
  white-space: nowrap;

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
