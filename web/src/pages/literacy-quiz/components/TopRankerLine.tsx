import styled from '@emotion/styled';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import { formatClock } from '../utils/formatTime';
import type { GetLiteracyQuizSummaryResponse } from '@/apis/literacyQuiz/literacyQuiz.api';
import MedalGoldIcon from '#/assets/svg/medal-gold.svg';

interface TopRankerLineProps {
  summary: GetLiteracyQuizSummaryResponse | undefined;
  size: 'mobile' | 'pc';
}

const TopRankerLine = ({ summary, size }: TopRankerLineProps) => {
  const topRanker = summary?.topRanker;

  return (
    <Container size={size} isHidden={!summary}>
      <MedalBox size={size} role="img" aria-label="1등">
        <MedalGoldIcon aria-hidden="true" />
      </MedalBox>
      {topRanker ? (
        <>
          현재 1등 <Name>{topRanker.nickname}</Name>
          <Record size={size}>
            {topRanker.correctCount}/5 · {formatClock(topRanker.elapsedSeconds)}
          </Record>
        </>
      ) : (
        '아직 1등이 없어요 · 첫 1등이 되어 보세요'
      )}
    </Container>
  );
};

export default TopRankerLine;

const SIZE_STYLES = {
  mobile: { font: 'max(12.5px, 3.3cqw)', gap: '1.6cqw', icon: '5cqw' },
  pc: { font: '15px', gap: '8px', icon: '24px' },
};

const Container = styled.p<{ size: 'mobile' | 'pc'; isHidden: boolean }>`
  visibility: ${({ isHidden }) => (isHidden ? 'hidden' : 'visible')};
  margin: 0;

  display: flex;
  gap: ${({ size }) => SIZE_STYLES[size].gap};
  align-items: center;
  justify-content: center;

  color: ${LITERACY_COLORS.subDeep};
  font: 600 ${({ size }) => SIZE_STYLES[size].font} ${LITERACY_FONTS.head};
  white-space: nowrap;
`;

const MedalBox = styled.span<{ size: 'mobile' | 'pc' }>`
  width: ${({ size }) => SIZE_STYLES[size].icon};
  height: ${({ size }) => SIZE_STYLES[size].icon};

  display: inline-flex;
  flex-shrink: 0;
`;

const Name = styled.b`
  overflow: hidden;

  color: ${LITERACY_COLORS.ink};
  font-weight: 800;

  text-overflow: ellipsis;
`;

const Record = styled.span<{ size: 'mobile' | 'pc' }>`
  color: ${({ size }) =>
    size === 'mobile' ? LITERACY_COLORS.sub : LITERACY_COLORS.subDeep};
  white-space: nowrap;

  font-variant-numeric: tabular-nums;
`;
