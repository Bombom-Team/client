import { useQuery } from '@tanstack/react-query';
import { queries } from '@/apis/queries';

export const useStorageStatistics = (keyword?: string) => {
  const { data: newsletterFilters } = useQuery(
    queries.articlesStatisticsNewsletters(keyword ? { keyword } : {}),
  );
  const { data: storageStatistics } = useQuery(
    queries.articlesStatisticsNewsletters({}),
  );

  return {
    newsletterFilters,
    totalStorageCount: storageStatistics?.totalCount ?? 0,
  };
};
