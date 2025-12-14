import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';

const LandingGetStartedCTA = () => {
  const device = useDevice();

  return (
    <Container device={device}>
      <ContentWrapper device={device}>
        <Title device={device}>필요한 정보만 깔끔하게</Title>
        <Description device={device}>
          흩어진 메일은 정리하고 중요한 뉴스레터에 집중해, 매일 조금씩
          성장해보세요.
        </Description>
        <GetStartedLink to="/login" device={device}>
          지금 시작하기
        </GetStartedLink>
      </ContentWrapper>
    </Container>
  );
};

export default LandingGetStartedCTA;

const Container = styled.section<{ device: Device }>`
  width: 100%;

  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div<{ device: Device }>`
  width: 100%;
  max-width: ${({ device }) => (device === 'mobile' ? '400px' : '840px')};
  padding: ${({ device }) => (device === 'mobile' ? '36px 20px' : '60px 72px')};
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgb(0 0 0 / 8%);

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '20px' : '28px')};
  flex-direction: column;
  align-items: center;

  background: rgb(255 255 255 / 40%);
  text-align: center;

  backdrop-filter: blur(20px);
`;

const Title = styled.h2<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading4 : theme.fonts.heading2};
`;

const Description = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ device, theme }) => {
    if (device === 'mobile') return theme.fonts.body3;
    return device === 'tablet' ? theme.fonts.body1 : theme.fonts.bodyLarge;
  }};
`;

const GetStartedLink = styled(Link)<{ device: Device }>`
  padding: ${({ device }) => (device === 'mobile' ? '12px 28px' : '18px 32px')};
  border: none;
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading5};

  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;
