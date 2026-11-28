import styled from '@emotion/styled';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import { formatClock } from '../utils/formatTime';
import type { LiteracyQuizRankingEntry } from '@/apis/literacyQuiz/literacyQuiz.api';
import MedalBronzeIcon from '#/assets/svg/medal-bronze.svg';
import MedalGoldIcon from '#/assets/svg/medal-gold.svg';
import MedalSilverIcon from '#/assets/svg/medal-silver.svg';

interface RankingRowProps {
  rank: number;
  entry: LiteracyQuizRankingEntry | undefined;
}

const MEDALS = [MedalGoldIcon, MedalSilverIcon, MedalBronzeIcon];

// 랭킹 한 줄. 아직 아무도 없는 자리는 '???'를 흐리게 보여 준다.
const RankingRow = ({ rank, entry }: RankingRowProps) => {
  const Medal = MEDALS[rank - 1];
  const rankCell = Medal ? (
    <MedalBox role="img" aria-label={`${rank}위`}>
      <Medal aria-hidden="true" />
    </MedalBox>
  ) : (
    <RankNumber isEmpty={!entry}>{rank}</RankNumber>
  );

  if (!entry) {
    return (
      <Container variant="empty" aria-label={`${rank}위 빈 자리`}>
        {rankCell}
        <Name isEmpty>???</Name>
        <Count isEmpty>?개</Count>
        <Time isEmpty>?:??</Time>
      </Container>
    );
  }

  return (
    <Container variant={entry.me ? 'me' : 'normal'}>
      {rankCell}
      <Name isEmpty={false}>
        {entry.nickname ?? '나'}
        {entry.me && <MeTag>나</MeTag>}
      </Name>
      <Count isEmpty={false}>{entry.correctCount}개</Count>
      <Time isEmpty={false}>{formatClock(entry.elapsedSeconds)}</Time>
    </Container>
  );
};

export default RankingRow;

type RowVariant = 'normal' | 'me' | 'empty';

const ROW_BACKGROUNDS: Record<RowVariant, string> = {
  normal: LITERACY_COLORS.cream,
  me: LITERACY_COLORS.rowMe,
  empty: LITERACY_COLORS.rowEmpty,
};

const Container = styled.li<{ variant: RowVariant }>`
  min-height: 7.4cqw;
  padding: 1.4cqw 2.6cqw;
  border-radius: 2.4cqw;
  box-shadow: ${({ variant, theme }) =>
    variant === 'me'
      ? `inset 0 0 0 0.5cqw ${theme.colors.primaryBomBom}`
      : 'none'};

  display: grid;
  gap: 2cqw;
  align-items: center;

  background: ${({ variant }) => ROW_BACKGROUNDS[variant]};
  font: 500 max(12px, 3.3cqw) ${LITERACY_FONTS.head};

  font-variant-numeric: tabular-nums;
  grid-template-columns: 7.5cqw minmax(0, 1fr) 10cqw 10.5cqw;
`;

const MedalBox = styled.span`
  width: 6.2cqw;
  height: 6.2cqw;

  display: inline-flex;
  justify-self: center;
`;

const RankNumber = styled.span<{ isEmpty: boolean }>`
  color: ${({ isEmpty }) =>
    isEmpty ? LITERACY_COLORS.rowEmptyNumber : LITERACY_COLORS.sub};
  font: 400 4.2cqw ${LITERACY_FONTS.display};
  text-align: center;
`;

const blurredText = (isEmpty: boolean) =>
  isEmpty ? `filter: blur(2.5px); color: ${LITERACY_COLORS.rowEmptyText};` : '';

const Name = styled.span<{ isEmpty: boolean }>`
  overflow: hidden;

  white-space: nowrap;

  text-overflow: ellipsis;
  ${({ isEmpty }) => blurredText(isEmpty)}
`;

const MeTag = styled.em`
  margin-left: 1.4cqw;
  padding: 0.3cqw 1.2cqw;
  border-radius: 1cqw;

  background: ${({ theme }) => theme.colors.primaryBomBom};
  color: ${({ theme }) => theme.colors.white};
  font: 800 2.6cqw ${LITERACY_FONTS.body};
  font-style: normal;
  vertical-align: 0.3cqw;
`;

const Count = styled.span<{ isEmpty: boolean }>`
  font-weight: 700;
  text-align: right;
  ${({ isEmpty }) => blurredText(isEmpty)}
`;

const Time = styled.span<{ isEmpty: boolean }>`
  color: ${LITERACY_COLORS.sub};
  text-align: right;
  ${({ isEmpty }) => blurredText(isEmpty)}
`;
