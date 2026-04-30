import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { useDevice } from '@bombom/shared/ui-web';
import maeilmailQuestionImage from '@/assets/avif/maeilmail-question.avif';
import myAnswerImage from '@/assets/avif/my-answer.avif';
import maeilmailAnswerImage from '@/assets/avif/maeilmail-answer.avif';

const FEATURE_ITEMS = [
  {
    title: '매일 새로운 기술 질문을 만나요',
    description:
      'BE/FE 핵심 기술 질문을 매일 받아볼 수 있어요. \n 짧고 명확하게 설계된 질문으로 학습 루틴을 만들어가세요.',
    image: maeilmailQuestionImage,
    imageOffset: 0,
    imageScale: 1,
  },
  {
    title: '정답 전에 내 생각을 먼저 정리해요',
    description:
      '먼저 생각을 글로 정리한 뒤 정답과 비교하는 하는 연습을 해요.\n 기억 유지와 실전 응답력이 함께 올라가요.',
    image: myAnswerImage,
    imageOffset: -40,
    imageScale: 1.2,
  },
  {
    title: '정답을 확인하고 개념을 완성해요',
    description:
      '작성한 답변과 정답을 비교하며 부족한 개념을 채워나가세요. \n 반복 학습으로 면접 대비 실력을 완성해요.',
    image: maeilmailAnswerImage,
    imageOffset: -40,
    imageScale: 1.2,
  },
] as const;

const FLOW_PATH_POINTS = [
  { desktopX: 50, mobileX: 100, y: 250 },
  { desktopX: 150, mobileX: 100, y: 500 },
  { desktopX: 50, mobileX: 100, y: 750 },
] as const;

const DESKTOP_PATH =
  'M 100 0 C 80 80, 50 170, 50 250 C 50 330, 150 420, 150 500 C 150 580, 50 670, 50 750 C 50 840, 100 930, 100 1000';
const MOBILE_PATH = 'M 100 0 L 100 1000';

type LandingAboutSectionProps = {
  visible: boolean;
  sectionRef: RefObject<HTMLElement | null>;
};

const clampValue = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const LandingAboutSection = ({
  visible,
  sectionRef,
}: LandingAboutSectionProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

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
      const start = vh * 0.8;
      const range = vh * 0.6 + rect.height;

      setProgress(clampValue((start - rect.top) / range, 0, 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionRef]);

  const svgPath = isMobile ? MOBILE_PATH : DESKTOP_PATH;

  return (
    <Container
      id="about"
      ref={sectionRef}
      visible={visible}
      isMobile={isMobile}
    >
      <HeaderArea>
        <SectionTitle scale={1.12 - progress * 0.12}>
          왜 매일메일 일까요?
        </SectionTitle>
      </HeaderArea>

      <FlowGrid isMobile={isMobile}>
        <FlowSvg viewBox="0 0 200 1000" preserveAspectRatio="none" aria-hidden>
          <FlowBasePath d={svgPath} />
          <FlowActivePath d={svgPath} pathLength="1" $progress={progress} />
          {FLOW_PATH_POINTS.map((point, index) => (
            <FlowPoint
              key={point.y}
              cx={isMobile ? point.mobileX : point.desktopX}
              cy={point.y}
              r="5"
              $active={progress >= (index + 1) / FLOW_PATH_POINTS.length}
            />
          ))}
        </FlowSvg>

        {FEATURE_ITEMS.map(
          ({ title, description, image, imageOffset, imageScale }, index) => {
            const side = index % 2 === 0 ? 'left' : 'right';
            const itemProgress = isMobile
              ? 1
              : clampValue((progress - index * 0.22) / 0.28, 0, 1);
            const opacityProgress = isMobile
              ? 1
              : clampValue((progress - index * 0.22) / 0.12, 0, 1);

            return (
              <FlowCard
                key={title}
                col={(index % 2 === 0 ? 1 : 2) as 1 | 2}
                row={index + 1}
                side={side}
                isMobile={isMobile}
                progress={itemProgress}
                opacityProgress={opacityProgress}
              >
                <FlowEntryImage
                  src={image}
                  alt={title}
                  imageOffset={isMobile ? 0 : imageOffset}
                  imageScale={isMobile ? 1 : imageScale}
                />
                <FlowEntryText>
                  <FeatureTitle>{title}</FeatureTitle>
                  <FeatureDescription>{description}</FeatureDescription>
                </FlowEntryText>
              </FlowCard>
            );
          },
        )}
      </FlowGrid>
    </Container>
  );
};

export default LandingAboutSection;

const Container = styled.section<{ visible: boolean; isMobile: boolean }>`
  padding: ${({ isMobile }) => (isMobile ? '60px 0 80px' : '100px 0 150px')};

  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: ${({ visible }) =>
    visible ? 'translateY(0)' : 'translateY(24px)'};
  transition:
    opacity 460ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 460ms cubic-bezier(0.22, 1, 0.36, 1);
`;

const HeaderArea = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 clamp(18px, 3vw, 84px) 56px;
`;

const SectionTitle = styled.h2<{ scale: number }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t13Bold};
  font-size: clamp(1.8rem, 5vw, 3.2rem);
  line-height: 1.08;
  letter-spacing: -0.03em;

  transform: ${({ scale }) => `scale(${scale})`};
  transform-origin: left center;
`;

const FlowGrid = styled.div<{ isMobile: boolean }>`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px clamp(18px, 3vw, 60px);

  display: grid;
  gap: 0;

  grid-template-columns: ${({ isMobile }) => (isMobile ? '1fr' : '1fr 1fr')};
  row-gap: ${({ isMobile }) => (isMobile ? '48px' : '64px')};
`;

const FlowSvg = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;

  inset: 0;

  pointer-events: none;
`;

const FlowBasePath = styled.path`
  fill: none;
  stroke: ${({ theme }) => theme.colors.dividers};
  stroke-width: 1.5;
`;

const FlowActivePath = styled.path<{ $progress: number }>`
  fill: none;
  stroke: ${({ theme }) => theme.colors.stroke};
  stroke-dasharray: 1;
  stroke-dashoffset: ${({ $progress }) => 1 - $progress};
  stroke-linecap: round;
  stroke-width: 2;
`;

const FlowPoint = styled.circle<{ $active: boolean }>`
  fill: ${({ $active, theme }) =>
    $active ? theme.colors.textPrimary : theme.colors.stroke};
`;

const FlowCard = styled.article<{
  col: 1 | 2;
  row: number;
  side: 'left' | 'right';
  isMobile: boolean;
  progress: number;
  opacityProgress: number;
}>`
  padding: ${({ col, isMobile }) => {
    if (isMobile) return '0';
    return col === 1 ? '0 18% 0 0' : '0 0 0 18%';
  }};

  display: flex;
  gap: 12px;
  flex-direction: column;

  grid-column: ${({ col, isMobile }) => (isMobile ? 1 : col)};
  grid-row: ${({ row, isMobile }) => (isMobile ? 'auto' : row)};

  opacity: ${({ opacityProgress }) => opacityProgress};
  transform: ${({ side, progress, isMobile }) =>
    isMobile
      ? 'none'
      : `translateX(${(side === 'left' ? -1 : 1) * (1 - progress) * 28}px)`};
  transition:
    opacity 360ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
`;

const FlowEntryImage = styled.img<{
  imageOffset: number;
  imageScale: number;
}>`
  width: 100%;
  min-height: 220px;
  border-radius: 14px;
  box-shadow: 0 12px 28px rgb(0 0 0 / 20%);

  background-color: rgb(255 255 255 / 88%);

  object-fit: contain;
  object-position: top center;

  transform: ${({ imageOffset, imageScale }) => {
    const parts: string[] = [];

    if (imageOffset !== 0) parts.push(`translateY(${imageOffset}px)`);
    if (imageScale !== 1) parts.push(`scale(${imageScale})`);
    return parts.length > 0 ? parts.join(' ') : 'none';
  }};
  transform-origin: top left;
`;

const FlowEntryText = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

const FeatureTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t11Bold};
  line-height: 1.4;
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t8Regular};
  line-height: 1.72;
`;
