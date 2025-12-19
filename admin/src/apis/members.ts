import { fetcher } from '@bombom/shared/apis';
import type { Member } from '@/types/member';

export interface GetMembersResponse {
  content: Member[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
  };
  size: number;
  sort: { empty: boolean; sorted: boolean; unsorted: boolean };
  totalElements: number;
  totalPages: number;
}

export interface GetMembersParams {
  page?: number;
  size?: number;
}

export const getMembers = async ({ page, size }: GetMembersParams = {}) => {
  return fetcher.get<GetMembersResponse>({
    path: '/members',
    query: {
      page,
      size,
    },
  });
};

export interface UpdateMemberRoleParams {
  memberId: number;
  authority: 'ADMIN' | 'USER';
}

export const updateMemberRole = async ({ memberId, authority }: UpdateMemberRoleParams) => {
  return fetcher.patch<{ authority: UpdateMemberRoleParams['authority'] }, void>({
    path: `/members/${memberId}/role`,
    body: { authority },
  });
};
