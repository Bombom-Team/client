import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { isOverdue } from '@/apis/reviewers/reviewers.api';
import { reviewersQueries } from '@/apis/reviewers/reviewers.query';
import { Layout } from '@/components/Layout';
import {
  AddReviewerModal,
  SettingModal,
} from '@/components/reviewers/ReviewerModals';
import {
  ReviewersTableBody,
  ReviewersTableBodyError,
  ReviewersTableBodyLoading,
} from '@/components/reviewers/ReviewersTableBody';
import {
  SummaryStatCard,
  SummaryStatCardRow,
  SummaryStatCardSkeleton,
} from '@/components/reviewers/SummaryStatCard';

export const Route = createFileRoute('/_admin/reviewers/')({
  component: ReviewersPage,
});

type Filter = '전체' | '활성' | '휴가중';

function ReviewersDashboard() {
  const { data: reviewers } = useSuspenseQuery(reviewersQueries.list());
  const [filter, setFilter] = useState<Filter>('전체');
  const [keyword, setKeyword] = useState('');
  const [openModal, setOpenModal] = useState<'add' | 'setting' | null>(null);

  const overdueTotal = reviewers.reduce(
    (sum, r) => sum + r.openAssignments.filter(isOverdue).length,
    0,
  );
  const maxWeekly = Math.max(...reviewers.map((r) => r.weeklyCount), 1);

  const filtered = reviewers.filter((r) => {
    if (filter === '활성' && r.is_on_vacation) return false;
    if (filter === '휴가중' && !r.is_on_vacation) return false;
    if (!keyword) return true;
    return (
      r.display_name.includes(keyword) || r.github_username.includes(keyword)
    );
  });

  return (
    <Stack>
      <SummaryStatCardRow>
        <SummaryStatCard label="총 리뷰어" value={`${reviewers.length}명`} />
        <SummaryStatCard
          label="이번 주 리뷰"
          value={`${reviewers.reduce((sum, r) => sum + r.weeklyCount, 0)}건`}
        />
        <SummaryStatCard
          label="휴가 중"
          value={`${reviewers.filter((r) => r.is_on_vacation).length}명`}
        />
        <SummaryStatCard
          label="지각 배정"
          value={`${overdueTotal}건`}
          emphasis={overdueTotal > 0 ? 'error' : 'default'}
        />
      </SummaryStatCardRow>

      <Panel>
        <FilterBar>
          <TabGroup>
            {(['전체', '활성', '휴가중'] as Filter[]).map((f) => (
              <TabButton
                key={f}
                $selected={filter === f}
                onClick={() => setFilter(f)}
              >
                {f}
              </TabButton>
            ))}
          </TabGroup>
          <FilterActions>
            <SearchInput
              type="search"
              placeholder="이름 또는 GitHub 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <ActionButton onClick={() => setOpenModal('add')}>
              + 리뷰어 추가
            </ActionButton>
            <ActionButton onClick={() => setOpenModal('setting')}>
              ⚙ 설정
            </ActionButton>
          </FilterActions>
        </FilterBar>

        <Table>
          <TableHead />
          <ReviewersTableBody reviewers={filtered} maxWeekly={maxWeekly} />
        </Table>
      </Panel>

      {openModal === 'add' && (
        <AddReviewerModal onClose={() => setOpenModal(null)} />
      )}
      {openModal === 'setting' && (
        <ErrorBoundary
          fallback={<SettingModalError onClose={() => setOpenModal(null)} />}
        >
          <Suspense fallback={null}>
            <SettingModal onClose={() => setOpenModal(null)} />
          </Suspense>
        </ErrorBoundary>
      )}
    </Stack>
  );
}

const SettingModalError = ({ onClose }: { onClose: () => void }) => (
  <ModalErrorOverlay onClick={onClose}>
    <ModalErrorCard onClick={(e) => e.stopPropagation()}>
      설정을 불러오지 못했습니다. Supabase에 review_setting 테이블이 있는지
      확인해주세요.
    </ModalErrorCard>
  </ModalErrorOverlay>
);

function DashboardSkeleton() {
  return (
    <Stack>
      <SummaryStatCardRow>
        {Array.from({ length: 4 }).map((_, i) => (
          <SummaryStatCardSkeleton key={i} />
        ))}
      </SummaryStatCardRow>
      <Panel>
        <Table>
          <TableHead />
          <ReviewersTableBodyLoading />
        </Table>
      </Panel>
    </Stack>
  );
}

function DashboardError() {
  return (
    <Panel>
      <Table>
        <TableHead />
        <ReviewersTableBodyError message="리뷰어 목록을 불러오는 중 오류가 발생했습니다." />
      </Table>
    </Panel>
  );
}

const TableHead = () => (
  <thead>
    <HeadRow>
      <th>이름</th>
      <th>GitHub</th>
      <th className="num">이번 달</th>
      <th className="num">이번 주</th>
      <th>배정 부하</th>
      <th>상태</th>
      <th>휴가 설정</th>
      <th>관리</th>
    </HeadRow>
  </thead>
);

function ReviewersPage() {
  return (
    <Layout
      title="리뷰어 관리"
      rightAction={<StatsLink to="/reviewers/stats">통계 보기 →</StatsLink>}
    >
      <ErrorBoundary fallback={<DashboardError />}>
        <Suspense fallback={<DashboardSkeleton />}>
          <ReviewersDashboard />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

const Stack = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-direction: column;
`;

const Panel = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const FilterBar = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TabGroup = styled.div`
  padding: 3px;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  display: inline-flex;
  gap: 2px;

  background: ${({ theme }) => theme.colors.gray100};
`;

const TabButton = styled.button<{ $selected: boolean }>`
  padding: 6px 16px;
  border: none;
  border-radius: 6px;

  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.white : 'transparent'};
  box-shadow: ${({ theme, $selected }) =>
    $selected ? theme.shadows.sm : 'none'};
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.gray900 : theme.colors.gray500};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme, $selected }) =>
    $selected ? theme.fontWeight.semibold : theme.fontWeight.normal};

  transition: all 0.2s ease-in-out;
`;

const SearchInput = styled.input`
  width: 220px;
  height: 34px;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  font-size: ${({ theme }) => theme.fontSize.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FilterActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const ActionButton = styled.button`
  height: 34px;
  padding: 0 14px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray700};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.sm};
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
  }
`;

const ModalErrorOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(17, 24, 39, 0.4);
`;

const ModalErrorCard = styled.div`
  max-width: 360px;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.6;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const HeadRow = styled.tr`
  th {
    padding: ${({ theme }) => theme.spacing.sm}
      ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

    background: ${({ theme }) => theme.colors.gray50};
    color: ${({ theme }) => theme.colors.gray600};
    font-size: ${({ theme }) => theme.fontSize.xs};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    text-align: left;
  }

  th.num {
    text-align: right;
  }
`;

const StatsLink = styled(Link)`
  padding: 6px 14px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
  }
`;
