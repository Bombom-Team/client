import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  COUNTDOWN_UPDATE_INTERVAL_MS,
  RANKING,
} from './ReadingKingLeaderboard.constants';
import { queries } from '@/apis/queries';
import { useCountdown } from '@/hooks/useCountdown';

export const useRankingCountdown = () => {
  const queryClient = useQueryClient();

  const { data: monthlyReadingRank, isFetching } = useQuery(
    queries.monthlyReadingRank({ limit: RANKING.maxRank }),
  );

  const nextRefreshAt =
    monthlyReadingRank?.nextRefreshAt ??
    new Date(Date.now() + COUNTDOWN_UPDATE_INTERVAL_MS).toISOString();

  const { leftTime, isCompleting } = useCountdown({
    targetTime: nextRefreshAt,
    completeDelay: 2000,
    onComplete: () => {
      queryClient.invalidateQueries({
        queryKey: queries.monthlyReadingRank({ limit: RANKING.maxRank })
          .queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queries.myMonthlyReadingRank().queryKey,
      });
    },
  });

  return { leftTime, isCompleting, isFetching };
};
