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
import {
  type FaqCategoryType,
  FAQ_CATEGORY_LABELS,
  getFaqCategoryColor,
} from '@/types/faq';

const FAQ_CATEGORY_FILTER_OPTIONS: {
  label: string;
  value?: FaqCategoryType;
}[] = [
  { label: '전체', value: undefined },
  ...Object.entries(FAQ_CATEGORY_LABELS).map(([value, label]) => ({
    label,
    value: value as FaqCategoryType,
  })),
];

export const Route = createFileRoute('/_admin/faqs/')({
  component: FaqsPage,
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page ?? 0),
    size: Number(search.size ?? 10),
    faqCategory: search.faqCategory as FaqCategoryType | undefined,
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

  const handleCategoryChange = (faqCategory: FaqCategoryType | undefined) => {
    navigate({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      search: { ...search, faqCategory, page: 0 } as any,
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

      <CategoryTabs>
        {FAQ_CATEGORY_FILTER_OPTIONS.map((option) => (
          <CategoryTab
            key={option.label}
            type="button"
            $active={search.faqCategory === option.value}
            $color={
              option.value ? getFaqCategoryColor(option.value) : undefined
            }
            onClick={() => handleCategoryChange(option.value)}
          >
            {option.label}
          </CategoryTab>
        ))}
      </CategoryTabs>

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

const CategoryTabs = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const CategoryTab = styled('button', {
  shouldForwardProp: (prop) => prop !== '$active' && prop !== '$color',
})<{ $active: boolean; $color?: string }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border: 1px solid
    ${({ $active, $color, theme }) =>
      $active ? ($color ?? theme.colors.primary) : theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.full};

  background-color: ${({ $active, $color, theme }) =>
    $active ? ($color ?? theme.colors.primary) : theme.colors.white};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.white : theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};

  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ $color, theme }) => $color ?? theme.colors.primary};
  }
`;
