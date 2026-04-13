import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FiSearch } from 'react-icons/fi';
import { Layout } from '@/components/Layout';
import Pagination from '@/components/Pagination';
import { MembersTableBody } from '@/pages/members/MembersTableBody';

export const Route = createFileRoute('/_admin/members')({
  validateSearch: (search: Record<string, unknown>) => ({
    page: Math.max(Number(search.page ?? 0) || 0, 0),
    query:
      typeof search.query === 'string' && search.query.trim()
        ? search.query
        : undefined,
  }),
  component: MembersPage,
});

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_DELAY = 300;
const getMembersSearchParams = (page: number, query?: string) => ({
  page,
  query: query?.trim() ? query : undefined,
});

function MembersPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [searchInput, setSearchInput] = useState(search.query ?? '');
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setSearchInput(search.query ?? '');
  }, [search.query]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchInput === (search.query ?? '')) {
        return;
      }

      navigate({
        search: getMembersSearchParams(0, searchInput),
        replace: true,
      });
    }, SEARCH_DEBOUNCE_DELAY);

    return () => window.clearTimeout(timer);
  }, [navigate, search.query, searchInput]);

  const handlePageChange = (page: number) => {
    if (page < 0 || page === search.page || page >= totalPages) {
      return;
    }

    navigate({
      search: getMembersSearchParams(page, search.query),
    });
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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </SearchBar>

        <Table>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>이름</Th>
              <Th>이메일</Th>
              <Th>역할</Th>
              <Th>관리</Th>
            </Tr>
          </Thead>
          <ErrorBoundary fallback={<MembersTableBody.Error />}>
            <Suspense fallback={<MembersTableBody.Loading />}>
              <MembersTableBody
                currentPage={search.page}
                pageSize={PAGE_SIZE}
                searchQuery={search.query ?? ''}
                onDataLoaded={handleDataLoaded}
              />
            </Suspense>
          </ErrorBoundary>
        </Table>

        {totalMembers > 0 && totalPages > 0 && (
          <Pagination
            totalCount={totalMembers}
            totalPages={totalPages}
            currentPage={search.page}
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
