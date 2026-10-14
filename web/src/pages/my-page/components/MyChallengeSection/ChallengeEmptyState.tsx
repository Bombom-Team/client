import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import Button from '@/components/Button/Button';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';

interface ChallengeEmptyStateProps {
  emoji: string;
  title: string;
  description: string;
  showGoToChallengeButton?: boolean;
}

const ChallengeEmptyState = ({
  emoji,
  title,
  description,
  showGoToChallengeButton = true,
}: ChallengeEmptyStateProps) => {
  const navigate = useNavigate();
  const device = useDevice();

  return (
    <Container device={device}>
      <Left device={device}>
        <Emoji device={device}>{emoji}</Emoji>
        <TextGroup>
          <Title device={device}>{title}</Title>
          <Description device={device}>{description}</Description>
        </TextGroup>
      </Left>
      {showGoToChallengeButton && (
        <GoToChallengeButton
          variant="filled"
          onClick={() => navigate({ to: '/challenge' })}
        >
          챌린지 둘러보기
        </GoToChallengeButton>
      )}
    </Container>
  );
};

export default ChallengeEmptyState;

const Container = styled.div<{ device: Device }>`
  width: 100%;
  padding: ${({ device }) => (device === 'pc' ? '24px 28px' : '16px')};
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: ${({ device }) => (device === 'pc' ? '16px' : '12px')};

  display: flex;
  gap: ${({ device }) => (device === 'pc' ? '20px' : '12px')};
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  box-sizing: border-box;
`;

const Left = styled.div<{ device: Device }>`
  min-width: 0;

  display: flex;
  gap: ${({ device }) => (device === 'pc' ? '20px' : '12px')};
  align-items: center;
`;

const Emoji = styled.span<{ device: Device }>`
  flex-shrink: 0;
  font-size: ${({ device }) => (device === 'pc' ? '3.5rem' : '2rem')};
`;

const TextGroup = styled.div`
  min-width: 0;

  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const Title = styled.p<{ device: Device }>`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'pc' ? theme.fonts.t7Bold : theme.fonts.t5Bold};
`;

const Description = styled.p<{ device: Device }>`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'pc' ? theme.fonts.t5Regular : theme.fonts.t4Regular};
`;

const GoToChallengeButton = styled(Button)`
  word-break: keep-all;
`;
