import LeaderboardItemSkeleton from './LeaderboardItemSkeleton';
import { RANKING } from './ReadingKingLeaderboard.constants';
import { LeaderboardList } from './ReadingKingLeaderboard.styles';

const ReadingKingLeaderboardSkeleton = () => {
  return (
    <LeaderboardList>
      {Array.from({ length: RANKING.boardUnit }).map((_, index) => (
        <LeaderboardItemSkeleton key={`skeletonLeaderboard-${index}`} />
      ))}
    </LeaderboardList>
  );
};

export default ReadingKingLeaderboardSkeleton;
