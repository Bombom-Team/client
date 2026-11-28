import styled from '@emotion/styled';
import ChallengeCard from './ChallengeCard';
import TopRankerLine from './TopRankerLine';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import type {
  GetLiteracyQuizChallengeResponse,
  GetLiteracyQuizSummaryResponse,
} from '@/apis/literacyQuiz/literacyQuiz.api';
import logo from '#/assets/avif/logo.avif';

interface PcQuizCoverProps {
  summary: GetLiteracyQuizSummaryResponse | undefined;
  challenge: GetLiteracyQuizChallengeResponse | undefined;
  isStarting: boolean;
  onStart: () => void;
}

// PC 시작 화면: 가로로 넓은 시험지 표지
const PcQuizCover = ({
  summary,
  challenge,
  isStarting,
  onStart,
}: PcQuizCoverProps) => {
  return (
    <Container>
      <Paper>
        <BrandRow>
          <Brand>
            <BrandLogo src={logo} alt="" />
            봄봄
          </Brand>
          <Edition>제1회</Edition>
        </BrandRow>
        {challenge && (
          <ChallengeWrapper>
            <ChallengeCard
              nickname={challenge.nickname}
              correctCount={challenge.correctCount}
              elapsedSeconds={challenge.elapsedSeconds}
            />
          </ChallengeWrapper>
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
        {!challenge && <TopRankerLine summary={summary} size="pc" />}
        <StartButton type="button" onClick={onStart} disabled={isStarting}>
          {challenge ? '도전 받고 시작하기' : '시험 시작하기'}
          <StartTime>5:00</StartTime>
        </StartButton>
        <Hint>
          키보드 숫자 1~4로 답을 고르고 Enter로 다음 문제로 넘어갈 수 있어요
        </Hint>
      </Paper>
    </Container>
  );
};

export default PcQuizCover;

const Container = styled.div`
  padding: 32px 0;

  display: grid;
  flex: 1;

  overflow-y: auto;
  place-items: center;
`;

const Paper = styled.div`
  width: 620px;
  padding: 36px 52px 32px;
  box-shadow: 0 2px 10px rgb(0 0 0 / 12%);

  display: grid;
  gap: 20px;

  background: ${LITERACY_COLORS.paper};
  color: ${LITERACY_COLORS.ink};
  font-family: ${LITERACY_FONTS.head};
`;

const BrandRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  font: 700 14px ${LITERACY_FONTS.head};
`;

const Brand = styled.span`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const BrandLogo = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 8px;
`;

const Edition = styled.em`
  padding: 2px 8px;
  border: 1.5px solid ${LITERACY_COLORS.ink};

  font-style: normal;
  font-size: 13px;
`;

const ChallengeWrapper = styled.div`
  width: 100%;
  max-width: 420px;
  margin: 8px auto 0;

  container-type: inline-size;
`;

const TitleBlock = styled.div`
  padding: 20px 0 24px;
  border-top: 3px double ${LITERACY_COLORS.ink};
  border-bottom: 3px double ${LITERACY_COLORS.ink};

  display: grid;
  gap: 12px;
  justify-items: center;
`;

const TitleCaption = styled.small`
  font: 700 15px ${LITERACY_FONTS.head};
`;

const Title = styled.b`
  padding: 6px 14px 10px 30px;
  border: 2.5px solid ${LITERACY_COLORS.ink};

  font: 700 50px/1.1 ${LITERACY_FONTS.head};
  letter-spacing: 0.32em;
`;

const Subject = styled.span`
  padding-left: 0.5em;

  font: 700 22px ${LITERACY_FONTS.serif};
  letter-spacing: 0.5em;
`;

const InfoRow = styled.div`
  border: 1.5px solid ${LITERACY_COLORS.ink};

  display: grid;

  font: 700 17px ${LITERACY_FONTS.head};
  text-align: center;

  grid-template-columns: 1fr 1fr;
`;

const InfoCell = styled.span`
  padding: 12px;

  & + & {
    border-left: 1.5px solid ${LITERACY_COLORS.ink};
  }
`;

const InfoNumber = styled.b`
  margin-right: 4px;
  font: 400 36px/1 ${LITERACY_FONTS.display};
`;

const StartButton = styled.button`
  padding: 16px;
  border: 0;

  background: ${LITERACY_COLORS.ink};
  color: ${({ theme }) => theme.colors.white};
  font: 700 18px ${LITERACY_FONTS.head};
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
  margin-left: 8px;

  color: ${LITERACY_COLORS.gold};
  font: 400 18px ${LITERACY_FONTS.display};
  font-style: normal;
`;

const Hint = styled.small`
  color: ${LITERACY_COLORS.sub};
  font-size: 13px;
  text-align: center;
`;
