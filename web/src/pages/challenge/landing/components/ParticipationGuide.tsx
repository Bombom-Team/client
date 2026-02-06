import styled from '@emotion/styled';
import Text from '@/components/Text';
import { useDevice, type Device } from '@/hooks/useDevice';
import { useScrollVisible } from '@/pages/landing/hooks/useScrollVisible';

const ParticipationGuide = () => {
  const device = useDevice();
  const { visibleRef, isVisible } = useScrollVisible(0.3);

  return (
    <Container ref={visibleRef} device={device}>
      <Title device={device}>챌린지 참여 방법</Title>
      <StepWrapper device={device}>
        <Step isVisible={isVisible}>
          <StepNumber device={device}>Step 1.</StepNumber>
          <StepContent>
            <StepTitle device={device}>하루 한 개 뉴스레터를 읽어요</StepTitle>
            <StepDescription device={device}>
              뉴스레터 보관함의 아티클 하나를 골라 끝까지 읽어주세요.
            </StepDescription>
          </StepContent>
        </Step>
        <Step isVisible={isVisible}>
          <StepNumber device={device}>Step 2.</StepNumber>
          <StepContent>
            <StepTitle device={device}>코멘트를 작성해요</StepTitle>
            <StepDescription device={device}>
              인상 깊었던 점이나 내 생각을 코멘트로 남겨요.{'\n'}다른 유저의
              생각을 엿보고 좋아요로 공감을 표현할 수도 있어요!
            </StepDescription>
          </StepContent>
        </Step>
      </StepWrapper>
      <Text
        color="textPrimary"
        font={device === 'mobile' ? 'body1' : 'bodyLarge'}
      >
        챌린지 기간의 80%를 달성하면 성공!
      </Text>
    </Container>
  );
};

export default ParticipationGuide;

const Container = styled.section<{ device: Device }>`
  width: 100%;
  max-width: ${({ device }) => (device === 'pc' ? '1084px' : '100%')};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '24px' : '32px')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading4 : theme.fonts.heading2};
  text-align: center;
`;

const StepWrapper = styled.div<{ device: Device }>`
  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '16px' : '24px')};
  flex-direction: ${({ device }) => (device === 'mobile' ? 'column' : 'row')};
`;

const Step = styled.article<{ isVisible: boolean }>`
  padding: 20px 24px;
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgb(0 0 0 / 8%);

  display: flex;
  gap: 8px;

  background: rgb(255 255 255 / 40%);

  animation: ${({ isVisible }) => isVisible && `fade-in-up 1s ease forwards`};

  backdrop-filter: blur(20px);
  opacity: 0;

  transform: translate3d(0, 40px, 0);

  @keyframes fade-in-up {
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
`;

const StepNumber = styled.span<{ device: Device }>`
  display: flex;
  flex-shrink: 0;
  align-items: flex-start;
  justify-content: center;

  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading4};
  white-space: nowrap;
`;

const StepContent = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const StepTitle = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading4};
`;

const StepDescription = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.bodyLarge};
`;
