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
    transform: translateY(-1.25rem) rotate(2deg);
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
      return `calc(${theme.heights.headerMobile} + 0.75rem) 0 0`;
    }
    return `calc(${theme.heights.headerPC} + 0.75rem) 1.5rem 6rem`;
  }};

  display: flex;
  gap: 0.75rem;
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
      ? 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 4vw, 1.25rem)'
      : '1rem 2rem'};
  border-radius: ${({ device }) =>
    device === 'mobile' ? 'clamp(1.25rem, 5vw, 2rem)' : '2rem'};
  box-shadow:
    inset 0 0.125rem 0.5rem rgb(255 255 255 / 60%),
    inset 0 -0.125rem 0.25rem rgb(255 92 0 / 10%),
    0 0.5rem 1.5rem rgb(255 92 0 / 15%),
    0 0.125rem 0.5rem rgb(255 92 0 / 8%);

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

  backdrop-filter: blur(1.25rem);
  transform: translateY(0);
  transition: all 0.3s ease;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    border-radius: 2rem 2rem 0 0;

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
      inset 0 0.125rem 0.5rem rgb(255 255 255 / 60%),
      inset 0 -0.125rem 0.25rem rgb(255 92 0 / 10%),
      0 0.75rem 2rem rgb(255 92 0 / 20%),
      0 0.25rem 0.75rem rgb(255 92 0 / 12%);
    transform: translateY(-0.25rem);
  }
`;

const Description = styled.p<{ device: Device }>`
  margin-top: ${({ device }) => {
    if (device === 'mobile') return 'min(1rem, 8vh)';
    return device === 'tablet' ? '24vh' : 'min(37.5rem, 54vh)';
  }};

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) => {
    if (device === 'mobile') return theme.fonts.body2;
    return device === 'tablet' ? theme.fonts.bodyLarge : theme.fonts.heading3;
  }};
  font-weight: 500;

  word-break: keep-all;
`;

const Highlight = styled.strong`
  color: ${({ theme }) => theme.colors.primary};
`;

const PriceBox = styled.div<{ device: Device }>`
  border-radius: 0.75rem;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '0.5rem' : '0.75rem')};
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const OriginalPrice = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.body1};

  opacity: 0.7;
  text-decoration: line-through;
`;

const FreePrice = styled.span<{ device: Device }>`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading2 : theme.fonts.heading1};
`;

const DiscountLabel = styled.span<{ device: Device }>`
  color: ${({ theme }) => theme.colors.primaryDark};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.body1};
  font-weight: 600;
`;

const ApplicantButton = styled(Button)<{ device: Device }>`
  margin-top: ${({ device }) => (device === 'mobile' ? '0.75rem' : '1.5rem')};
  padding: ${({ device }) =>
    device === 'mobile' ? '1rem 1.5rem' : '1.25rem 2.25rem'};

  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading4};
`;
