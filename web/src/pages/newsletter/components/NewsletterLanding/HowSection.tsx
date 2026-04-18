import styled from '@emotion/styled';
import Flex from '@/components/Flex';

interface Props {
  isMobile: boolean;
}

const HowSection = ({ isMobile }: Props) => {
  return (
    <Container isMobile={isMobile}>
      <HowHead>
        <HowTitle>봄봄에서 구독하고, 봄봄에서 읽어요</HowTitle>
        <HowDesc>
          매일메일은 <strong>봄봄으로 제공되는 콘텐츠</strong>예요. 별도의
          이메일 주소로 발송되지 않아요.
        </HowDesc>
      </HowHead>

      <HowSteps isMobile={isMobile}>
        <Step>
          <StepHeader>
            <ItemNumber isMobile={isMobile}>1</ItemNumber>
            <StepTitle>봄봄에서 구독해요</StepTitle>
          </StepHeader>
          <StepDescription>
            봄봄 계정으로 매일메일을 구독해요.
            <br />
            봄봄 유저라면 이메일을 따로 입력하지 않아도 돼요.
          </StepDescription>
        </Step>
        <Step>
          <StepHeader>
            <ItemNumber isMobile={isMobile}>2</ItemNumber>
            <StepTitle>봄봄이 알려드려요</StepTitle>
          </StepHeader>
          <StepDescription>
            새 매일메일이 도착하면 놓치지 않도록 앱 알림으로 알려드려요.
          </StepDescription>
          <Caption>* 아티클 알림을 허용한 모바일 앱 유저에 한함.</Caption>
        </Step>
        <Step>
          <StepHeader>
            <ItemNumber isMobile={isMobile}>3</ItemNumber>
            <StepTitle>봄봄에서 읽어요</StepTitle>
          </StepHeader>
          <StepDescription>
            기존의 매일메일처럼 봄봄에서 질문을 읽고 정답을 확인할 수 있어요.
          </StepDescription>
        </Step>
      </HowSteps>
    </Container>
  );
};

export default HowSection;

const Container = styled.section<{ isMobile: boolean }>`
  padding: ${({ isMobile }) => (isMobile ? '40px 24px' : '56px 40px')};
`;

const HowHead = styled.div`
  margin-bottom: 40px;
  text-align: center;
`;

const HowTitle = styled.h2`
  margin: 0 0 10px;

  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 800;
  font-size: 1.875rem;
  line-height: 1.4;
`;

const HowDesc = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body1};
`;

const HowSteps = styled.div<{ isMobile: boolean }>`
  display: grid;
  gap: 16px;

  grid-template-columns: ${({ isMobile }) =>
    isMobile ? '1fr' : '1fr 1fr 1fr'};
`;

const Step = styled.div`
  padding: 24px;
  border: 1px solid rgb(255 255 255 / 60%);
  border-radius: 20px;
  box-shadow: 0 4px 16px rgb(0 0 0 / 5%);

  background: rgb(255 255 255 / 80%);

  backdrop-filter: blur(12px);
`;

const StepHeader = styled(Flex)`
  margin-bottom: 12px;

  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
`;

const ItemNumber = styled.span<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '28px' : '32px')};
  height: ${({ isMobile }) => (isMobile ? '28px' : '32px')};
  border-radius: 50%;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.heading5};
`;

const StepTitle = styled.h4`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading6};
`;

const StepDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body1};
`;

const Caption = styled.p`
  margin-top: 8px;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body3};
  text-align: left;
`;
