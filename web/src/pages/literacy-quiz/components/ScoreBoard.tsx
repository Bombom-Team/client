import styled from '@emotion/styled';
import { TIME_LIMIT_SECONDS } from '../constants/exam';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import { formatClock } from '../utils/formatTime';

interface ScoreBoardProps {
  correctCount: number;
  elapsedSeconds: number;
}

// 결과 스토리 위에 고정되는 스코어보드(맞힌 개수·걸린 시간)
const ScoreBoard = ({ correctCount, elapsedSeconds }: ScoreBoardProps) => {
  const isOver = elapsedSeconds > TIME_LIMIT_SECONDS;

  return (
    <Container>
      <Cell>
        <Label>맞힌 개수</Label>
        <Value isOver={false}>{correctCount} / 5</Value>
      </Cell>
      <Cell>
        <Label>걸린 시간</Label>
        <Value isOver={isOver}>{formatClock(elapsedSeconds)}</Value>
      </Cell>
    </Container>
  );
};

export default ScoreBoard;

const Container = styled.div`
  overflow: hidden;
  width: calc(100% - 10cqw);
  border-radius: 3.4cqw;

  display: grid;

  background: ${LITERACY_COLORS.ink};
  color: ${({ theme }) => theme.colors.white};

  grid-template-columns: repeat(2, minmax(0, 1fr));
`;

const Cell = styled.div`
  padding: 1.3cqw 2.4cqw;

  display: flex;
  gap: 2cqw;
  align-items: baseline;
  justify-content: center;

  text-align: center;

  & + & {
    border-left: 1px solid ${LITERACY_COLORS.boardLine};
  }
`;

const Label = styled.small`
  color: ${LITERACY_COLORS.boardMuted};
  font: 700 2.7cqw ${LITERACY_FONTS.body};
`;

const Value = styled.b<{ isOver: boolean }>`
  overflow: hidden;

  color: ${({ isOver }) =>
    isOver ? LITERACY_COLORS.overSoft : LITERACY_COLORS.gold};
  font: 400 4.8cqw/1.1 ${LITERACY_FONTS.display};
  white-space: nowrap;

  font-variant-numeric: tabular-nums;
  text-overflow: ellipsis;
`;
