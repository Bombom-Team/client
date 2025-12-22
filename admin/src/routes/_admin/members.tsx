import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense, useCallback, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FiSearch } from 'react-icons/fi';
import { Layout } from '@/components/Layout';
import Pagination from '@/components/Pagination';
import { MembersTableBody } from '@/pages/members/MembersTableBody';

export const Route = createFileRoute('/_admin/members')({
  component: MembersPage,
});

const PAGE_SIZE = 10;

function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    if (page < 0 || page === currentPage || page >= totalPages) {
      return;
    }
    setCurrentPage(page);
  };

  const handleDataLoaded = useCallback(
    (newTotalElements: number, newTotalPages: number) => {
      setTotalMembers(newTotalElements);
      setTotalPages(newTotalPages);
    },
    [],
  );

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
          <ErrorBoundary fallback={<MembersTableBody.Error />}>
            <Suspense fallback={<MembersTableBody.Loading />}>
              <MembersTableBody
                currentPage={currentPage}
                pageSize={PAGE_SIZE}
                searchQuery={searchQuery}
                onDataLoaded={handleDataLoaded}
              />
            </Suspense>
          </ErrorBoundary>
        </Table>

        {totalMembers > 0 && totalPages > 0 && (
          <Pagination
            totalCount={totalMembers}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            countUnitLabel="명"
          />
        )}
      </Container>
    </Layout>
  );
}

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

const Tr = styled.tr`
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }
`;
