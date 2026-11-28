import styled from '@emotion/styled';
import { useReducedMotion } from 'framer-motion';
import DrumSlide from './DrumSlide';
import FinalSlide from './FinalSlide';
import GrowthSlide from './GrowthSlide';
import ScoreBoard from './ScoreBoard';
import TitleSlide from './TitleSlide';
import { FILL, PIN_FLY } from '../constants/keyframes';
import {
  DRUM_SLIDE_DURATION_MS,
  SLIDE_DURATION_MS,
  STORY_SLIDE_COUNT,
} from '../constants/result';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import { useStoryPlayer } from '../hooks/useStoryPlayer';
import type {
  LiteracyQuizPlatform,
  PostLiteracyQuizSubmissionResponse,
} from '@/apis/literacyQuiz/literacyQuiz.api';
import logo from '#/assets/avif/logo.avif';

interface ResultStoryProps {
  result: PostLiteracyQuizSubmissionResponse;
  attemptCode: string;
  visitorId: string;
  platform: LiteracyQuizPlatform;
  startAtLast: boolean;
  isNicknameRegistered: boolean;
  onReview: () => void;
  onRestart: () => void;
}

type SlideTone = 'drum' | 'peach' | 'white';

type BarState = 'done' | 'now' | 'wait';

const SLIDE_TONES: SlideTone[] = ['drum', 'peach', 'peach', 'white'];

const PEACH_GRADIENT = `linear-gradient(180deg, ${LITERACY_COLORS.peach}, ${LITERACY_COLORS.cream})`;

const getBarState = (
  barIndex: number,
  currentIndex: number,
  isLast: boolean,
): BarState => {
  if (barIndex < currentIndex || (isLast && barIndex === currentIndex)) {
    return 'done';
  }
  return barIndex === currentIndex ? 'now' : 'wait';
};

// 제출하면 채점 창 없이 바로 이어지는 결과 스토리(두구두구 → 성장 → 칭호 → 마지막 장)
const ResultStory = ({
  result,
  attemptCode,
  visitorId,
  platform,
  startAtLast,
  isNicknameRegistered,
  onReview,
  onRestart,
}: ResultStoryProps) => {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const { index, previousIndex, isLast, goNext, goPrevious } = useStoryPlayer({
    startAtLast,
  });
  const isDarkTop = index === 0;
  const tone = SLIDE_TONES[index] ?? 'white';
  const isPinFlying = previousIndex === 0 && index === 1 && !shouldReduceMotion;

  const renderSlide = () => {
    if (index === 0) {
      return (
        <DrumSlide
          correctCount={result.correctCount}
          shouldReduceMotion={shouldReduceMotion}
        />
      );
    }
    if (index === 1) {
      return (
        <GrowthSlide
          correctCount={result.correctCount}
          shouldReduceMotion={shouldReduceMotion}
        />
      );
    }
    if (index === 2) return <TitleSlide correctCount={result.correctCount} />;
    return (
      <FinalSlide
        result={result}
        attemptCode={attemptCode}
        visitorId={visitorId}
        platform={platform}
        isNicknameRegistered={isNicknameRegistered}
        onReview={onReview}
      />
    );
  };

  return (
    <Container>
      <Bars isDark={isDarkTop} aria-hidden="true">
        {Array.from({ length: STORY_SLIDE_COUNT }, (_, barIndex) => (
          <Bar key={barIndex} isDark={isDarkTop}>
            <BarFill
              key={`${barIndex}-${index}`}
              isDark={isDarkTop}
              state={getBarState(barIndex, index, isLast)}
              durationMs={
                index === 0 ? DRUM_SLIDE_DURATION_MS : SLIDE_DURATION_MS
              }
            />
          </Bar>
        ))}
      </Bars>
      <AppBar isDark={isDarkTop}>
        <Brand>
          <BrandLogo src={logo} alt="" />
          봄봄 문해력 퀴즈
        </Brand>
        <CloseButton
          type="button"
          aria-label="처음 화면으로"
          isDark={isDarkTop}
          onClick={onRestart}
        >
          ×
        </CloseButton>
      </AppBar>
      <Slide key={index} tone={tone} isTop={isLast}>
        {renderSlide()}
      </Slide>
      {index > 0 && (
        <PinWrapper isFlying={isPinFlying}>
          <ScoreBoard
            correctCount={result.correctCount}
            elapsedSeconds={result.elapsedSeconds}
          />
        </PinWrapper>
      )}
      <TapArea
        type="button"
        side="left"
        isEdge={isLast}
        aria-label="이전 장"
        onClick={goPrevious}
      />
      {!isLast && (
        <>
          <TapArea
            type="button"
            side="right"
            isEdge={false}
            aria-label="다음 장"
            onClick={goNext}
          />
          <Hint isDark={isDarkTop}>화면을 누르면 넘어가요</Hint>
        </>
      )}
    </Container>
  );
};

export default ResultStory;

const Container = styled.div`
  position: absolute;

  display: flex;
  flex-direction: column;

  background: ${LITERACY_COLORS.ink};
  color: ${LITERACY_COLORS.ink};
  font-size: max(13px, 3.6cqw);

  inset: 0;
`;

const Bars = styled.div<{ isDark: boolean }>`
  position: absolute;
  top: calc(5cqw + ${({ theme }) => theme.safeArea.top});
  right: 4cqw;
  left: 4cqw;
  z-index: ${({ theme }) => theme.zIndex.panel};

  display: grid;
  gap: 1.4cqw;

  grid-auto-flow: column;
`;

const Bar = styled.span<{ isDark: boolean }>`
  overflow: hidden;
  height: 1cqw;
  border-radius: 1cqw;

  background: ${({ isDark }) =>
    isDark ? 'rgb(255 255 255 / 35%)' : 'rgb(27 23 20 / 18%)'};
`;

const BarFill = styled.i<{
  isDark: boolean;
  state: BarState;
  durationMs: number;
}>`
  width: ${({ state }) => (state === 'done' ? '100%' : '0')};
  height: 100%;

  display: block;

  background: ${({ isDark, theme }) =>
    isDark ? theme.colors.white : LITERACY_COLORS.ink};

  animation: ${FILL} ${({ durationMs }) => durationMs}ms linear forwards;

  animation-name: ${({ state }) => (state === 'now' ? undefined : 'none')};
`;

const AppBar = styled.div<{ isDark: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex.panel};
  padding: calc(8.5cqw + ${({ theme }) => theme.safeArea.top}) 5.5cqw 2.5cqw;

  display: flex;
  align-items: center;
  justify-content: space-between;

  color: ${({ isDark, theme }) =>
    isDark ? theme.colors.white : LITERACY_COLORS.ink};
  font: 700 max(12px, 3.4cqw) ${LITERACY_FONTS.head};
`;

const Brand = styled.span`
  display: flex;
  gap: 1.6cqw;
  align-items: center;
`;

const BrandLogo = styled.img`
  width: 5.6cqw;
  height: 5.6cqw;
  border-radius: 1.6cqw;
`;

const CloseButton = styled.button<{ isDark: boolean }>`
  margin: -1cqw -2cqw;
  padding: 1cqw 2cqw;
  border: none;

  background: none;
  color: ${({ isDark, theme }) =>
    isDark ? theme.colors.white : LITERACY_COLORS.sub};
  font-size: 5cqw;
  line-height: 1;

  cursor: pointer;
`;

const Slide = styled.div<{ tone: SlideTone; isTop: boolean }>`
  position: absolute;
  padding: calc(39cqw + ${({ theme }) => theme.safeArea.top}) 7cqw 30cqw;

  display: flex;
  gap: 3cqw;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ isTop }) => (isTop ? 'flex-start' : 'center')};

  background: ${({ tone, theme }) => {
    if (tone === 'drum') return theme.colors.primaryBomBom;
    if (tone === 'white') return theme.colors.white;
    return PEACH_GRADIENT;
  }};
  color: ${({ tone, theme }) =>
    tone === 'drum' ? theme.colors.white : LITERACY_COLORS.ink};
  text-align: center;

  inset: 0;
`;

const PinWrapper = styled.div<{ isFlying: boolean }>`
  position: absolute;
  top: calc(19cqw + ${({ theme }) => theme.safeArea.top});
  right: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex.elevated};

  display: flex;
  justify-content: center;

  animation: ${PIN_FLY} 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;

  animation-name: ${({ isFlying }) => (isFlying ? undefined : 'none')};

  pointer-events: none;
`;

const TapArea = styled.button<{ side: 'left' | 'right'; isEdge: boolean }>`
  position: absolute;
  z-index: ${({ theme }) => theme.zIndex.content};
  width: ${({ side, isEdge }) => {
    if (isEdge) return '9%';
    return side === 'left' ? '34%' : '66%';
  }};
  border: 0;

  background: transparent;

  cursor: pointer;
  inset: 0 ${({ side }) => (side === 'right' ? '0' : 'auto')} ${({ isEdge }) => (isEdge ? '72%' : '28cqw')} ${({ side }) => (side === 'left' ? '0' : 'auto')};
`;

const Hint = styled.div<{ isDark: boolean }>`
  position: absolute;
  right: 0;
  bottom: 7cqw;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex.elevated};

  color: ${({ isDark }) =>
    isDark ? 'rgb(255 255 255 / 75%)' : 'rgb(27 23 20 / 50%)'};
  font: 700 3cqw ${LITERACY_FONTS.body};
  text-align: center;

  pointer-events: none;
`;
