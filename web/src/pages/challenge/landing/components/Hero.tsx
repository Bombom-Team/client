import { theme } from '@bombom/shared';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import Button from '@/components/Button/Button';
import Flex from '@/components/Flex';
import ArrowIcon from '@/components/icons/ArrowIcon';
import { useDevice, type Device } from '@/hooks/useDevice';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import type { MouseEvent } from 'react';

interface HeroProps {
  challengeName: string;
  generation: number;
  onApply: (e: MouseEvent) => void;
}

const Hero = ({ challengeName, generation, onApply }: HeroProps) => {
  const device = useDevice();

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
    <Container device={device}>
      <IframeBackground
        src="https://my.spline.design/textfromballoonswithinteractiveanimation-itpCNbfREzmECA7s8G4nFAHi/"
        title="3D Background Animation"
        width="80%"
        height="80%"
      />

      <SplineButtonCover />

      <ContentWrapper device={device}>
        <GenerationBadge
          device={device}
        >{`봄봄 뉴스레터 챌린지 ${generation}기`}</GenerationBadge>

        <Description device={device}>
          매일 뉴스레터 한 편을 읽고 감상을 남기는 한 달 간의 여정.{'\n'}
          혼자가 아닌, <Highlight>함께 읽는 즐거움</Highlight>을 경험하세요.
        </Description>

        <Flex direction="column" gap={device === 'mobile' ? 4 : 8}>
          <PriceBox device={device}>
            <OriginalPrice device={device}>정가 ₩24,000</OriginalPrice>
            <ArrowIcon
              direction="right"
              color={theme.colors.primary}
              width={device === 'mobile' ? 24 : 32}
              height={device === 'mobile' ? 24 : 32}
            />
            <FreePrice device={device}>무료</FreePrice>
          </PriceBox>
          <DiscountLabel device={device}>
            {generation}기 특별 할인!
          </DiscountLabel>
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

      <BottomFade />
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
  min-height: ${({ device }) => (device === 'mobile' ? '90vh' : '95vh')};
  padding: ${({ theme, device }) =>
    `calc(${device === 'pc' ? theme.heights.headerPC : theme.heights.headerMobile} + 12px) 24px 96px`};

  display: flex;
  gap: 12px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const IframeBackground = styled.iframe`
  position: absolute;
  top: -20%;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  border: none;

  pointer-events: none;
`;

const SplineButtonCover = styled.div`
  position: absolute;
  right: 20px;
  bottom: 20%;
  z-index: ${({ theme }) => theme.zIndex.floating};
  width: 200px;
  height: 60px;

  background: #fffcfb;
`;

const ContentWrapper = styled.div<{ device: Device }>`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.elevated};
  width: 100%;
  max-width: 1152px;
  margin: 0 auto;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '24px' : '60px')};
  flex-direction: column;
  align-items: center;

  text-align: center;
`;

const GenerationBadge = styled.div<{ device: Device }>`
  position: relative;
  margin: ${({ device }) => (device === 'mobile' ? '24px 0' : '32px 0')};
  padding: ${({ device }) => (device === 'mobile' ? '12px 20px' : '16px 32px')};
  border-radius: 32px;
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
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.body1};
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
  max-width: 672px;
  margin-top: ${({ device }) => (device === 'mobile' ? '120px' : '420px')};

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading5 : theme.fonts.heading3};
  font-weight: 500;

  text-shadow:
    0 0 30px rgb(255 255 255 / 90%),
    0 0 15px rgb(255 255 255 / 80%),
    0 3px 10px rgb(0 0 0 / 25%),
    0 1px 3px rgb(0 0 0 / 20%);

  -webkit-text-stroke: 0.3px rgb(0 0 0 / 8%);
`;

const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const PriceBox = styled.div<{ device: Device }>`
  border-radius: 12px;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '8px' : '12px')};
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  text-shadow:
    0 0 30px rgb(255 255 255 / 100%),
    0 0 60px rgb(255 255 255 / 90%),
    0 0 80px rgb(255 255 255 / 70%),
    0 4px 8px rgb(0 0 0 / 20%);
`;

const OriginalPrice = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.bodyLarge : theme.fonts.heading4};
  font-weight: 500;

  opacity: 0.7;
  text-decoration: line-through;
`;

const FreePrice = styled.span<{ device: Device }>`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.bodyLarge : theme.fonts.heading1};
  font-weight: 900;
`;

const DiscountLabel = styled.span<{ device: Device }>`
  color: ${({ theme }) => theme.colors.primaryDark};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.body1};
  font-weight: 600;
`;

const ApplicantButton = styled(Button)<{ device: Device }>`
  margin-top: ${({ device }) => (device === 'mobile' ? '12px' : '24px')};
  padding: ${({ device }) => (device === 'mobile' ? '16px 24px' : '20px 36px')};

  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading4};
`;

const BottomFade = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 160px;

  background: linear-gradient(
    to top,
    ${({ theme }) => theme.colors.white},
    transparent
  );
`;
