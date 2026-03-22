import { useQuery } from '@tanstack/react-query';
import LeaderboardItem from './LeaderboardItem';
import { RANKING } from './ReadingKingLeaderboard.constants';
import ReadingKingMyRank from './ReadingKingMyRank';
import { queries } from '@/apis/queries';
import { Carousel } from '@/components/Carousel/Carousel';
import { chunk } from '@/utils/array';
import { LeaderboardList, Divider } from './ReadingKingLeaderboard.styles';

const StreakRankingContent = () => {
  const { data: streakReadingRank } = useQuery(
    queries.streakReadingRank({ limit: RANKING.maxRank }),
  );
  const { data: streakUserRank } = useQuery(queries.myStreakReadingRank());

  const streakContent = streakReadingRank?.data ?? [];

  return (
    <>
      {streakContent.length > 0 && (
        <Carousel.Root loop>
          <Carousel.Slides>
            {chunk(streakContent, RANKING.boardUnit).map(
              (leaderboard, leaderboardIndex) => (
                <Carousel.Slide key={`slide-${leaderboardIndex}`}>
                  <LeaderboardList
                    role="list"
                    aria-label={`연속 독서왕 순위 ${leaderboardIndex + 1}페이지`}
                  >
                    {leaderboard.map((item, index) => (
                      <LeaderboardItem
                        key={`rank-${index}` + item.nickname}
                        rank={item.rank}
                        name={item.nickname}
                        readCount={item.dayCount}
                        readCountLabel="일 연속"
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

      {streakUserRank && (
        <>
          <Divider role="separator" aria-hidden="true" />
          <ReadingKingMyRank mode="streak" userRank={streakUserRank} />
        </>
      )}
    </>
  );
};

export default StreakRankingContent;
