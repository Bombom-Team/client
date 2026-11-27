import { fetcher } from '@bombom/shared/apis';
import type { PageableResponse } from '@/apis/types/PageableResponse';
import type { Member } from '@/types/member';

export type GetMembersResponse = PageableResponse<Member>;

export type GetMembersParams = {
  page?: number;
  size?: number;
  name?: string;
  role?: 'ADMIN' | 'USER';
};

export const getMembers = async (params: GetMembersParams = {}) => {
  return fetcher.get<GetMembersResponse>({
    path: '/members',
    query: params,
  });
};

// TODO(BOM-1311): 백엔드 배포 후 OpenAPI 타입으로 교체
// /me에 들어왔다는 것 자체가 ADMIN 검증을 통과한 것이라 서버는 role을 내려주지 않는다.
export type GetMeResponse = Pick<Member, 'id' | 'nickname' | 'email'>;

export const getMe = async () => {
  return fetcher.get<GetMeResponse>({
    path: '/members/me',
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
