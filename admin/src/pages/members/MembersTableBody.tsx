import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FiShield } from 'react-icons/fi';
import { useChangeMemberRoleMutation } from './hooks/useChangeMemberRoleMutation';
import { membersQueries } from '@/apis/members/members.query';
import { Button } from '@/components/Button';

interface MembersTableBodyProps {
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  onDataLoaded?: (totalElements: number, totalPages: number) => void;
}

export function MembersTableBody({
  currentPage,
  pageSize,
  searchQuery,
  onDataLoaded,
}: MembersTableBodyProps) {
  const [updatingMemberId, setUpdatingMemberId] = useState<number | null>(null);

  const { data } = useSuspenseQuery(
    membersQueries.list({
      page: currentPage,
      size: pageSize,
      name: searchQuery.trim(),
    }),
  );

  useEffect(() => {
    if (data && onDataLoaded) {
      onDataLoaded(data.totalElements ?? 0, data.totalPages ?? 0);
    }
  }, [data, onDataLoaded]);

  const { mutate: changeMemberRole, isPending: isUpdatingRole } =
    useChangeMemberRoleMutation({ setUpdatingMemberId });

  const handleMakeAdmin = (memberId: number) => {
    changeMemberRole({ memberId, authority: 'ADMIN' });
  };

  const handleChangeToUser = (memberId: number) => {
    changeMemberRole({ memberId, authority: 'USER' });
  };

  if (data?.content.length === 0) {
    return (
      <Tbody>
        <Tr>
          <Td colSpan={5}>
            <EmptyState>검색 조건에 해당하는 멤버가 없습니다.</EmptyState>
          </Td>
        </Tr>
      </Tbody>
    );
  }

  return (
    <Tbody>
      {data?.content.map((member) => (
        <Tr key={member.id}>
          <Td>{member.id}</Td>
          <Td>{member.nickname}</Td>
          <Td>{member.email}</Td>
          <Td>
            <Badge variant={member.role}>
              {member.role === 'ADMIN' && <FiShield />}
              {member.role === 'ADMIN' ? '관리자' : '일반 회원'}
            </Badge>
          </Td>
          <Td>
            <ActionButtons>
              {member.role === 'USER' && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleMakeAdmin(member.id)}
                  disabled={isUpdatingRole && updatingMemberId === member.id}
                >
                  {isUpdatingRole && updatingMemberId === member.id
                    ? '변경 중...'
                    : '관리자 지정'}
                </Button>
              )}
              {member.role === 'ADMIN' && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleChangeToUser(member.id)}
                  disabled={isUpdatingRole && updatingMemberId === member.id}
                >
                  {isUpdatingRole && updatingMemberId === member.id
                    ? '변경 중...'
                    : '일반 회원 전환'}
                </Button>
              )}
            </ActionButtons>
          </Td>
        </Tr>
      ))}
    </Tbody>
  );
}

MembersTableBody.Loading = function MembersTableBodyLoading() {
  return (
    <Tbody>
      <Tr>
        <Td colSpan={5}>
          <EmptyState>멤버 목록을 불러오는 중...</EmptyState>
        </Td>
      </Tr>
    </Tbody>
  );
};

MembersTableBody.Error = function MembersTableBodyError() {
  return (
    <Tbody>
      <Tr>
        <Td colSpan={5}>
          <ErrorMessage>멤버 목록을 불러오는데 실패했습니다.</ErrorMessage>
        </Td>
      </Tr>
    </Tbody>
  );
};

const Tbody = styled.tbody``;

const Tr = styled.tr`
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const Badge = styled.span<{ variant: 'ADMIN' | 'USER' }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};

  display: inline-flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;

  background-color: ${({ variant, theme }) =>
    variant === 'ADMIN' ? theme.colors.primary : theme.colors.gray200};
  color: ${({ variant, theme }) =>
    variant === 'ADMIN' ? theme.colors.white : theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} 0;

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} 0;

  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;
`;
