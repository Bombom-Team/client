import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  Link,
  createFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FiPlus } from 'react-icons/fi';
import { newslettersQueries } from '@/apis/newsletters/newsletters.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import {
  NEWSLETTER_CATEGORY_LABELS,
  PREVIOUS_STRATEGY_LABELS,
} from '@/types/newsletter';

export const Route = createFileRoute('/_admin/newsletters/')({
  component: NewslettersPage,
  validateSearch: (search: Record<string, unknown>) => ({
    sort: (search.sort as unknown as string) || 'POPULAR',
    page: Number(search.page ?? 0),
    size: Number(search.size ?? 20),
    keyword: (search.keyword as string) || undefined,
    category: (search.category as string) || undefined,
    previousStrategy: (search.previousStrategy as string) || undefined,
  }),
});

function NewslettersPage() {
  const search = useSearch({ from: Route.id });

  return (
    <Layout title="뉴스레터 관리">
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <div className="p-4 text-red-500">
            에러가 발생했습니다: {error.message}
          </div>
        )}
      >
        <Suspense fallback={<div>로딩 중...</div>}>
          <NewsletterContent search={search} />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

function NewsletterContent({ search }: { search: Record<string, unknown> }) {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = useSuspenseQuery(newslettersQueries.list(search));
  const [keyword, setKeyword] = useState((search.keyword as string) || '');
  const [selectedCategory, setSelectedCategory] = useState(
    (search.category as string) || '',
  );

  if (!data) return null;

  // Normalize data: Handle both PageableResponse and flat array
  const content = Array.isArray(data) ? data : data.content || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      search: {
        ...search,
        page: 0,
        keyword: keyword || undefined,
        category: selectedCategory || undefined,
        previousStrategy: search.previousStrategy,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    });
  };

  return (
    <Container>
      <TopAction>
        <Link to="/newsletters/new">
          <Button>
            <FiPlus />
            뉴스레터 등록
          </Button>
        </Link>
      </TopAction>

      <SearchSection>
        <SearchForm onSubmit={handleSearch}>
          <SearchInputWrapper>
            <SearchInput
              placeholder="뉴스레터 이름, 설명, 발행주기 검색..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {/* <FiSearch size={20} color="#9CA3AF" /> */}
          </SearchInputWrapper>
          <CategorySelect
            value={selectedCategory}
            onChange={(e) => {
              const newCategory = e.target.value;
              setSelectedCategory(newCategory);
              navigate({
                search: {
                  ...search,
                  page: 0,
                  keyword: keyword || undefined,
                  category: newCategory || undefined,
                  previousStrategy: search.previousStrategy,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any,
              });
            }}
          >
            <option value="">카테고리 전체</option>
            {Object.entries(NEWSLETTER_CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={label}>
                {label}
              </option>
            ))}
          </CategorySelect>
          <FilterSelect
            value={(search.previousStrategy as string) || ''}
            onChange={(e) => {
              navigate({
                search: {
                  ...search,
                  page: 0,
                  keyword: keyword || undefined,
                  category: selectedCategory || undefined,
                  previousStrategy: e.target.value || undefined,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any,
              });
            }}
          >
            <option value="">지난 아티클 공개 전략</option>
            {Object.entries(PREVIOUS_STRATEGY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </FilterSelect>
        </SearchForm>
      </SearchSection>

      {content.length === 0 ? (
        <EmptyState>등록된 뉴스레터가 없습니다.</EmptyState>
      ) : (
        <NewsletterList>
          {content.map(
            (newsletter: import('@/types/newsletter').Newsletter) => (
              <NewsletterCard
                key={newsletter.id}
                to={`/newsletters/${newsletter.id}`}
              >
                <CardHeader>
                  <Thumbnail src={newsletter.imageUrl} alt={newsletter.name} />
                  <Info>
                    <Category>{newsletter.categoryName}</Category>
                    <Name>{newsletter.name}</Name>
                    <MetaInfo>
                      <IssueCycleBadge>{newsletter.issueCycle}</IssueCycleBadge>
                      <SubscriptionCount>
                        구독자 {newsletter.subscriptionCount?.toLocaleString()}
                        명
                      </SubscriptionCount>
                    </MetaInfo>
                  </Info>
                </CardHeader>
              </NewsletterCard>
            ),
          )}
        </NewsletterList>
      )}

      {/* {totalElements > 0 && (
                <Pagination
                    totalCount={totalElements}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    countUnitLabel="개"
                />
            )} */}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-direction: column;
`;

// New SearchSection to mimic the white box look
const SearchSection = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  background: white;

  /* box-shadow: ${({ theme }) => theme.shadows.sm}; */
`;

const TopAction = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SearchForm = styled.form`
  width: 100%;

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const SearchInputWrapper = styled.div`
  position: relative;

  display: flex;
  flex: 1;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  padding-right: 40px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  font-size: ${({ theme }) => theme.fontSize.base};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CategorySelect = styled.select`
  min-width: 150px;
  padding: ${({ theme }) => theme.spacing.md};
  padding-right: 48px; /* Extra space for arrow */
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: white;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  font-size: ${({ theme }) => theme.fontSize.base};

  appearance: none;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FilterSelect = styled.select`
  min-width: 180px;
  padding: ${({ theme }) => theme.spacing.md};
  padding-right: 48px; /* Extra space for arrow */
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: white;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  font-size: ${({ theme }) => theme.fontSize.base};

  appearance: none;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const NewsletterList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};

  grid-template-columns: repeat(4, 1fr);

  @media (width <= 1440px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (width <= 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (width <= 640px) {
    grid-template-columns: 1fr;
  }
`;

const NewsletterCard = styled(Link)`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-direction: column;

  background: white;
  color: inherit;

  text-decoration: none;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Thumbnail = styled.img`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  flex-shrink: 0;

  background-color: #f3f4f6;

  object-fit: cover;
`;

const Info = styled.div`
  min-width: 0;

  display: flex;
  gap: 2px;
  flex: 1;
  flex-direction: column;
`;

const Category = styled.span`
  padding: 3px 8px;
  border-radius: 4px;

  display: inline-block;
  align-self: flex-start;

  background-color: #ffedd5;
  color: #ea580c;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: 10px;
`;

const Name = styled.h3`
  overflow: hidden;
  margin: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.base};
  line-height: 1.4;
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const MetaInfo = styled.div`
  margin-top: 4px;

  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-direction: column;
  align-items: flex-start;
`;

const IssueCycleBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;

  background-color: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: 11px;
  line-height: 1.3;
  text-align: left;
  white-space: pre-wrap;

  word-break: keep-all;
`;

const SubscriptionCount = styled.span`
  display: flex;
  align-items: center;

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const EmptyState = styled.div`
  padding: 4rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  background: white;
  color: ${({ theme }) => theme.colors.gray500};
  text-align: center;
`;
