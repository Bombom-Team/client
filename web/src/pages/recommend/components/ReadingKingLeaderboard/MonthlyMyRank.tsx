import {
  Container,
  MyRankInfo,
  NameWrapper,
  InfoWrapper,
  MyRankLabel,
  MyRankValue,
  MyReadValue,
  ProgressBox,
  ProgressLabel,
} from './MyRank.styles';
import UserBadgeInfo from './UserBadgeInfo';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import { calculateRate } from '@/utils/math';
import type { components } from '@/types/openapi';

interface MonthlyMyRankProps {
  userRank: components['schemas']['MemberMonthlyReadingRankResponse'];
}

const MonthlyMyRank = ({ userRank }: MonthlyMyRankProps) => {
  const progressRate = calculateRate(
    userRank.monthlyReadCount,
    userRank.monthlyReadCount + userRank.nextRankDifference,
  );

  const rankSummary = `현재 나의 순위 ${userRank.rank}위. 읽은 뉴스레터 ${userRank.monthlyReadCount}개. 다음 순위까지 ${userRank.nextRankDifference}개 더 읽기. 진행률 ${progressRate}%`;

  return (
    <Container aria-label={rankSummary} tabIndex={0}>
      <MyRankInfo>
        <InfoWrapper>
          <NameWrapper>
            <MyRankLabel>{userRank.nickname} 님</MyRankLabel>
            <UserBadgeInfo badges={userRank.badges} />
          </NameWrapper>
          <MyRankLabel>읽은 뉴스레터</MyRankLabel>
        </InfoWrapper>
        <InfoWrapper>
          <MyRankValue>{userRank.rank}위</MyRankValue>
          <MyReadValue>{userRank.monthlyReadCount}개</MyReadValue>
        </InfoWrapper>
      </MyRankInfo>

      <ProgressBox>
        <InfoWrapper>
          <ProgressLabel>다음 순위까지</ProgressLabel>
          <ProgressLabel>{userRank.nextRankDifference}개 더 읽기</ProgressLabel>
        </InfoWrapper>
        <ProgressBar rate={progressRate} />
      </ProgressBox>
    </Container>
  );
};

export default MonthlyMyRank;
