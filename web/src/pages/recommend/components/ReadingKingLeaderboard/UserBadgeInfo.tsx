import styled from '@emotion/styled';
import ChallengeBadgeInfo from './ChallengeBadgeInfo';
import RankingBadgeInfo from './RankingBadgeInfo';
import type { Badges } from '../../types/badges';

interface UserBadgeInfoProps {
  badges?: Badges;
}

const UserBadgeInfo = ({ badges }: UserBadgeInfoProps) => {
  return (
    <Container>
      <ChallengeBadgeInfo badges={badges} />
      <RankingBadgeInfo badges={badges} />
    </Container>
  );
};

export default UserBadgeInfo;

const Container = styled.div`
  display: flex;
  gap: 8px;
`;
