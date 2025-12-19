import styled from '@emotion/styled';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiShield,
} from 'react-icons/fi';
import { updateMemberRole } from '@/apis/members/members.api';
import { membersQueries } from '@/apis/members/members.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';

export const Route = createFileRoute('/members')({
  component: MembersPage,
});

const PAGE_SIZE = 10;
const MAX_VISIBLE_PAGES = 5;

function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [updatingMemberId, setUpdatingMemberId] = useState<number | null>(null);
  const trimmedSearchQuery = searchQuery.trim();
  const normalizedQuery = trimmedSearchQuery.toLowerCase();
  const serverSearchQuery = trimmedSearchQuery || undefined;
  const queryClient = useQueryClient();
  const membersListQuery = membersQueries.list({
    page: currentPage,
    size: PAGE_SIZE,
    name: serverSearchQuery,
  });
  const { data, isLoading, error } = useQuery(membersListQuery);

  const { mutate: changeMemberRole, isPending: isUpdatingRole } = useMutation({
    mutationFn: ({
      memberId,
      authority,
    }: {
      memberId: number;
      authority: 'ADMIN' | 'USER';
    }) => updateMemberRole({ memberId, authority }),
    onMutate: ({ memberId }) => {
      setUpdatingMemberId(memberId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      if (variables.authority === 'ADMIN') {
        alert('해당 멤버의 권한을 관리자 권한으로 변경했습니다.');
      } else {
        alert('해당 멤버의 권한을 일반 회원으로 변경했습니다.');
      }
    },
    onError: (mutationError) => {
      let message = '권한 변경에 실패했습니다. 잠시 후 다시 시도해주세요.';
      if (mutationError instanceof Error && mutationError.message) {
        message += `\n${mutationError.message}`;
      }
      alert(message);
    },
    onSettled: () => {
      setUpdatingMemberId(null);
    },
  });

  const members = data?.content || [];
  const filteredMembers = members.filter((member) => {
    if (!normalizedQuery) {
      return true;
    }
    return (
      member.nickname.toLowerCase().includes(normalizedQuery) ||
      member.email.toLowerCase().includes(normalizedQuery)
    );
  });

  const totalMembers = data?.totalElements ?? filteredMembers.length;
  const totalPages = data?.totalPages ?? (members.length > 0 ? 1 : 0);
  const visiblePages = getVisiblePageNumbers(currentPage, totalPages);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(0);
  };

  const handleMakeAdmin = (memberId: number) => {
    changeMemberRole({ memberId, authority: 'ADMIN' });
  };

  const handleChangeToUser = (memberId: number) => {
    changeMemberRole({ memberId, authority: 'USER' });
  };

  const handlePageChange = (page: number) => {
    if (page < 0 || page === currentPage || page >= totalPages) {
      return;
    }
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <Layout title="멤버 관리">
        <Container>
          <LoadingMessage>멤버 목록을 불러오는 중...</LoadingMessage>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="멤버 관리">
        <Container>
          <ErrorMessage>
            멤버 목록을 불러오는데 실패했습니다.
            {error instanceof Error && `: ${error.message}`}
          </ErrorMessage>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout title="멤버 관리">
      <Container>
        <Header>
          <Title>전체 회원 ({totalMembers}명)</Title>
        </Header>

        <SearchBar>
          <FiSearch size={20} />
          <SearchInput
            type="text"
            placeholder="이름 또는 이메일로 검색..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </SearchBar>

        <Table>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>이름</Th>
              <Th>이메일</Th>
              <Th>역할</Th>
              <Th>가입일</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredMembers.length === 0 ? (
              <Tr>
                <Td colSpan={5}>
                  <EmptyState>
                    {normalizedQuery
                      ? '검색 조건에 해당하는 멤버가 없습니다.'
                      : '등록된 멤버가 없습니다.'}
                  </EmptyState>
                </Td>
              </Tr>
            ) : (
              filteredMembers.map((member) => (
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
                          disabled={
                            isUpdatingRole && updatingMemberId === member.id
                          }
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
                          disabled={
                            isUpdatingRole && updatingMemberId === member.id
                          }
                        >
                          {isUpdatingRole && updatingMemberId === member.id
                            ? '변경 중...'
                            : '일반 회원 전환'}
                        </Button>
                      )}
                    </ActionButtons>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>

        {totalMembers > 0 && totalPages > 0 && (
          <PaginationContainer>
            <PaginationInfo>
              총 {totalMembers.toLocaleString()}명 · 페이지 {currentPage + 1} /{' '}
              {totalPages}
            </PaginationInfo>
            <PaginationControls>
              <PaginationButton
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                <FiChevronLeft />
              </PaginationButton>
              {visiblePages.map((page) => (
                <PaginationButton
                  key={page}
                  type="button"
                  active={page === currentPage}
                  onClick={() => handlePageChange(page)}
                >
                  {page + 1}
                </PaginationButton>
              ))}
              <PaginationButton
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
              >
                <FiChevronRight />
              </PaginationButton>
            </PaginationControls>
          </PaginationContainer>
        )}
      </Container>
    </Layout>
  );
}

const getVisiblePageNumbers = (currentPage: number, totalPages: number) => {
  if (totalPages <= 0) {
    return [];
  }

  const visibleCount = Math.min(MAX_VISIBLE_PAGES, totalPages);
  let start = Math.max(currentPage - Math.floor(visibleCount / 2), 0);
  let end = start + visibleCount;

  if (end > totalPages) {
    end = totalPages;
    start = totalPages - visibleCount;
  }

  return Array.from({ length: end - start }, (_, index) => start + index);
};

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  background-color: ${({ theme }) => theme.colors.white};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.xl};
`;

const SearchBar = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const SearchInput = styled.input`
  max-width: 400px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  flex: 1;

  font-size: ${({ theme }) => theme.fontSize.base};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background-color: ${({ theme }) => theme.colors.gray50};
`;

const Th = styled.th`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: left;
`;

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

const LoadingMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.base};
  text-align: center;
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};

  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSize.base};
  text-align: center;
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} 0;

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;
`;

const PaginationContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

const PaginationControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

const PaginationButton = styled.button<{ active?: boolean }>`
  min-width: 36px;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border: 1px solid
    ${({ active, theme }) =>
      active ? theme.colors.primary : theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  display: inline-flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;
  justify-content: center;

  background-color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.white};
  color: ${({ active, theme }) =>
    active ? theme.colors.white : theme.colors.gray700};
  font-weight: ${({ active, theme }) =>
    active ? theme.fontWeight.semibold : theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};

  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.gray400};

    border-color: ${({ theme }) => theme.colors.gray200};
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${({ active, theme }) =>
      active ? theme.colors.primaryHover : theme.colors.gray50};
  }
`;

const PaginationInfo = styled.span`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
