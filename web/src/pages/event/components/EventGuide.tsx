import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useDevice, type Device } from '@/hooks/useDevice';
import AppleIcon from '#/assets/svg/apple.svg';
import GoogleIcon from '#/assets/svg/google.svg';
import PointerIcon from '#/assets/svg/pointer.svg';

const EventGuide = () => {
  const device = useDevice();

  return (
    <Container>
      <SectionHeader>
        <Title>응모 방법</Title>
      </SectionHeader>

      <StepWrapper>
        <StepCard>
          <StepBadge>STEP 1.</StepBadge>
          <Description device={device}>
            <StepHighlight>[로그인]</StepHighlight> 버튼을 눌러 회원가입 하러
            가기
          </Description>
          <LoginButtonExample>
            로그인{' '}
            <PointerIcon width={20} height={20} fill={theme.colors.white} />
          </LoginButtonExample>
        </StepCard>

        <StepCard>
          <StepBadge>STEP 2.</StepBadge>
          <Description device={device}>
            <StepHighlight>[간편한 소셜 로그인으로]</StepHighlight> 회원가입
            하기
          </Description>
          <StepIllustration>
            <IllustrationBox>
              <WhiteBox>
                <GoogleIcon
                  width={device === 'mobile' ? 24 : 32}
                  height={device === 'mobile' ? 24 : 32}
                />
                <AppleIcon
                  width={device === 'mobile' ? 24 : 32}
                  height={device === 'mobile' ? 24 : 32}
                />
              </WhiteBox>
            </IllustrationBox>
          </StepIllustration>
        </StepCard>

        <StepCard>
          <StepBadge>STEP 3.</StepBadge>
          <Description device={device}>
            가입완료!{'\n'}이벤트 페이지 상단의{' '}
            <StepHighlight>[선착순 경품받기]</StepHighlight>
            {'\n'}
            버튼을 눌러 응모하면 끝!
          </Description>
          <ApplyButtonExample>
            선착순 경품 받기
            <PointerIcon width={20} height={20} fill={theme.colors.white} />
          </ApplyButtonExample>
        </StepCard>
      </StepWrapper>
    </Container>
  );
};

export default EventGuide;

const Container = styled.section`
  width: 100%;
  padding: 64px 24px 68px;
  border-bottom: 4px solid ${({ theme }) => theme.colors.black};

  display: flex;
  gap: 40px;
  flex-direction: column;
  align-items: center;

  background-color: #fff59d;
`;

const SectionHeader = styled.div`
  width: 100%;
  padding-bottom: 12px;
  border-bottom: 4px solid ${({ theme }) => theme.colors.black};

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading2};
  text-align: center;
`;

const StepWrapper = styled.div`
  width: 100%;
  max-width: 448px;

  display: flex;
  gap: 32px;
  flex-direction: column;
`;

const StepCard = styled.div`
  position: relative;
  width: 100%;
  padding: 36px 28px 28px;
  border: 4px solid ${({ theme }) => theme.colors.black};
  border-radius: 16px;
  box-shadow: 4px 4px 0 0 ${({ theme }) => theme.colors.black};

  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.white};
`;

const StepBadge = styled.div`
  position: absolute;
  top: -16px;
  left: 50%;
  padding: 4px 16px;
  border-radius: 32px;

  background-color: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.heading6};
  font-weight: 700;

  transform: translateX(-50%);
`;

const Description = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body1 : theme.fonts.heading6};
  font-weight: 700;
  text-align: center;
`;

const StepHighlight = styled.span`
  padding: 2px 4px 0;
  border-bottom: 2px solid ${({ theme }) => theme.colors.black};

  background-color: #fef08a;
  text-align: center;
`;

const LoginButtonExample = styled.div`
  padding: 12px 16px;
  border: 2px solid ${({ theme }) => theme.colors.black};
  border-radius: 24px;

  display: flex;
  gap: 4px;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.heading6};
  text-align: center;
`;

const ApplyButtonExample = styled.div`
  padding: 12px 20px;
  border: 2px solid ${({ theme }) => theme.colors.black};
  border-radius: 24px;

  display: flex;
  gap: 4px;
  align-items: center;

  background-color: #d81b60;
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.heading6};
  text-align: center;

  transform: rotate(2deg);
`;

const StepIllustration = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const IllustrationBox = styled.div`
  padding: 12px;
  border: 2px solid ${({ theme }) => theme.colors.black};
  border-radius: 12px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.dividers};
`;

const WhiteBox = styled.div`
  padding: 12px 24px;
  border: 2px solid ${({ theme }) => theme.colors.black};
  border-radius: 12px;

  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};
`;
