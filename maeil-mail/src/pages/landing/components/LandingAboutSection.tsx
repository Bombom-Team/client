import styled from '@emotion/styled';
import type { RefObject } from 'react';
import {
  FEATURE_ITEMS,
  FLOW_PATH_POINTS,
} from '@/pages/landing/constants/landingContent';

type LandingAboutSectionProps = {
  aboutProgress: number;
  visible: boolean;
  sectionRef: RefObject<HTMLElement | null>;
};

const clampValue = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const LandingAboutSection = ({
  aboutProgress,
  visible,
  sectionRef,
}: LandingAboutSectionProps) => {
  return (
    <Container id="about" ref={sectionRef} $visible={visible}>
      <SectionKicker>WHY MAEIL MAIL</SectionKicker>
      <SectionTitle $scale={1.24 - aboutProgress * 0.24}>
        스크롤로 읽는
        <br />
        매일메일 기능 흐름
      </SectionTitle>

      <FlowCanvas>
        <FlowSvg viewBox="0 0 1200 900" preserveAspectRatio="none" aria-hidden>
          <FlowBasePath d="M 140 110 C 440 170 590 220 520 310 C 420 430 260 500 330 560 C 470 680 760 700 900 760" />
          <FlowActivePath
            d="M 140 110 C 440 170 590 220 520 310 C 420 430 260 500 330 560 C 470 680 760 700 900 760"
            pathLength="1"
            $progress={aboutProgress}
          />
          {FLOW_PATH_POINTS.map((point, index) => (
            <FlowPoint
              key={`${point.x}-${point.y}`}
              cx={point.x}
              cy={point.y}
              r="7.5"
              $active={aboutProgress >= (index + 1) / FLOW_PATH_POINTS.length}
            />
          ))}
        </FlowSvg>

        {FEATURE_ITEMS.map(({ number, title, description }, index) => {
          const itemProgress = clampValue(
            (aboutProgress - index * 0.22) / 0.28,
            0,
            1,
          );

          return (
            <FlowEntry
              key={number}
              $side={index % 2 === 0 ? 'left' : 'right'}
              $top={12 + index * 22}
              $progress={itemProgress}
            >
              <FlowEntryImage>[example 이미지]</FlowEntryImage>
              <FlowEntryText>
                <FeatureNumber>{number}</FeatureNumber>
                <FeatureTitle>{title}</FeatureTitle>
                <FeatureDescription>{description}</FeatureDescription>
              </FlowEntryText>
            </FlowEntry>
          );
        })}
      </FlowCanvas>
    </Container>
  );
};

export default LandingAboutSection;

const Container = styled.section<{ $visible: boolean }>`
  max-width: 1140px;
  margin: 0 auto;
  padding: 80px 18px 120px;

  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) =>
    $visible ? 'translateY(0)' : 'translateY(24px)'};
  transition:
    opacity 460ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 460ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (width >= 920px) {
    padding: 100px 28px 150px;
  }
`;

const SectionKicker = styled.p`
  margin-bottom: 12px;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t4Regular};
  letter-spacing: 0.14em;

  opacity: 0.38;
`;

const SectionTitle = styled.h2<{ $scale: number }>`
  margin-bottom: 44px;

  font-weight: 800;
  font-size: clamp(1.8rem, 6vw, 3.5rem);
  line-height: 1.03;
  letter-spacing: -0.03em;

  transform: ${({ $scale }) => `scale(${$scale})`};
  transform-origin: left center;
`;

const FlowCanvas = styled.div`
  position: relative;
  min-height: 920px;
  margin-top: 24px;
  margin-right: calc(50% - 50vw);
  margin-left: calc(50% - 50vw);
  padding: 70px clamp(18px, 4.5vw, 84px);

  background:
    radial-gradient(
      circle at 10% 25%,
      rgb(255 255 255 / 5%) 0%,
      transparent 46%
    ),
    oklch(12% 0.004 220deg);

  @media (width <= 920px) {
    min-height: 1080px;
    padding: 40px 20px;
  }
`;

const FlowSvg = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;

  inset: 0;
`;

const FlowBasePath = styled.path`
  fill: none;
  stroke: rgb(255 255 255 / 30%);
  stroke-width: 2.2;
`;

const FlowActivePath = styled.path<{ $progress: number }>`
  fill: none;
  stroke: rgb(255 255 255 / 95%);
  stroke-dasharray: 1;
  stroke-dashoffset: ${({ $progress }) => 1 - $progress};
  stroke-linecap: round;
  stroke-width: 2.8;
  transition: stroke-dashoffset 360ms cubic-bezier(0.22, 1, 0.36, 1);
`;

const FlowPoint = styled.circle<{ $active: boolean }>`
  fill: ${({ $active }) =>
    $active ? 'rgb(255 255 255 / 95%)' : 'rgb(255 255 255 / 34%)'};
  transition: fill 180ms ease;
`;

const FlowEntry = styled.article<{
  $side: 'left' | 'right';
  $top: number;
  $progress: number;
}>`
  position: absolute;
  top: ${({ $top }) => `${$top}%`};
  ${({ $side }) => ($side === 'left' ? 'left: 6vw;' : 'right: 6vw;')}
  width: min(38vw, 420px);

  display: flex;
  gap: 10px;
  flex-direction: column;

  opacity: ${({ $progress }) => $progress};
  transform: ${({ $side, $progress }) =>
    `translateX(${($side === 'left' ? -1 : 1) * (1 - $progress) * 52}px) translateY(${(1 - $progress) * 12}px)`};
  transition:
    opacity 280ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 280ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (width <= 920px) {
    position: relative;
    top: auto;
    right: auto;
    left: auto;
    width: 100%;
    margin-bottom: 28px;

    opacity: 1;
    transform: none;
  }
`;

const FlowEntryImage = styled.div`
  min-height: 146px;
  border-radius: 14px;
  box-shadow: 0 18px 30px rgb(0 0 0 / 10%);

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    radial-gradient(
      circle at 22% 20%,
      rgb(255 255 255 / 70%) 0%,
      transparent 45%
    ),
    linear-gradient(
      135deg,
      oklch(93% 0.015 75deg) 0%,
      oklch(88% 0.03 160deg) 100%
    );
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  text-align: center;
`;

const FlowEntryText = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const FeatureNumber = styled.span`
  color: rgb(255 255 255 / 40%);
  font: ${({ theme }) => theme.fonts.t6Bold};
  letter-spacing: 0.06em;
`;

const FeatureTitle = styled.h3`
  color: rgb(255 255 255 / 96%);
  font: ${({ theme }) => theme.fonts.t7Bold};
  line-height: 1.4;
`;

const FeatureDescription = styled.p`
  color: rgb(255 255 255 / 78%);
  font: ${({ theme }) => theme.fonts.t5Regular};
  line-height: 1.72;
`;
