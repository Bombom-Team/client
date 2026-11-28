import styled from '@emotion/styled';
import { RISE } from '../constants/keyframes';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import { formatClock } from '../utils/formatTime';

interface ChallengeCardProps {
  nickname: string | null;
  correctCount: number;
  elapsedSeconds: number;
}

const ChallengeCard = ({
  nickname,
  correctCount,
  elapsedSeconds,
}: ChallengeCardProps) => {
  const sender = nickname ? `${nickname}님이` : '친구가';

  return (
    <Container>
      <Tag>도전장 도착</Tag>
      <Stamp aria-hidden="true">
        이겨
        <br />
        보세요
      </Stamp>
      <Message>{sender} 문해력 평가 도전장을 보냈어요</Message>
      <Record>
        <RecordCell>
          <RecordLabel>맞힌 개수</RecordLabel>
          <RecordValue>{correctCount} / 5</RecordValue>
        </RecordCell>
        <RecordCell>
          <RecordLabel>걸린 시간</RecordLabel>
          <RecordValue>{formatClock(elapsedSeconds)}</RecordValue>
        </RecordCell>
      </Record>
    </Container>
  );
};

export default ChallengeCard;

const Container = styled.div`
  position: relative;
  padding: 3.6cqw 3.6cqw 3.4cqw;
  border: 2px solid ${LITERACY_COLORS.stamp};

  display: grid;
  gap: 1.6cqw;

  background: ${LITERACY_COLORS.challengeBackground};
  font-family: ${LITERACY_FONTS.head};

  animation: ${RISE} 0.45s both;

  transform: rotate(-0.6deg);
`;

const Tag = styled.span`
  padding: 0.8cqw 2.4cqw;

  justify-self: start;

  background: ${LITERACY_COLORS.stamp};
  color: ${({ theme }) => theme.colors.white};
  font: 800 2.8cqw ${LITERACY_FONTS.body};
  letter-spacing: 0.06em;
`;

const Stamp = styled.div`
  position: absolute;
  top: -3cqw;
  right: 3cqw;
  width: 15cqw;
  height: 15cqw;
  border: 0.7cqw solid ${LITERACY_COLORS.stamp};
  border-radius: 50%;

  display: grid;

  background: rgb(255 246 244 / 90%);
  color: ${LITERACY_COLORS.stamp};
  font: 400 3cqw/1.1 ${LITERACY_FONTS.display};
  text-align: center;

  place-items: center;

  transform: rotate(12deg);
`;

const Message = styled.p`
  margin: 0;

  font: 700 max(13px, 3.7cqw) / 1.5 ${LITERACY_FONTS.head};

  word-break: keep-all;
`;

const Record = styled.div`
  border: 1.5px solid ${LITERACY_COLORS.ink};

  display: grid;

  background: ${({ theme }) => theme.colors.white};

  grid-template-columns: repeat(2, 1fr);
`;

const RecordCell = styled.div`
  padding: 1.6cqw 1cqw;

  display: grid;
  gap: 0.4cqw;

  text-align: center;

  & + & {
    border-left: 1.5px solid ${LITERACY_COLORS.ink};
  }
`;

const RecordLabel = styled.small`
  color: ${LITERACY_COLORS.sub};
  font: 700 2.5cqw ${LITERACY_FONTS.body};
`;

const RecordValue = styled.b`
  font: 400 4.2cqw/1.1 ${LITERACY_FONTS.display};
  white-space: nowrap;
`;
