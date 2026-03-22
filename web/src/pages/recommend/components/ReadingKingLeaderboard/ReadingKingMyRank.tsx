import styled from '@emotion/styled';
import UserBadgeInfo from './UserBadgeInfo';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import { calculateRate } from '@/utils/math';
import type { GetMyStreakReadingRankResponse } from '@/apis/members/members.api';
import type { components } from '@/types/openapi';

type MonthlyUserRank =
  components['schemas']['MemberMonthlyReadingRankResponse'];

interface MonthlyMyRankProps {
  mode: 'monthly';
  userRank: MonthlyUserRank;
}

interface StreakMyRankProps {
  mode: 'streak';
  userRank: GetMyStreakReadingRankResponse;
}

type ReadingKingMyRankProps = MonthlyMyRankProps | StreakMyRankProps;

const ReadingKingMyRank = ({ mode, userRank }: ReadingKingMyRankProps) => {
  if (mode === 'monthly') {
    const monthly = userRank as MonthlyUserRank;
    const progressRate = calculateRate(
      monthly.monthlyReadCount,
      monthly.monthlyReadCount + monthly.nextRankDifference,
    );

    const rankSummary = `현재 나의 순위 ${monthly.rank}위. 읽은 뉴스레터 ${monthly.monthlyReadCount}개. 다음 순위까지 ${monthly.nextRankDifference}개 더 읽기. 진행률 ${progressRate}%`;

    return (
      <Container aria-label={rankSummary} tabIndex={0}>
        <MyRankInfo>
          <InfoWrapper>
            <NameWrapper>
              <MyRankLabel>{monthly.nickname} 님</MyRankLabel>
              <UserBadgeInfo badges={monthly.badges} />
            </NameWrapper>
            <MyRankLabel>읽은 뉴스레터</MyRankLabel>
          </InfoWrapper>
          <InfoWrapper>
            <MyRankValue>{monthly.rank}위</MyRankValue>
            <MyReadValue>{monthly.monthlyReadCount}개</MyReadValue>
          </InfoWrapper>
        </MyRankInfo>

        <ProgressBox>
          <InfoWrapper>
            <ProgressLabel>다음 순위까지</ProgressLabel>
            <ProgressLabel>
              {monthly.nextRankDifference}개 더 읽기
            </ProgressLabel>
          </InfoWrapper>
          <ProgressBar rate={progressRate} />
        </ProgressBox>
      </Container>
    );
  }

  const streak = userRank as GetMyStreakReadingRankResponse;
  const rankSummary = `현재 나의 순위 ${streak.rank}위. 연속 독서 ${streak.dayCount}일`;

  return (
    <Container aria-label={rankSummary} tabIndex={0}>
      <MyRankInfo>
        <InfoWrapper>
          <NameWrapper>
            <MyRankLabel>{streak.nickname} 님</MyRankLabel>
            <UserBadgeInfo badges={streak.badges} />
          </NameWrapper>
          <MyRankLabel>연속 독서</MyRankLabel>
        </InfoWrapper>
        <InfoWrapper>
          <MyRankValue>{streak.rank}위</MyRankValue>
          <MyReadValue>{streak.dayCount}일</MyReadValue>
        </InfoWrapper>
      </MyRankInfo>
    </Container>
  );
};

export default ReadingKingMyRank;

const Container = styled.section`
  padding: 16px;
  border-radius: 16px;

  display: flex;
  gap: 12px;
  flex-direction: column;

  background-color: ${({ theme }) => `${theme.colors.primary}10`};
`;

const MyRankInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const NameWrapper = styled.div`
  height: 36px;
  display: flex;
  gap: 8px;
  align-items: center;
`;

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MyRankLabel = styled.div`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body2};
`;

const MyRankValue = styled.div`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading5};
`;

const MyReadValue = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.heading5};
`;

const ProgressBox = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const ProgressLabel = styled.div`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body3};
`;
