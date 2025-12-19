import { fetcher } from '@bombom/shared/apis';
import type { PageableResponse } from '@/apis/types/PageableResponse';
import type { Member } from '@/types/member';

export type GetMembersResponse = PageableResponse<Member>;

export type GetMembersParams = {
  page?: number;
  size?: number;
  name?: string;
};

export const getMembers = async (params: GetMembersParams = {}) => {
  return fetcher.get<GetMembersResponse>({
    path: '/members',
    query: params,
  });
};

export type UpdateMemberRoleParams = {
  memberId: number;
  authority: 'ADMIN' | 'USER';
};

export const updateMemberRole = async (params: UpdateMemberRoleParams) => {
  return fetcher.patch<
    { authority: UpdateMemberRoleParams['authority'] },
    void
  >({
    path: `/members/${params.memberId}/role`,
    body: { authority: params.authority },
  });
};
