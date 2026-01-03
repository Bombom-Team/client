import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_bombom/_main/challenge/$challengeId/daily',
)({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 챌린지 데일리 가이드',
      },
    ],
  }),
  component: ChallengeDaily,
});

function ChallengeDaily() {
  return (
    <Container>
      <Content>
        <Title>일일 기록</Title>
        <Placeholder>
          챌린지 일일 기록 내용이 여기에 표시됩니다.
          <br />
          매일의 독서 기록과 진행 상황을 확인할 수 있습니다.
        </Placeholder>
      </Content>
    </Container>
  );
}

const Container = styled.div`
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
