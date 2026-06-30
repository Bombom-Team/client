import {
  Container,
  MyRankInfo,
  NameWrapper,
  InfoWrapper,
  MyRankLabel,
  MyRankValue,
  MyReadValue,
  StreakValueWrapper,
} from './MyRank.styles';
import StreakShieldInfo from './StreakShieldInfo';
import UserBadgeInfo from './UserBadgeInfo';
import type { GetMyStreakReadingRankResponse } from '@/apis/members/members.api';

interface StreakMyRankProps {
  userRank: GetMyStreakReadingRankResponse;
}

const StreakMyRank = ({ userRank }: StreakMyRankProps) => {
  const rankSummary = `현재 나의 순위 ${userRank.rank}위. 연속 독서 ${userRank.dayCount}일. 연속 읽기 보호막 ${userRank.streakShield.status === 'USED' ? '사용 완료' : '사용 가능'}`;

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
          <StreakValueWrapper>
            <StreakShieldInfo status={userRank.streakShield.status} />
            <MyReadValue>{userRank.dayCount}일</MyReadValue>
          </StreakValueWrapper>
        </InfoWrapper>
      </MyRankInfo>
    </Container>
  );
};

export default StreakMyRank;
