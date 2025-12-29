import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';

export const Route = createFileRoute(
  '/_bombom/_main/challenge/$challengeId/dashboard',
)({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 챌린지 대시보드',
      },
    ],
  }),
  component: ChallengeDashboard,
});

function ChallengeDashboard() {
  const device = useDevice();

  return (
    <Container device={device}>
      <Content>
        <Title>대시보드</Title>
        <Placeholder>
          챌린지 대시보드 내용이 여기에 표시됩니다.
          <br />
          전체 진행 상황과 통계, 리더보드 등을 확인할 수 있습니다.
        </Placeholder>
      </Content>
    </Container>
  );
}

const Container = styled.div<{ device: Device }>`
  width: 100%;
`;

const Content = styled.div`
  width: 100%;
  padding: 32px;
  border: 1px solid ${({ theme }) => theme.colors.dividers};
  border-radius: 16px;

  display: flex;
  gap: 24px;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};

  box-sizing: border-box;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading3};
`;

const Placeholder = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body1};
  line-height: 1.6;
`;
