import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import LeaderboardItem from './LeaderboardItem';
import MonthlyMyRank from './MonthlyMyRank';
import { RANKING } from './ReadingKingLeaderboard.constants';
import { LeaderboardList, Divider } from './ReadingKingLeaderboard.styles';
import { queries } from '@/apis/queries';
import { Carousel } from '@/components/Carousel/Carousel';
import { chunk } from '@/utils/array';

const MonthlyRankingContent = () => {
  const { data: monthlyReadingRank } = useSuspenseQuery(
    queries.monthlyReadingRank({ limit: RANKING.maxRank }),
  );
  const { data: userRank } = useQuery(queries.myMonthlyReadingRank());

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
          <MonthlyMyRank userRank={userRank} />
        </>
      )}
    </>
  );
};

export default MonthlyRankingContent;
