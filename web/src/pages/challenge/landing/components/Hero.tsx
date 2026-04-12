import { theme } from '@bombom/shared';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import Button from '@/components/Button/Button';
import Flex from '@/components/Flex';
import ArrowIcon from '@/components/icons/ArrowIcon';
import { useDevice, type Device } from '@/hooks/useDevice';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import { useScrollVisible } from '@/pages/landing/hooks/useScrollVisible';
import type { MouseEvent } from 'react';

interface HeroProps {
  challengeName: string;
  generation: number;
  onApply: (e: MouseEvent) => void;
}

const Hero = ({ challengeName, generation, onApply }: HeroProps) => {
  const device = useDevice();
  const { visibleRef, isVisible } = useScrollVisible(0.3);

  const handleApplyClick = (e: MouseEvent) => {
    e.stopPropagation();
    onApply(e);

    trackEvent({
      category: 'Challenge',
      action: '신청하기 버튼 클릭',
      label: challengeName,
    });
  };

  return (
    <Container device={device} ref={visibleRef}>
      <BackgroundImage device={device} />

      <GenerationBadge
        device={device}
      >{`봄봄 뉴스레터 챌린지 ${generation}기`}</GenerationBadge>
      <ContentWrapper device={device} isVisible={isVisible}>
        <Flex direction="column" gap={device === 'mobile' ? 24 : 60}>
          <Description device={device}>
            매일 뉴스레터 한 편을 읽고 감상을 남기는 30일의 여정.{'\n'}
            혼자가 아닌, <Highlight>함께 읽는 즐거움</Highlight>을 경험하세요.
          </Description>

          <Flex direction="column" gap={device === 'mobile' ? 4 : 8}>
            <PriceBox device={device}>
              <OriginalPrice device={device}>정가 ₩24,900</OriginalPrice>
              <ArrowIcon
                direction="right"
                color={theme.colors.textSecondary}
                width={device === 'mobile' ? 16 : 32}
                height={device === 'mobile' ? 16 : 32}
              />
              <FreePrice device={device}>무료</FreePrice>
            </PriceBox>
            <DiscountLabel device={device}>
              {generation}기 특별 할인!
            </DiscountLabel>
          </Flex>
        </Flex>

        <ApplicantButton device={device} onClick={handleApplyClick}>
          지금 참여하기
          <ArrowIcon
            direction="right"
            color={theme.colors.white}
            width={device === 'mobile' ? 24 : 32}
            height={device === 'mobile' ? 24 : 32}
          />
        </ApplicantButton>
      </ContentWrapper>
    </Container>
  );
};

export default Hero;

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(2deg);
  }
`;

const Container = styled.section<{ device: Device }>`
  overflow: hidden;
  position: relative;
  width: 100%;
  min-height: ${({ device }) => (device === 'mobile' ? '100vh' : '95vh')};
  margin-bottom: ${({ device }) => (device === 'pc' ? '16vh' : '0')};
  padding: ${({ theme, device }) => {
    if (device === 'mobile') {
      return `calc(${theme.heights.headerMobile} + 12px) 0 0`;
    }
    return `calc(${theme.heights.headerPC} + 12px) 24px 96px`;
  }};

  display: flex;
  gap: 12px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BackgroundImage = styled.div<{ device: Device }>`
  position: absolute;
  top: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex.base};
  width: 100%;
  height: 100%;

  background-image: url('/assets/png/challenge.png');
  background-position: center
    ${({ device }) => (device === 'mobile' ? '20%' : '15%')};
  background-repeat: no-repeat;
  background-size: ${({ device }) =>
    device === 'mobile' ? '120%' : 'contain'};

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    z-index: ${({ theme }) => theme.zIndex.content};
    width: 100%;
    height: 100%;

    content: '';
    pointer-events: none;
  }
`;

const ContentWrapper = styled.div<{ device: Device; isVisible: boolean }>`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.elevated};
  width: 100%;
  max-width: 1084px;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;

  animation: ${({ isVisible }) =>
    isVisible ? 'fade-in 0.6s ease forwards' : 'none'};

  opacity: 0;

  @keyframes fade-in {
    to {
      opacity: 1;
    }
  }
`;

const GenerationBadge = styled.div<{ device: Device }>`
  position: absolute;
  top: ${({ theme, device }) =>
    `calc(${device === 'pc' ? theme.heights.headerPC : theme.heights.headerMobile} + 4vh)`};
  padding: ${({ device }) =>
    device === 'mobile'
      ? 'clamp(12px, 2vw, 16px) clamp(16px, 4vw, 20px)'
      : '16px 32px'};
  border-radius: ${({ device }) =>
    device === 'mobile' ? 'clamp(20px, 5vw, 32px)' : '32px'};
  box-shadow:
    inset 0 2px 8px rgb(255 255 255 / 60%),
    inset 0 -2px 4px rgb(255 92 0 / 10%),
    0 8px 24px rgb(255 92 0 / 15%),
    0 2px 8px rgb(255 92 0 / 8%);

  background: linear-gradient(
    135deg,
    rgb(255 255 255 / 95%) 0%,
    rgb(255 248 244 / 90%) 100%
  );
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body4 : theme.fonts.body1};
  font-weight: 700;

  animation: ${floatAnimation} 6s ease-in-out infinite;

  backdrop-filter: blur(20px);
  transform: translateY(0);
  transition: all 0.3s ease;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    border-radius: 32px 32px 0 0;

    background: linear-gradient(
      180deg,
      rgb(255 255 255 / 40%) 0%,
      transparent 100%
    );

    content: '';
    pointer-events: none;
  }

  &:hover {
    box-shadow:
      inset 0 2px 8px rgb(255 255 255 / 60%),
      inset 0 -2px 4px rgb(255 92 0 / 10%),
      0 12px 32px rgb(255 92 0 / 20%),
      0 4px 12px rgb(255 92 0 / 12%);
    transform: translateY(-4px);
  }
`;

const Description = styled.p<{ device: Device }>`
  margin-top: ${({ device }) => {
    if (device === 'mobile') return 'min(16px, 8vh)';
    return device === 'tablet' ? '24vh' : 'min(600px, 54vh)';
  }};

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading3};
  font-weight: 500;

  word-break: keep-all;
`;

const Highlight = styled.strong`
  color: ${({ theme }) => theme.colors.primary};
`;

const PriceBox = styled.div<{ device: Device }>`
  border-radius: 12px;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '8px' : '12px')};
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const OriginalPrice = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body4 : theme.fonts.body1};

  opacity: 0.7;
  text-decoration: line-through;
`;

const FreePrice = styled.span<{ device: Device }>`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.heading1};
`;

const DiscountLabel = styled.span<{ device: Device }>`
  color: ${({ theme }) => theme.colors.primaryDark};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body4 : theme.fonts.body1};
  font-weight: 600;
`;

const ApplicantButton = styled(Button)<{ device: Device }>`
  margin-top: ${({ device }) => (device === 'mobile' ? '12px' : '24px')};
  padding: ${({ device }) => (device === 'mobile' ? '16px 24px' : '20px 36px')};

  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading4};
`;
