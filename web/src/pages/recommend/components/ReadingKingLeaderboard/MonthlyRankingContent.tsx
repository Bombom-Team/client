import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import LeaderboardItem from './LeaderboardItem';
import {
  COUNTDOWN_UPDATE_INTERVAL_MS,
  RANKING,
} from './ReadingKingLeaderboard.constants';
import { LeaderboardList, Divider } from './ReadingKingLeaderboard.styles';
import ReadingKingMyRank from './ReadingKingMyRank';
import { queries } from '@/apis/queries';
import { Carousel } from '@/components/Carousel/Carousel';
import { chunk } from '@/utils/array';

interface MonthlyRankingContentProps {
  onCountdownStateChange: (state: {
    nextRefreshAt: string;
    isFetching: boolean;
  }) => void;
}

const MonthlyRankingContent = ({
  onCountdownStateChange,
}: MonthlyRankingContentProps) => {
  const { data: monthlyReadingRank, isFetching } = useQuery(
    queries.monthlyReadingRank({ limit: RANKING.maxRank }),
  );
  const { data: userRank } = useQuery(queries.myMonthlyReadingRank());

  useEffect(() => {
    onCountdownStateChange({
      nextRefreshAt:
        monthlyReadingRank?.nextRefreshAt ??
        new Date(Date.now() + COUNTDOWN_UPDATE_INTERVAL_MS).toISOString(),
      isFetching,
    });
  }, [monthlyReadingRank?.nextRefreshAt, isFetching, onCountdownStateChange]);

  const monthlyContent = monthlyReadingRank?.data ?? [];

  return (
    <>
      {monthlyContent.length > 0 && (
        <Carousel.Root loop>
          <Carousel.Slides>
            {chunk(monthlyContent, RANKING.boardUnit).map(
              (leaderboard, leaderboardIndex) => (
                <Carousel.Slide key={`slide-${leaderboardIndex}`}>
                  <LeaderboardList
                    role="list"
                    aria-label={`이달의 독서왕 순위 ${leaderboardIndex + 1}페이지`}
                  >
                    {leaderboard.map((item, index) => (
                      <LeaderboardItem
                        key={`rank-${index}` + item.nickname}
                        rank={item.rank}
                        name={item.nickname}
                        readCount={item.monthlyReadCount}
                        badges={item.badges}
                      />
                    ))}
                  </LeaderboardList>
                </Carousel.Slide>
              ),
            )}
          </Carousel.Slides>
          <Carousel.NavButtons position="bottom" />
        </Carousel.Root>
      )}

      {userRank && (
        <>
          <Divider role="separator" aria-hidden="true" />
          <ReadingKingMyRank mode="monthly" userRank={userRank} />
        </>
      )}
    </>
  );
};

export default MonthlyRankingContent;
