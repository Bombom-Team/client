import styled from '@emotion/styled';
import ChallengeCard from './ChallengeCard';
import StopwatchIcon from './StopwatchIcon';
import TopRankerLine from './TopRankerLine';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import type {
  GetLiteracyQuizChallengeResponse,
  GetLiteracyQuizSummaryResponse,
} from '@/apis/literacyQuiz/literacyQuiz.api';
import logo from '#/assets/avif/logo.avif';

interface QuizCoverProps {
  summary: GetLiteracyQuizSummaryResponse | undefined;
  challenge: GetLiteracyQuizChallengeResponse | undefined;
  isStarting: boolean;
  onStart: () => void;
}

const QuizCover = ({
  summary,
  challenge,
  isStarting,
  onStart,
}: QuizCoverProps) => {
  const participantCount = summary?.participantCount ?? 0;

  return (
    <Container>
      <PaperWrapper>
        <Paper>
          <BrandRow>
            <Brand>
              <BrandLogo src={logo} alt="" />
              봄봄
            </Brand>
            <Edition>제1회</Edition>
          </BrandRow>
          {challenge && (
            <ChallengeCard
              nickname={challenge.nickname}
              correctCount={challenge.correctCount}
              elapsedSeconds={challenge.elapsedSeconds}
            />
          )}
          <TitleBlock>
            <TitleCaption>제1회 봄봄 문해력 평가</TitleCaption>
            <Title>문제지</Title>
            <Subject>읽기 영역</Subject>
          </TitleBlock>
          <InfoRow>
            <InfoCell>
              <InfoNumber>5</InfoNumber>문항
            </InfoCell>
            <InfoCell>
              <InfoNumber>5</InfoNumber>분
            </InfoCell>
          </InfoRow>
        </Paper>
      </PaperWrapper>
      <Bottom>
        {!challenge && <TopRankerLine summary={summary} size="mobile" />}
        <StartButton type="button" onClick={onStart} disabled={isStarting}>
          {challenge ? '도전 받고 시작하기' : '시험 시작하기'}
          <StopwatchIcon />
          <StartTime>5:00</StartTime>
        </StartButton>
        <Hint>
          {participantCount > 0 &&
            `${participantCount.toLocaleString('ko-KR')}명이 도전했어요 · `}
          시작하면 바로 5분 타이머가 돌아가요
        </Hint>
      </Bottom>
    </Container>
  );
};

export default QuizCover;

const Container = styled.div`
  position: absolute;

  display: flex;
  flex-direction: column;

  background: ${LITERACY_COLORS.desk};
  color: ${LITERACY_COLORS.ink};
  font-family: ${LITERACY_FONTS.serif};

  inset: 0;
`;

const PaperWrapper = styled.div`
  padding: calc(5cqw + ${({ theme }) => theme.safeArea.top}) 3.4cqw 36cqw;

  display: grid;
  flex: 1;
  align-content: center;

  overflow-y: auto;
`;

const Paper = styled.div`
  padding: 6cqw 5cqw 7cqw;
  box-shadow: 0 1px 3px rgb(0 0 0 / 12%);

  display: grid;
  gap: 5.4cqw;

  background: ${LITERACY_COLORS.paper};
`;

const BrandRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  font: 700 3cqw ${LITERACY_FONTS.head};
`;

const Brand = styled.span`
  display: flex;
  gap: 1.4cqw;
  align-items: center;
`;

const BrandLogo = styled.img`
  width: 5cqw;
  height: 5cqw;
  border-radius: 1.4cqw;
`;

const Edition = styled.em`
  padding: 0.6cqw 2cqw;
  border: 1.5px solid ${LITERACY_COLORS.ink};

  font-style: normal;
  font-size: 2.8cqw;
`;

const TitleBlock = styled.div`
  padding: 4cqw 0 5cqw;
  border-top: 3px double ${LITERACY_COLORS.ink};
  border-bottom: 3px double ${LITERACY_COLORS.ink};

  display: grid;
  gap: 2.4cqw;
  justify-items: center;

  text-align: center;
`;

const TitleCaption = styled.small`
  font: 700 3.2cqw ${LITERACY_FONTS.head};
  letter-spacing: 0.06em;
`;

const Title = styled.b`
  padding: 1.4cqw 3cqw 2cqw 6.2cqw;
  border: 2.5px solid ${LITERACY_COLORS.ink};

  font: 700 10cqw/1.1 ${LITERACY_FONTS.head};
  letter-spacing: 0.32em;
`;

const Subject = styled.span`
  padding-left: 0.5em;

  font: 700 4.6cqw ${LITERACY_FONTS.serif};
  letter-spacing: 0.5em;
`;

const InfoRow = styled.div`
  border: 1.5px solid ${LITERACY_COLORS.ink};

  display: grid;

  font: 700 3.6cqw ${LITERACY_FONTS.head};
  text-align: center;

  grid-template-columns: 1fr 1fr;
`;

const InfoCell = styled.span`
  padding: 2.6cqw;

  display: flex;
  gap: 1cqw;
  align-items: baseline;
  justify-content: center;

  & + & {
    border-left: 1.5px solid ${LITERACY_COLORS.ink};
  }
`;

const InfoNumber = styled.b`
  font: 400 8cqw/1 ${LITERACY_FONTS.display};
`;

const Bottom = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 3cqw 4.5cqw calc(4.6cqw + ${({ theme }) => theme.safeArea.bottom});
  border-top: 2px solid ${LITERACY_COLORS.ink};

  display: grid;
  gap: 1.6cqw;

  background: ${LITERACY_COLORS.paper};
  font-family: ${LITERACY_FONTS.head};
`;

const StartButton = styled.button`
  padding: 4cqw;
  border: 0;

  display: flex;
  gap: 2cqw;
  align-items: center;
  justify-content: center;

  background: ${LITERACY_COLORS.ink};
  color: ${({ theme }) => theme.colors.white};
  font: 700 max(15px, 4.2cqw) ${LITERACY_FONTS.head};
  letter-spacing: 0.08em;

  cursor: pointer;

  &:disabled {
    cursor: progress;
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primaryBomBom};
    outline-offset: 2px;
  }
`;

const StartTime = styled.em`
  color: ${LITERACY_COLORS.gold};
  font: 400 4.2cqw ${LITERACY_FONTS.display};
  font-style: normal;
  letter-spacing: 0;
`;

const Hint = styled.small`
  color: ${LITERACY_COLORS.sub};
  font: 600 2.9cqw ${LITERACY_FONTS.head};
  text-align: center;
`;
