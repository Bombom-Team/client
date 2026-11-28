import styled from '@emotion/styled';
import { LITERACY_FONTS } from '../constants/style';
import { useStepReveal } from '../hooks/useStepReveal';

interface DrumSlideProps {
  correctCount: number;
  shouldReduceMotion: boolean;
}

// 1장: 두구두구… 결과 발표! 맞힌 개수가 0부터 하나씩 올라간다.
const DrumSlide = ({ correctCount, shouldReduceMotion }: DrumSlideProps) => {
  const shownCount = useStepReveal({
    target: correctCount,
    firstDelayMs: 300,
    stepMs: 260,
    shouldReduceMotion,
  });

  return (
    <>
      <DrumText>
        두구두구…
        <br />
        결과 발표!
      </DrumText>
      <BigNumber aria-label={`5문제 중 ${correctCount}개`}>
        <BigNumberValue>{shownCount}</BigNumberValue>
        <BigNumberTotal> / 5</BigNumberTotal>
      </BigNumber>
      <DrumCaption>문제를 맞혔어요</DrumCaption>
    </>
  );
};

export default DrumSlide;

const DrumText = styled.div`
  font: 400 7cqw/1.2 ${LITERACY_FONTS.display};
`;

const BigNumber = styled.div`
  font: 400 34cqw/0.9 ${LITERACY_FONTS.display};
  font-variant-numeric: tabular-nums;
`;

const BigNumberValue = styled.span``;

const BigNumberTotal = styled.small`
  font-size: 9cqw;
`;

const DrumCaption = styled.div`
  font: 400 5cqw/1.2 ${LITERACY_FONTS.display};
`;
