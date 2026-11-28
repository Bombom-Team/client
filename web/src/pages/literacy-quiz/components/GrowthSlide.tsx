import styled from '@emotion/styled';
import GrowthArt from './GrowthArt';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import { useStepReveal } from '../hooks/useStepReveal';

interface GrowthSlideProps {
  correctCount: number;
  shouldReduceMotion: boolean;
}

// 2장: 맞힌 개수만큼 알에서 한 단계씩 자란다.
const GrowthSlide = ({
  correctCount,
  shouldReduceMotion,
}: GrowthSlideProps) => {
  const level = useStepReveal({
    target: correctCount,
    firstDelayMs: 250,
    stepMs: 430,
    shouldReduceMotion,
  });

  return (
    <>
      <Kicker>알에서 자라는 중…</Kicker>
      <Evolution>
        <GrowthArt
          key={level}
          level={level}
          size="52cqw"
          isPopping={!shouldReduceMotion && level > 0}
        />
        <Level>
          Lv.<LevelNumber>{level}</LevelNumber>
        </Level>
      </Evolution>
    </>
  );
};

export default GrowthSlide;

const Kicker = styled.span`
  color: ${LITERACY_COLORS.sub};
  font: 700 3.6cqw ${LITERACY_FONTS.body};
`;

const Evolution = styled.div`
  display: grid;
  gap: 2cqw;
  justify-items: center;
`;

const Level = styled.span`
  color: ${LITERACY_COLORS.gold};
  font: 400 5.4cqw ${LITERACY_FONTS.display};
`;

const LevelNumber = styled.span``;
