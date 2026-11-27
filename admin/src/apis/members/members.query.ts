import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { getMe, getMembers } from './members.api';
import type { GetMembersParams } from './members.api';

const MEMBERS_STALE_TIME = 1000 * 30; // 30 seconds
const MEMBERS_GC_TIME = 1000 * 60 * 5; // 5 minutes

export const membersQueries = {
  all: ['members'] as const,

  list: (params: GetMembersParams = {}) =>
    queryOptions({
      queryKey: ['members', params] as const,
      queryFn: () => getMembers(params),
      placeholderData: keepPreviousData,
      staleTime: MEMBERS_STALE_TIME,
      gcTime: MEMBERS_GC_TIME,
    }),

  // 로그인한 운영자 본인. 세션이 유지되는 동안 바뀌지 않으므로 다시 조회하지 않는다.
  me: () =>
    queryOptions({
      queryKey: ['members', 'me'] as const,
      queryFn: getMe,
      staleTime: Infinity,
    }),
};
