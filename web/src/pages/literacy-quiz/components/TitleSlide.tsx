import styled from '@emotion/styled';
import GrowthArt from './GrowthArt';
import { RISE, THUMP } from '../constants/keyframes';
import { GROWTH_STAGES } from '../constants/result';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';

interface TitleSlideProps {
  correctCount: number;
}

// 3장: 맞힌 개수별 칭호. 4개 이상이면 '잘했어요' 도장을 찍는다.
const TitleSlide = ({ correctCount }: TitleSlideProps) => {
  const stage = GROWTH_STAGES[correctCount] ?? GROWTH_STAGES[0]!;

  return (
    <>
      <GrowthArt level={correctCount} size="40cqw" />
      <Kicker>당신의 칭호는</Kicker>
      <Title>{stage.name}</Title>
      <Description>{stage.description}</Description>
      <Skill>특기 · {stage.skill}</Skill>
      {correctCount >= 4 && (
        <Stamp aria-hidden="true">
          {correctCount >= 5 && (
            <>
              참
              <br />
            </>
          )}
          잘했어요
        </Stamp>
      )}
    </>
  );
};

export default TitleSlide;

const Kicker = styled.span`
  color: ${LITERACY_COLORS.sub};
  font: 700 3.6cqw ${LITERACY_FONTS.body};
`;

const Title = styled.h2`
  margin: 0;

  color: ${({ theme }) => theme.colors.primaryBomBom};
  font: 400 12cqw/1.05 ${LITERACY_FONTS.display};

  animation: ${RISE} 0.5s cubic-bezier(0.3, 1.3, 0.5, 1) both;
`;

const Description = styled.p`
  margin: 0;

  font-size: max(13px, 3.6cqw);
  line-height: 1.6;

  word-break: keep-all;
`;

const Skill = styled.span`
  padding: 2cqw 3.6cqw;
  border-radius: 999px;

  background: ${LITERACY_COLORS.ink};
  color: ${({ theme }) => theme.colors.white};
  font: 800 3.3cqw ${LITERACY_FONTS.body};
`;

const Stamp = styled.div`
  position: absolute;
  top: calc(39cqw + ${({ theme }) => theme.safeArea.top});
  right: 7cqw;
  width: 21cqw;
  height: 21cqw;
  border: 0.9cqw solid ${LITERACY_COLORS.pen};
  border-radius: 50%;
  box-shadow:
    inset 0 0 0 0.8cqw ${LITERACY_COLORS.cream},
    inset 0 0 0 1.2cqw ${LITERACY_COLORS.pen};

  display: grid;

  color: ${LITERACY_COLORS.pen};
  font: 400 3.8cqw/1.1 ${LITERACY_FONTS.display};
  text-align: center;

  animation: ${THUMP} 0.5s cubic-bezier(0.3, 1.6, 0.5, 1) both;

  place-items: center;
  transform: rotate(14deg);
`;
