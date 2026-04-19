import {
  Container,
  MyRankInfo,
  NameWrapper,
  InfoWrapper,
  MyRankLabel,
  MyRankValue,
  MyReadValue,
} from './MyRank.styles';
import UserBadgeInfo from './UserBadgeInfo';
import type { GetMyStreakReadingRankResponse } from '@/apis/members/members.api';

interface StreakMyRankProps {
  userRank: GetMyStreakReadingRankResponse;
}

const StreakMyRank = ({ userRank }: StreakMyRankProps) => {
  const rankSummary = `현재 나의 순위 ${userRank.rank}위. 연속 독서 ${userRank.dayCount}일`;

  return (
    <Container aria-label={rankSummary} tabIndex={0}>
      <MyRankInfo>
        <InfoWrapper>
          <NameWrapper>
            <MyRankLabel>{userRank.nickname} 님</MyRankLabel>
            <UserBadgeInfo badges={userRank.badges} />
          </NameWrapper>
          <MyRankLabel>연속 독서</MyRankLabel>
        </InfoWrapper>
        <InfoWrapper>
          <MyRankValue>{userRank.rank}위</MyRankValue>
          <MyReadValue>{userRank.dayCount}일</MyReadValue>
        </InfoWrapper>
      </MyRankInfo>
    </Container>
  );
};

export default StreakMyRank;
