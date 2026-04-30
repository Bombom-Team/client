import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

const FEATURE_ITEMS = [
  {
    number: '01',
    title: 'BE/FE 기술 면접 질문 큐레이션',
    description:
      '매일메일 팀 콘텐츠를 바탕으로 핵심 질문을 선별해 제공해요. [텍스트: 질문 선정 기준 상세]',
  },
  {
    number: '02',
    title: '봄봄 안에서 구독 · 열람',
    description:
      '개인 이메일 발송 없이 봄봄 안에서만 제공돼요. [텍스트: 구독 플로우 상세]',
  },
  {
    number: '03',
    title: '짧은 시간 복습 중심 구성',
    description:
      '출퇴근 중에도 빠르게 확인할 수 있도록 스낵형 리딩으로 구성했어요. [텍스트: 카드 타입별 예시]',
  },
  {
    number: '04',
    title: '무료 제공 + 지속 개선',
    description:
      '현재 무료로 제공되며, 봄봄 안에서 활용성을 계속 개선할 예정이에요. [텍스트: 업데이트 예정 항목]',
  },
] as const;

const FLOW_PATH_POINTS = [
  { x: 50, y: 200 },
  { x: 150, y: 400 },
  { x: 50, y: 600 },
  { x: 150, y: 800 },
] as const;

type LandingAboutSectionProps = {
  visible: boolean;
  sectionRef: RefObject<HTMLElement | null>;
};

const clampValue = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

// S-curve from center-top → left col → right col → left col → right col → center-bottom
const PATH_D =
  'M 100 0 C 80 80, 50 150, 50 200 C 50 270, 150 310, 150 400 C 150 470, 50 530, 50 600 C 50 670, 150 720, 150 800 C 150 880, 100 950, 100 1000';

const LandingAboutSection = ({
  visible,
  sectionRef,
}: LandingAboutSectionProps) => {
  const [progress, setProgress] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0,
  );

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // Start when section enters 80% down, end when bottom exits at 20% from top
      const start = vh * 0.8;
      const range = vh * 0.6 + rect.height;

      setProgress(clampValue((start - rect.top) / range, 0, 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionRef]);

  return (
    <Container id="about" ref={sectionRef} $visible={visible}>
      <HeaderArea>
        <SectionTitle scale={1.12 - progress * 0.12}>
          왜 매일메일 일까요?
        </SectionTitle>
      </HeaderArea>

      <FlowGrid>
        <FlowSvg viewBox="0 0 200 1000" preserveAspectRatio="none" aria-hidden>
          <FlowBasePath d={PATH_D} />
          <FlowActivePath d={PATH_D} pathLength="1" $progress={progress} />
          {FLOW_PATH_POINTS.map((point, index) => (
            <FlowPoint
              key={`${point.x}-${point.y}`}
              cx={point.x}
              cy={point.y}
              r="5"
              $active={progress >= (index + 1) / FLOW_PATH_POINTS.length}
            />
          ))}
        </FlowSvg>

        {FEATURE_ITEMS.map(({ number, title, description }, index) => {
          const side = index % 2 === 0 ? 'left' : 'right';
          const itemProgress = clampValue(
            (progress - index * 0.22) / 0.28,
            0,
            1,
          );
          const opacityProgress = clampValue(
            (progress - index * 0.22) / 0.12,
            0,
            1,
          );

          return (
            <FlowCard
              key={number}
              $col={(index % 2 === 0 ? 1 : 2) as 1 | 2}
              $row={index + 1}
              $side={side}
              $progress={itemProgress}
              $opacityProgress={opacityProgress}
            >
              <FlowEntryImage>[example 이미지]</FlowEntryImage>
              <FlowEntryText>
                <FeatureNumber>{number}</FeatureNumber>
                <FeatureTitle>{title}</FeatureTitle>
                <FeatureDescription>{description}</FeatureDescription>
              </FlowEntryText>
            </FlowCard>
          );
        })}
      </FlowGrid>
    </Container>
  );
};

export default LandingAboutSection;

const Container = styled.section<{ $visible: boolean }>`
  padding: 80px 0 120px;

  background:
    radial-gradient(
      circle at 15% 30%,
      rgb(255 255 255 / 4%) 0%,
      transparent 50%
    ),
    oklch(12% 0.004 220deg);

  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) =>
    $visible ? 'translateY(0)' : 'translateY(24px)'};
  transition:
    opacity 460ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 460ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (width >= 920px) {
    padding: 100px 0 150px;
  }
`;

const HeaderArea = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 clamp(18px, 3vw, 84px) 56px;
`;

const SectionTitle = styled.h2<{ scale: number }>`
  color: rgb(255 255 255 / 96%);
  font-weight: 800;
  font-size: clamp(1.8rem, 5vw, 3.2rem);
  line-height: 1.08;
  letter-spacing: -0.03em;

  transform: ${({ scale }) => `scale(${scale})`};
  transform-origin: left center;
`;

const FlowGrid = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px clamp(18px, 3vw, 60px);

  display: grid;

  grid-template-columns: 1fr 1fr;
  row-gap: 64px;

  @media (width <= 720px) {
    grid-template-columns: 1fr;
    row-gap: 40px;
  }
`;

const FlowSvg = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;

  inset: 0;

  pointer-events: none;

  @media (width <= 720px) {
    display: none;
  }
`;

const FlowBasePath = styled.path`
  fill: none;
  stroke: rgb(255 255 255 / 12%);
  stroke-width: 1.5;
`;

const FlowActivePath = styled.path<{ $progress: number }>`
  fill: none;
  stroke: rgb(255 255 255 / 80%);
  stroke-dasharray: 1;
  stroke-dashoffset: ${({ $progress }) => 1 - $progress};
  stroke-linecap: round;
  stroke-width: 2;
`;

const FlowPoint = styled.circle<{ $active: boolean }>`
  fill: ${({ $active }) =>
    $active ? 'rgb(255 255 255 / 90%)' : 'rgb(255 255 255 / 20%)'};
`;

const FlowCard = styled.article<{
  $col: 1 | 2;
  $row: number;
  $side: 'left' | 'right';
  $progress: number;
  $opacityProgress: number;
}>`
  padding: ${({ $col }) => ($col === 1 ? '0 18% 0 0' : '0 0 0 18%')};

  display: flex;
  gap: 12px;
  flex-direction: column;

  grid-column: ${({ $col }) => $col};
  grid-row: ${({ $row }) => $row};

  opacity: ${({ $opacityProgress }) => $opacityProgress};
  transform: ${({ $side, $progress }) =>
    `translateX(${($side === 'left' ? -1 : 1) * (1 - $progress) * 28}px)`};
  transition:
    opacity 360ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 360ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (width <= 720px) {
    padding: 0;

    grid-column: 1;
    opacity: 1;
    transform: none;
  }
`;

const FlowEntryImage = styled.div`
  min-height: 220px;
  border-radius: 14px;
  box-shadow: 0 20px 40px rgb(0 0 0 / 20%);

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
  gap: 10px;
  flex-direction: column;
`;

const FeatureNumber = styled.span`
  color: rgb(255 255 255 / 35%);
  font: ${({ theme }) => theme.fonts.t6Bold};
  letter-spacing: 0.06em;
`;

const FeatureTitle = styled.h3`
  color: rgb(255 255 255 / 96%);
  font: ${({ theme }) => theme.fonts.t7Bold};
  line-height: 1.4;
`;

const FeatureDescription = styled.p`
  color: rgb(255 255 255 / 72%);
  font: ${({ theme }) => theme.fonts.t5Regular};
  line-height: 1.72;
`;
