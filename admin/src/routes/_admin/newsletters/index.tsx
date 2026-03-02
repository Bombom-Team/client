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
  NEWSLETTER_DETAIL_STATUS_LABELS,
  type NewsletterDetailStatusType,
  type NewsletterStatusType,
  PREVIOUS_STRATEGY_LABELS,
} from '@/types/newsletter';

type StatusBadgeTone =
  | 'active'
  | 'suspendedVisible'
  | 'suspendedHidden'
  | 'discontinued'
  | 'unknown';

export const Route = createFileRoute('/_admin/newsletters/')({
  component: NewslettersPage,
  validateSearch: (search: Record<string, unknown>) => ({
    sort: (search.sort as unknown as string) || 'POPULAR',
    page: Number(search.page ?? 0),
    size: Number(search.size ?? 20),
    keyword: (search.keyword as string) || undefined,
    category: (search.category as string) || undefined,
    previousStrategy: (search.previousStrategy as string) || undefined,
    status: (search.status as string) || undefined,
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
  const [isBusinessRuleOpen, setIsBusinessRuleOpen] = useState(false);

  if (!data) return null;

  const STATUS_LABELS: Record<
    NewsletterStatusType | NewsletterDetailStatusType,
    string
  > = {
    ACTIVE: '발행중',
    SUSPENDED: '휴재',
    SUSPENDED_VISIBLE: '휴재(노출)',
    SUSPENDED_HIDDEN: '휴재(비노출)',
    DISCONTINUED: '폐간',
  };

  const getStatusLabel = (
    status?: NewsletterStatusType | NewsletterDetailStatusType,
  ) => {
    if (!status) return '상태 없음';
    return STATUS_LABELS[status] ?? '상태 미정';
  };

  const getStatusTone = (
    status?: NewsletterStatusType | NewsletterDetailStatusType,
  ): StatusBadgeTone => {
    if (!status) return 'unknown';
    if (status === 'ACTIVE') return 'active';
    if (status === 'SUSPENDED_VISIBLE') return 'suspendedVisible';
    if (status === 'SUSPENDED_HIDDEN') return 'suspendedHidden';
    if (status === 'SUSPENDED') return 'suspendedVisible';
    if (status === 'DISCONTINUED') return 'discontinued';
    return 'unknown';
  };

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
        status: search.status,
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
                  status: search.status,
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
                  status: search.status,
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
          <FilterSelect
            value={(search.status as string) || ''}
            onChange={(e) => {
              navigate({
                search: {
                  ...search,
                  page: 0,
                  keyword: keyword || undefined,
                  category: selectedCategory || undefined,
                  previousStrategy: search.previousStrategy,
                  status: e.target.value || undefined,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any,
              });
            }}
          >
            <option value="">발행 상태</option>
            {Object.entries(NEWSLETTER_DETAIL_STATUS_LABELS).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </FilterSelect>
        </SearchForm>
        <BusinessRuleToggle
          type="button"
          onClick={() => setIsBusinessRuleOpen((prev) => !prev)}
        >
          <BusinessRuleArrow>
            {isBusinessRuleOpen ? '▼' : '▶'}
          </BusinessRuleArrow>
          비즈니스 규칙
        </BusinessRuleToggle>
        {isBusinessRuleOpen && (
          <BusinessRuleBox>
            <BusinessRuleTitle>휴재 노출/비노출 기준</BusinessRuleTitle>
            <BusinessRuleText>
              <strong>휴재(노출)</strong>: 휴재 상태이지만 서비스에 노출되는
              상태
            </BusinessRuleText>
            <BusinessRuleText>
              <strong>휴재(비노출)</strong>: 휴재 상태이며 서비스에서 숨김
              처리되는 상태
            </BusinessRuleText>
            <BusinessRuleText>
              위 구분은 백엔드가 `suspendedAt` 등 상태 변경 정보로 계산한 응답
              값을 기준으로 합니다. (현재 6개월 기준)
            </BusinessRuleText>
          </BusinessRuleBox>
        )}
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
                    <TopMetaRow>
                      <Category>{newsletter.categoryName}</Category>
                      <StatusBadge $tone={getStatusTone(newsletter.status)}>
                        {getStatusLabel(newsletter.status)}
                      </StatusBadge>
                    </TopMetaRow>
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

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-direction: column;

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

const TopMetaRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;
  justify-content: space-between;
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

const STATUS_BADGE_COLORS: Record<
  StatusBadgeTone,
  {
    border: string;
    background: string;
    text: string;
    dot: string;
  }
> = {
  active: {
    border: '#bbf7d0',
    background: '#f0fdf4',
    text: '#166534',
    dot: '#16a34a',
  },
  suspendedVisible: {
    border: '#fde68a',
    background: '#fffbeb',
    text: '#92400e',
    dot: '#d97706',
  },
  suspendedHidden: {
    border: '#ddd6fe',
    background: '#f5f3ff',
    text: '#5b21b6',
    dot: '#7c3aed',
  },
  discontinued: {
    border: '#fecaca',
    background: '#fef2f2',
    text: '#991b1b',
    dot: '#dc2626',
  },
  unknown: {
    border: '#e5e7eb',
    background: '#f9fafb',
    text: '#374151',
    dot: '#6b7280',
  },
};

const StatusBadge = styled.span<{ $tone: StatusBadgeTone }>`
  padding: 5px 11px;
  border: 1px solid
    ${({ $tone }) => STATUS_BADGE_COLORS[$tone ?? 'unknown'].border};
  border-radius: 999px;

  display: inline-flex;
  gap: 6px;
  align-items: center;

  background-color: ${({ $tone }) =>
    STATUS_BADGE_COLORS[$tone ?? 'unknown'].background};
  color: ${({ $tone }) => STATUS_BADGE_COLORS[$tone ?? 'unknown'].text};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: 12px;
  line-height: 1.2;
  white-space: nowrap;

  text-shadow: none;

  &::before {
    width: 7px;
    height: 7px;
    border-radius: 999px;

    background-color: ${({ $tone }) => STATUS_BADGE_COLORS[$tone].dot};

    content: '';
  }
`;

const EmptyState = styled.div`
  padding: 4rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  background: white;
  color: ${({ theme }) => theme.colors.gray500};
  text-align: center;
`;

const BusinessRuleToggle = styled.button`
  padding: 0;
  border: none;

  display: inline-flex;
  gap: 6px;
  align-items: center;
  align-self: flex-start;

  background: transparent;
  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.sm};

  cursor: pointer;
`;

const BusinessRuleArrow = styled.span`
  width: 10px;

  display: inline-flex;
  justify-content: center;

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1;
`;

const BusinessRuleBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  display: flex;
  gap: 4px;
  flex-direction: column;

  background: ${({ theme }) => theme.colors.gray50};
`;

const BusinessRuleTitle = styled.span`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const BusinessRuleText = styled.span`
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.xs};
  line-height: 1.5;
`;
