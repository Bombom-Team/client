import styled from '@emotion/styled';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';
import PromptScrollIcon from '#/assets/svg/arrow-down-to-line.svg';

const LandingHero = () => {
  const device = useDevice();

  return (
    <Container device={device}>
      <TitleWrapper device={device}>
        <HeroBadge device={device}>뉴스레터 종합 플랫폼</HeroBadge>
        <Title device={device}>
          모든 뉴스레터를
          <br />
          <Highlight>한곳에 모아보세요</Highlight>
        </Title>
        <Description device={device}>
          메일함에 흩어져 있던 뉴스레터들을 한곳에 모아 쉽게 읽고,
          <br />
          소중한 정보를 더 이상 놓치지 마세요.
        </Description>
        <PromptScroll device={device}>
          스크롤하여 더 알아보기
          <PromptScrollIcon />
        </PromptScroll>
      </TitleWrapper>
    </Container>
  );
};

export default LandingHero;

const Container = styled.section<{ device: Device }>`
  width: 100%;
  min-height: 100vh;
  padding: ${({ device }) => (device === 'mobile' ? '24px 20px' : '80px 60px')};

  display: flex;
  align-items: center;
  justify-content: center;
`;

const TitleWrapper = styled.div<{ device: Device }>`
  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '20px' : '32px')};
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
`;

const HeroBadge = styled.div<{ device: Device }>`
  padding: 4px 12px;
  border: 1px solid ${({ theme }) => theme.colors.primaryLight};
  border-radius: 20px;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.body2};
`;

const Title = styled.h2<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading3 : theme.fonts.heading1};
`;

const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const Description = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.bodyLarge};
`;

const PromptScroll = styled.div<{ device: Device }>`
  display: flex;
  gap: 8px;
  flex-direction: column;
  align-items: center;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.caption : theme.fonts.body2};
`;
