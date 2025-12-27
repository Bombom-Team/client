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
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

// New SearchSection to mimic the white box look
const SearchSection = styled.div`
  background: white;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  /* box-shadow: ${({ theme }) => theme.shadows.sm}; */
`;

const TopAction = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SearchForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  width: 100%;
`;

const SearchInputWrapper = styled.div`
  flex: 1;
  position: relative;
  display: flex;
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
  appearance: none;
  padding: ${({ theme }) => theme.spacing.md};
  padding-right: 48px; /* Extra space for arrow */
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: white;
  min-width: 150px;
  font-size: ${({ theme }) => theme.fontSize.base};
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FilterSelect = styled.select`
  appearance: none;
  padding: ${({ theme }) => theme.spacing.md};
  padding-right: 48px; /* Extra space for arrow */
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: white;
  min-width: 180px;
  font-size: ${({ theme }) => theme.fontSize.base};
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const NewsletterList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 1440px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const NewsletterCard = styled(Link)`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  text-decoration: none;
  color: inherit;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
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
  object-fit: cover;
  background-color: #f3f4f6;
  flex-shrink: 0;
`;

const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const Category = styled.span`
  background-color: #ffedd5;
  color: #ea580c;
  font-size: 10px;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  padding: 3px 8px;
  border-radius: 4px;
  display: inline-block;
  align-self: flex-start;
`;

const Name = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray900};
  margin: 0;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MetaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: 4px;
  align-items: flex-start;
`;

const IssueCycleBadge = styled.span`
  color: ${({ theme }) => theme.colors.gray700};
  background-color: ${({ theme }) => theme.colors.gray100};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  line-height: 1.3;
  word-break: keep-all;
  white-space: pre-wrap;
  text-align: left;
`;

const SubscriptionCount = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray500};
  display: flex;
  align-items: center;
`;

const EmptyState = styled.div`
  padding: 4rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray500};
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;
