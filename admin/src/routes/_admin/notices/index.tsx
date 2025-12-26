import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FiPlus } from 'react-icons/fi';
import { noticesQueries } from '@/apis/notices/notices.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import Pagination from '@/components/Pagination';
import { NoticeList } from '@/pages/notices/NoticeList';

export const Route = createFileRoute('/_admin/notices/')({
  component: NoticesPage,
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page ?? 0),
    size: Number(search.size ?? 10),
  }),
});

function NoticesPage() {
  const search = useSearch({ from: Route.id });

  return (
    <Layout title="공지사항">
      <ErrorBoundary fallback={<div>에러가 발생했습니다.</div>}>
        <Suspense fallback={<div>로딩 중...</div>}>
          <NoticeContent search={search} />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

function NoticeContent({ search }: { search: Record<string, unknown> }) {
  const navigate = useNavigate();
  const { data } = useSuspenseQuery(noticesQueries.list(search));

  if (!data) return null;

  const handlePageChange = (page: number) => {
    navigate({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      search: { ...search, page } as any,
    });
  };

  return (
    <Container>
      <Header>
        <Title>공지사항 ({data.totalElements}개)</Title>
        <Link to="/notices/new">
          <Button>
            <FiPlus />새 공지사항
          </Button>
        </Link>
      </Header>

      <NoticeList notices={data.content} />

      {data.totalElements > 0 && (
        <Pagination
          totalCount={data.totalElements}
          totalPages={data.totalPages}
          currentPage={data.number}
          onPageChange={handlePageChange}
          countUnitLabel="개"
        />
      )}
    </Container>
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
