import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import Button from '@/components/Button/Button';
import { useDevice, type Device } from '@/hooks/useDevice';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import type { MouseEvent } from 'react';
import ArrowRightIcon from '#/assets/svg/arrow-right.svg';

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
      <DecorationWrapper>
        <JellySphere1 />
        <JellySphere2 />
        <JellySphere3 />
        <BackgroundGlow />
      </DecorationWrapper>

      <ContentWrapper device={device}>
        <GenerationBadge
          device={device}
        >{`봄봄 뉴스레터 챌린지 ${generation}기`}</GenerationBadge>

        <BalloonTextWrapper device={device}>
          <BalloonText device={device} data-text={challengeName}>
            {challengeName}
          </BalloonText>
        </BalloonTextWrapper>

        <Description device={device}>
          매일 뉴스레터 한 편을 읽고 감상을 남기는 한 달 간의 여정.{'\n'}
          혼자가 아닌, <Highlight>함께 읽는 즐거움</Highlight>을 경험하세요.
        </Description>

        <ApplicantButton device={device} onClick={handleApplyClick}>
          지금 참여하기
          <ArrowRightIcon />
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

const breathe = keyframes`
  0%, 100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.03) rotate(1deg);
    filter: brightness(1.1);
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
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: #fff8f4;
`;

const DecorationWrapper = styled.div`
  position: absolute;
  z-index: 0;

  inset: 0;

  pointer-events: none;
`;

const JellySphere1 = styled.div`
  position: absolute;
  top: 10%;
  left: 10%;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  box-shadow:
    inset -10px -10px 30px rgb(0 0 0 / 10%),
    inset 10px 10px 30px rgb(255 255 255 / 60%),
    0 20px 40px rgb(255 92 0 / 20%);

  background: ${({ theme }) => theme.colors.primary};
  background-image:
    radial-gradient(
      circle at 30% 30%,
      rgb(255 255 255 / 80%) 0%,
      rgb(255 255 255 / 0%) 50%
    ),
    radial-gradient(circle at 70% 70%, rgb(0 0 0 / 10%) 0%, rgb(0 0 0 / 0%) 50%);

  animation: ${floatAnimation} 8s ease-in-out infinite;

  backdrop-filter: blur(5px);

  opacity: 0.6;
`;

const JellySphere2 = styled.div`
  position: absolute;
  right: 5%;
  bottom: 15%;
  width: 192px;
  height: 192px;
  border-radius: 50%;
  box-shadow:
    inset -10px -10px 30px rgb(0 0 0 / 10%),
    inset 10px 10px 30px rgb(255 255 255 / 60%),
    0 20px 40px rgb(255 92 0 / 20%);

  background: #ffb300;
  background-image:
    radial-gradient(
      circle at 30% 30%,
      rgb(255 255 255 / 80%) 0%,
      rgb(255 255 255 / 0%) 50%
    ),
    radial-gradient(circle at 70% 70%, rgb(0 0 0 / 10%) 0%, rgb(0 0 0 / 0%) 50%);

  animation: ${floatAnimation} 5s ease-in-out infinite;

  backdrop-filter: blur(5px);

  opacity: 0.5;
`;

const JellySphere3 = styled.div`
  position: absolute;
  top: 60%;
  left: 5%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  box-shadow:
    inset -10px -10px 30px rgb(0 0 0 / 10%),
    inset 10px 10px 30px rgb(255 255 255 / 60%),
    0 20px 40px rgb(255 92 0 / 20%);

  background: #ff8a00;
  background-image:
    radial-gradient(
      circle at 30% 30%,
      rgb(255 255 255 / 80%) 0%,
      rgb(255 255 255 / 0%) 50%
    ),
    radial-gradient(circle at 70% 70%, rgb(0 0 0 / 10%) 0%, rgb(0 0 0 / 0%) 50%);

  animation: ${floatAnimation} 8s ease-in-out infinite;

  backdrop-filter: blur(5px);

  opacity: 0.4;
`;

const BackgroundGlow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 800px;
  border-radius: 50%;

  background: ${({ theme }) => theme.colors.primary};

  filter: blur(120px);
  opacity: 0.05;
  transform: translate(-50%, -50%);
`;

const ContentWrapper = styled.div<{ device: Device }>`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.elevated};
  width: 100%;
  max-width: 1152px;
  margin: 0 auto;

  display: flex;
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

const BalloonTextWrapper = styled.div<{ device: Device }>`
  position: relative;
  margin-bottom: ${({ device }) => (device === 'mobile' ? '48px' : '48px')};

  user-select: none;
`;

const BalloonText = styled.span<{ device: Device }>`
  position: relative;

  display: block;

  color: ${({ theme }) => theme.colors.primary};
  font-weight: 900;
  font-size: ${({ device }) =>
    device === 'mobile' ? '14vw' : device === 'tablet' ? '120px' : '180px'};
  line-height: 1;
  letter-spacing: -0.05em;

  animation: ${breathe} 4s ease-in-out infinite;

  text-shadow:
    1px 1px 0 ${({ theme }) => theme.colors.primaryDark},
    2px 2px 0 ${({ theme }) => theme.colors.primaryDark},
    3px 3px 15px rgb(230 83 0 / 40%),
    -2px -2px 10px rgb(255 255 255 / 80%),
    0 20px 40px rgb(230 83 0 / 20%);
  word-break: keep-all;

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;

    color: ${({ theme }) => theme.colors.primary};

    content: attr(data-text);

    filter: blur(15px);
    opacity: 0.3;
  }
`;

const Description = styled.p<{ device: Device }>`
  max-width: 672px;
  margin-top: ${({ device }) => (device === 'mobile' ? '48px' : '48px')};
  margin-bottom: ${({ device }) => (device === 'mobile' ? '64px' : '64px')};

  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 500;
  font-size: ${({ device }) => (device === 'mobile' ? '18px' : '24px')};
  line-height: 1.6;
`;

const Highlight = styled.strong`
  color: ${({ theme }) => theme.colors.primary};
`;

const ApplicantButton = styled(Button)<{ device: Device }>`
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
