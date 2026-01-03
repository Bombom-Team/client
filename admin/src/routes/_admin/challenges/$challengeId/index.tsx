import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { challengesQueries } from '@/apis/challenges/challenges.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import { ChallengeDetailView } from '@/pages/challenges/ChallengeDetailView';

export const Route = createFileRoute('/_admin/challenges/$challengeId/')({
  component: ChallengeDetailPage,
});

function ChallengeDetailPage() {
  return (
    <Layout title="챌린지 상세">
      <ErrorBoundary fallback={<div>에러가 발생했습니다.</div>}>
        <Suspense fallback={<div>로딩 중...</div>}>
          <ChallengeDetailContent />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

function ChallengeDetailContent() {
  const { challengeId } = Route.useParams();
  const navigate = useNavigate();

  const id = Number(challengeId);

  const { data: challenge } = useSuspenseQuery(
    challengesQueries.detail(id),
  );

  const goToList = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate({ to: '/challenges', search: { page: 0, size: 10 } } as any);
  };

  if (!challenge) {
    return (
      <Container>
        <div>챌린지를 찾을 수 없습니다.</div>
        <ButtonGroup>
          <Button onClick={goToList}>목록으로 돌아가기</Button>
        </ButtonGroup>
      </Container>
    );
  }

  return (
    <ChallengeDetailView challenge={challenge}>
      <ButtonGroup>
        <Button onClick={goToList}>목록</Button>
      </ButtonGroup>
    </ChallengeDetailView>
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
