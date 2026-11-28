import styled from '@emotion/styled';
import { Fragment, useState } from 'react';
import NotificationCategoryDetail from './NotificationCategoryDetail';
import { CATEGORY_LABELS } from '../constants/notificationCategory';
import { formatCount, formatRate } from '../utils/formatStats';
import type { NotificationCategoryStats } from '@/apis/notificationStats/notificationStats.api';

interface CategoryEventTableProps {
  categories: NotificationCategoryStats[];
}

const CategoryEventTable = ({ categories }: CategoryEventTableProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const handleToggle = (category: string) => {
    setExpandedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  };

  return (
    <Container aria-labelledby="category-event-heading">
      <SectionTitle id="category-event-heading">상세 수치</SectionTitle>
      <TableWrapper>
        <Table aria-label="카테고리별 상세 수치">
          <thead>
            <tr>
              <th scope="col">카테고리</th>
              <th scope="col">발송</th>
              <th scope="col">열린 알림</th>
              <th scope="col">열림률</th>
              <th scope="col">발송 실패</th>
              <th scope="col">상세</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((stats) => {
              const isTopic = stats.deliveryMode === 'TOPIC';
              const isExpanded = expandedCategories.includes(stats.category);
              const failed =
                stats.statusCounts === null
                  ? null
                  : stats.statusCounts.FAILED + stats.statusCounts.DEAD;
              const detailId = `notification-detail-${stats.category}`;
              const name = CATEGORY_LABELS[stats.category];

              return (
                <Fragment key={stats.category}>
                  <tr>
                    <th scope="row">
                      {name}
                      {isTopic && <TopicTag>토픽 발송</TopicTag>}
                    </th>
                    <td>
                      {stats.statusCounts === null || isTopic ? (
                        <MutedText>—</MutedText>
                      ) : (
                        formatCount(stats.statusCounts.SENT)
                      )}
                    </td>
                    <td>{formatCount(stats.openedOfSent)}</td>
                    <td>
                      {stats.openRate === null ? (
                        <MutedText>계산 불가</MutedText>
                      ) : (
                        <strong>
                          {isTopic && '≈ '}
                          {formatRate(stats.openRate)}
                        </strong>
                      )}
                    </td>
                    <td>
                      {failed === null || isTopic ? (
                        <MutedText>—</MutedText>
                      ) : (
                        <FailureCount hasFailure={failed > 0}>
                          {formatCount(failed)}
                        </FailureCount>
                      )}
                    </td>
                    <td>
                      <DetailButton
                        type="button"
                        aria-label={`${name} 상세 ${isExpanded ? '접기' : '보기'}`}
                        aria-expanded={isExpanded}
                        aria-controls={detailId}
                        onClick={() => handleToggle(stats.category)}
                      >
                        {isExpanded ? '접기 −' : '상세 +'}
                      </DetailButton>
                    </td>
                  </tr>
                  <DetailRow id={detailId} hidden={!isExpanded}>
                    <td colSpan={6}>
                      {isExpanded && (
                        <NotificationCategoryDetail stats={stats} />
                      )}
                    </td>
                  </DetailRow>
                </Fragment>
              );
            })}
          </tbody>
        </Table>
      </TableWrapper>
      <TableNote>≈ 근사치 · — 해당 없음 · 단위: 건</TableNote>
    </Container>
  );
};

export default CategoryEventTable;

const Container = styled.section`
  padding: var(--seed-dimension-x6);
  border: 1px solid var(--seed-color-stroke-neutral-weak);
  border-radius: var(--seed-radius-r4);

  display: grid;
  gap: var(--seed-dimension-x4);

  background-color: var(--seed-color-bg-layer-default);
`;
const SectionTitle = styled.h2`
  font-weight: var(--seed-font-weight-bold);
  font-size: var(--seed-font-size-t7);
  line-height: var(--seed-line-height-t7);
`;
const TableWrapper = styled.div`
  overflow-x: auto;
`;
const Table = styled.table`
  width: 100%;
  min-width: 720px;

  border-collapse: collapse;

  font-variant-numeric: tabular-nums;

  th,
  td {
    padding: var(--seed-dimension-x4) var(--seed-dimension-x3);
    border-bottom: 1px solid var(--seed-color-stroke-neutral-weak);

    text-align: right;
    vertical-align: middle;
    white-space: nowrap;
  }

  thead th {
    background-color: var(--seed-color-bg-layer-fill);
    color: var(--seed-color-fg-neutral-muted);
    font-weight: var(--seed-font-weight-medium);
    font-size: var(--seed-font-size-t4);
  }

  tbody th {
    font-weight: var(--seed-font-weight-medium);
  }

  th:first-of-type {
    text-align: left;
  }

  tbody tr:hover {
    background-color: var(--seed-color-bg-layer-fill);
  }
`;
const DetailRow = styled.tr`
  > td {
    padding: 0;
  }
`;
const TopicTag = styled.span`
  margin-top: var(--seed-dimension-x1);

  display: block;

  color: var(--seed-color-fg-neutral-muted);
  font-weight: var(--seed-font-weight-regular);
  font-size: var(--seed-font-size-t4);
`;
const FailureCount = styled.span<{ hasFailure: boolean }>`
  color: ${({ hasFailure }) => (hasFailure ? 'var(--seed-color-fg-critical)' : 'var(--seed-color-fg-neutral-muted)')};
  font-weight: ${({ hasFailure }) => (hasFailure ? 'var(--seed-font-weight-bold)' : 'var(--seed-font-weight-regular)')};
`;
const MutedText = styled.span`
  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t4);
`;
const DetailButton = styled.button`
  min-width: 72px;
  min-height: 44px;
  padding: var(--seed-dimension-x2) var(--seed-dimension-x3);
  border: 1px solid var(--seed-color-stroke-neutral-weak);
  border-radius: var(--seed-radius-r2);

  background-color: var(--seed-color-bg-layer-default);
  color: var(--seed-color-fg-neutral);
  font-size: var(--seed-font-size-t4);

  cursor: pointer;

  &:hover {
    background-color: var(--seed-color-bg-brand-weak);
  }
`;
const TableNote = styled.p`
  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t4);
`;
