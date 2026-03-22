import LeaderboardItemSkeleton from './LeaderboardItemSkeleton';
import { RANKING } from './ReadingKingLeaderboard.constants';
import {
  Container,
  LeaderboardList,
  TitleIcon,
  TitleWrapper,
  CountdownWrapper,
  TabToggle,
  TabButton,
} from './ReadingKingLeaderboard.styles';
import ArrowIcon from '@/components/icons/ArrowIcon';
import Skeleton from '@/components/Skeleton/Skeleton';

const ReadingKingLeaderboardSkeleton = () => {
  return (
    <>
      <Container>
        <TitleWrapper>
          <TitleIcon aria-hidden="true">
            <ArrowIcon width={16} height={16} direction="upRight" />
          </TitleIcon>
          <TabToggle role="tablist" aria-label="독서왕 랭킹 유형 선택">
            <TabButton role="tab" active={true}>
              이달의 독서왕
            </TabButton>
            <TabButton role="tab" active={false}>
              연속 독서왕
            </TabButton>
          </TabToggle>
          <CountdownWrapper>
            <Skeleton width={36} height={16} />
          </CountdownWrapper>
        </TitleWrapper>

        <LeaderboardList>
          {Array.from({ length: RANKING.boardUnit }).map((_, index) => (
            <LeaderboardItemSkeleton key={`skeletonLeaderboard-${index}`} />
          ))}
        </LeaderboardList>
      </Container>
    </>
  );
};

export default ReadingKingLeaderboardSkeleton;
