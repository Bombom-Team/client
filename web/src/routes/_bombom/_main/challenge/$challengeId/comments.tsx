import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_bombom/_main/challenge/$challengeId/comments',
)({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 챌린지 한 줄 코멘트',
      },
    ],
  }),
  component: ChallengeComments,
});

function ChallengeComments() {
  return (
    <Container>
      <Content>
        <Title>댓글</Title>
        <Placeholder>
          챌린지 댓글 내용이 여기에 표시됩니다.
          <br />
          참여자들과 소통하고 응원 메시지를 남길 수 있습니다.
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
