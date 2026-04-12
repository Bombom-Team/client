import { Container, RankIconWrapper, UserInfoBox } from './LeaderboardItem';
import Skeleton from '@/components/Skeleton/Skeleton';

const LeaderboardItemSkeleton = () => (
  <Container>
    <RankIconWrapper>
      <Skeleton width="1.5rem" height="1.5rem" />
    </RankIconWrapper>

    <UserInfoBox>
      <Skeleton width="5rem" height="1.375rem" />
      <Skeleton width="3.75rem" height="1.25rem" />
    </UserInfoBox>
  </Container>
);

export default LeaderboardItemSkeleton;
