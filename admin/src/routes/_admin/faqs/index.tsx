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
import { faqsQueries } from '@/apis/faqs/faqs.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import Pagination from '@/components/Pagination';
import { FaqList } from '@/pages/faqs/FaqList';

export const Route = createFileRoute('/_admin/faqs/')({
  component: FaqsPage,
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page ?? 0),
    size: Number(search.size ?? 10),
  }),
});

function FaqsPage() {
  const search = useSearch({ from: Route.id });

  return (
    <Layout title="FAQ">
      <ErrorBoundary fallback={<div>에러가 발생했습니다.</div>}>
        <Suspense fallback={<div>로딩 중...</div>}>
          <FaqContent search={search} />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

function FaqContent({ search }: { search: Record<string, unknown> }) {
  const navigate = useNavigate();
  const { data } = useSuspenseQuery(faqsQueries.list(search));

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
        <Title>FAQ ({data.totalElements}개)</Title>
        <Link to="/faqs/new">
          <Button>
            <FiPlus />새 FAQ
          </Button>
        </Link>
      </Header>

      <FaqList faqs={data.content} />

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
