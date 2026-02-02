import { fetcher } from '@bombom/shared/apis';
import type { components } from '@/types/openapi';

export type DashboardStatsResponse =
  components['schemas']['DashboardStatsResponse'];

export const getDashboardStats = async () => {
  return fetcher.get<DashboardStatsResponse>({
    path: '/dashboard/stats',
  });
};
