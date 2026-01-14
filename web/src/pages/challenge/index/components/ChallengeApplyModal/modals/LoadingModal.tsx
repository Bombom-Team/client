import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Container } from '../ChallengeApplyModal';
import { useDevice } from '@/hooks/useDevice';

const LoadingModal = () => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  return (
    <Container isMobile={isMobile}>
      <Spinner />
    </Container>
  );
};

export default LoadingModal;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${({ theme }) => theme.colors.dividers};
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;

  animation: ${spin} 0.8s linear infinite;
`;
