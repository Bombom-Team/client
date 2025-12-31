import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { Suspense, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { newslettersQueries } from '@/apis/newsletters/newsletters.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import NewsletterList from '@/pages/newsletters/NewsletterList';
import {
  NEWSLETTER_PREVIOUS_STRATEGY_LABELS,
  NEWSLETTER_SORT_LABELS,
  type NewsletterPreviousStrategy,
  type NewsletterSortType,
} from '@/types/newsletter';

type NewslettersSearch = {
  keyword: string;
  category: string;
  previousStrategy: string;
  sort: string;
};

const NewslettersPage = () => {
  const search = useSearch({ from: Route.id });

  return (
    <Layout title="뉴스레터 관리">
      <ErrorBoundary fallback={<div>에러가 발생했습니다.</div>}>
        <Suspense fallback={<div>로딩 중...</div>}>
          <NewslettersContent search={search} />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
};

const NewslettersContent = ({ search }: { search: NewslettersSearch }) => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState(search.keyword);
  const [category, setCategory] = useState(search.category);
  const [previousStrategy, setPreviousStrategy] = useState(
    search.previousStrategy,
  );
  const [sort, setSort] = useState(search.sort);

  useEffect(() => {
    setKeyword(search.keyword);
    setCategory(search.category);
    setPreviousStrategy(search.previousStrategy);
    setSort(search.sort);
  }, [search]);

  const { data } = useSuspenseQuery(
    newslettersQueries.list({
      keyword: search.keyword.trim() || undefined,
      category: search.category.trim() || undefined,
      previousStrategy: search.previousStrategy
        ? (search.previousStrategy as NewsletterPreviousStrategy)
        : undefined,
      sort: (search.sort || undefined) as NewsletterSortType | undefined,
    }),
  );

  const previousStrategyOptions = Object.entries(
    NEWSLETTER_PREVIOUS_STRATEGY_LABELS,
  ).map(([value, label]) => ({
    value,
    label,
  }));
  const sortOptions = Object.entries(NEWSLETTER_SORT_LABELS).map(
    ([value, label]) => ({
      value,
      label,
    }),
  );

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate({
      to: '/newsletters',
      search: {
        keyword: keyword.trim(),
        category: category.trim(),
        previousStrategy,
        sort,
      } as NewslettersSearch,
    });
  };

  return (
    <Container>
      <Header>
        <Title>뉴스레터 ({data?.length ?? 0}개)</Title>
        <Link to="/newsletters/new">
          <Button>
            <FiPlus />새 뉴스레터
          </Button>
        </Link>
      </Header>

      <FilterForm onSubmit={handleSearchSubmit}>
        <FilterRow>
          <FilterGroup>
            <FilterLabel>키워드</FilterLabel>
            <FilterInput
              type="text"
              placeholder="이름/설명 검색"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>카테고리</FilterLabel>
            <FilterInput
              type="text"
              placeholder="카테고리 입력"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            />
          </FilterGroup>
        </FilterRow>
        <FilterRow>
          <FilterGroup>
            <FilterLabel>지난호 전략</FilterLabel>
            <FilterSelect
              value={previousStrategy}
              onChange={(event) => setPreviousStrategy(event.target.value)}
            >
              <option value="">전체</option>
              {previousStrategyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>정렬</FilterLabel>
            <FilterSelect
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
          <FilterActions>
            <Button type="submit">
              <FiSearch />
              검색
            </Button>
          </FilterActions>
        </FilterRow>
      </FilterForm>

      <NewsletterList newsletters={data ?? []} />
    </Container>
  );
};

export const Route = createFileRoute('/_admin/newsletters/')({
  component: NewslettersPage,
  validateSearch: (search: Record<string, unknown>): NewslettersSearch => ({
    keyword: typeof search.keyword === 'string' ? search.keyword : '',
    category: typeof search.category === 'string' ? search.category : '',
    previousStrategy:
      typeof search.previousStrategy === 'string'
        ? search.previousStrategy
        : '',
    sort: typeof search.sort === 'string' ? search.sort : 'LATEST',
  }),
});

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

const FilterForm = styled.form`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-direction: column;
`;

const FilterRow = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};

  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

const FilterGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-direction: column;
`;

const FilterLabel = styled.label`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const FilterInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  font-size: ${({ theme }) => theme.fontSize.base};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSize.base};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FilterActions = styled.div`
  display: flex;
  align-items: flex-end;
`;
