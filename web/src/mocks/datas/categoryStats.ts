import type { CategoryStatsResponse } from '@/apis/members/members.api';

export const CUMULATIVE_CATEGORY_STATS: CategoryStatsResponse = {
  type: 'cumulative',
  total: 56,
  categories: [
    {
      id: 1,
      name: '자기계발',
      count: 22,
      percent: 39,
    },
    {
      id: 2,
      name: '경제',
      count: 18,
      percent: 32,
    },
    {
      id: 3,
      name: '기술',
      count: 11,
      percent: 20,
    },
    {
      id: 4,
      name: '시사/사회',
      count: 3,
      percent: 5,
    },
    {
      id: 5,
      name: '취미/라이프',
      count: 2,
      percent: 4,
    },
  ],
};

export const MONTHLY_CATEGORY_STATS: CategoryStatsResponse = {
  type: 'monthly',
  total: 48,
  categories: [
    {
      id: 1,
      name: '자기계발',
      count: 12,
      percent: 25,
    },
    {
      id: 2,
      name: '경제',
      count: 10,
      percent: 21,
    },
  ],
};
