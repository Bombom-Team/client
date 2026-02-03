import styled from '@emotion/styled';
import Text from '@/components/Text';
import { useDevice, type Device } from '@/hooks/useDevice';

const ParticipationGuide = () => {
  const device = useDevice();

  return (
    <Container device={device}>
      <Title device={device}>챌린지 참여 방법</Title>
      <StepWrapper device={device}>
        <Step>
          <StepNumber device={device}>1</StepNumber>
          <StepContent>
            <StepTitle device={device}>하루 한 개 뉴스레터를 읽어요</StepTitle>
            <StepDescription device={device}>
              뉴스레터 보관함의 아티클 하나를 골라 끝까지 읽어주세요.
            </StepDescription>
          </StepContent>
        </Step>
        <Step>
          <StepNumber device={device}>2</StepNumber>
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

const Step = styled.article`
  padding: 20px 24px;
  border-radius: 16px;

  display: flex;
  gap: 8px;

  background-color: ${({ theme }) => theme.colors.white};
`;

const StepNumber = styled.span<{ device: Device }>`
  width: ${({ device }) => (device === 'mobile' ? '28px' : '32px')};
  height: ${({ device }) => (device === 'mobile' ? '28px' : '32px')};
  margin-top: 2px;
  border-radius: 50%;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading5};
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
