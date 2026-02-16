import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { eventsQueries } from '@/apis/events/events.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import { EventDetailView } from '@/pages/events/EventDetailView';

export const Route = createFileRoute('/_admin/events/$eventId')({
  component: EventDetailPage,
});

function EventDetailPage() {
  return (
    <Layout title="이벤트 상세">
      <ErrorBoundary fallback={<div>에러가 발생했습니다.</div>}>
        <Suspense fallback={<div>로딩 중...</div>}>
          <EventDetailContent />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

function EventDetailContent() {
  const { eventId } = Route.useParams();
  const navigate = useNavigate();
  const id = Number(eventId);
  const { data: event } = useSuspenseQuery(eventsQueries.detail(id));
  const { data: schedules } = useSuspenseQuery(eventsQueries.schedules(id));

  const handleBack = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate({ to: '/events', search: { page: 0, size: 10 } } as any);
  };

  if (!event) {
    return (
      <Container>
        <div>이벤트를 찾을 수 없습니다.</div>
        <ButtonGroup>
          <Button onClick={handleBack}>목록으로 돌아가기</Button>
        </ButtonGroup>
      </Container>
    );
  }

  return (
    <EventDetailView event={event} schedules={schedules}>
      <ButtonGroup>
        <Button onClick={handleBack}>목록</Button>
      </ButtonGroup>
    </EventDetailView>
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
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
`;
