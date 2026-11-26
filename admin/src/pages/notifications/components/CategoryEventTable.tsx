import styled from '@emotion/styled';
import type {
  NotificationCategory,
  NotificationCategoryStats,
} from '@/apis/notificationStats/notificationStats.api';

const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  ARTICLE: '아티클 도착',
  EVENT: '이벤트',
  CHALLENGE_START: '챌린지 시작',
  CHALLENGE_TODO_REMINDER: '챌린지 할 일 리마인드',
  INQUIRY_MESSAGE_ARRIVAL: '문의 답변 도착',
};

// 수신 거부 시 알림 row를 지우는 카테고리라 스킵이 기록되지 않는다.
const SKIP_NOT_RECORDED_CATEGORIES: NotificationCategory[] = [
  'ARTICLE',
  'INQUIRY_MESSAGE_ARRIVAL',
];

const formatCount = (value: number | undefined) =>
  value === undefined ? '집계 없음' : value.toLocaleString('ko-KR');

const formatRate = (rate: number) =>
  `${(rate * 100).toLocaleString('ko-KR', { maximumFractionDigits: 1 })}%`;

const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${Math.round(seconds)}초`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}분`;
  return `${(seconds / 3600).toLocaleString('ko-KR', {
    maximumFractionDigits: 1,
  })}시간`;
};

interface CategoryEventTableProps {
  categories: NotificationCategoryStats[];
}

const CategoryEventTable = ({ categories }: CategoryEventTableProps) => {
  const maxOpenRate = Math.max(
    ...categories.map(({ openRate }) => openRate ?? 0),
    0,
  );
  const failureCategories = categories.filter(
    ({ failureReasons }) => failureReasons.length > 0,
  );

  return (
    <Container aria-labelledby="category-event-heading">
      <SectionTitle id="category-event-heading">
        카테고리별 알림 이벤트
      </SectionTitle>
      <TableWrapper>
        <Table>
          <caption>
            카테고리별 열림률, 열림, 발송 결과. 빗금 막대는 분모가 수신 동의
            회원 수인 근사치예요.
          </caption>
          <thead>
            <tr>
              <th scope="col" rowSpan={2}>
                카테고리
              </th>
              <th scope="colgroup" colSpan={4}>
                열림
              </th>
              <th scope="colgroup" colSpan={6}>
                발송
              </th>
            </tr>
            <tr>
              <th scope="col">열림률</th>
              <th scope="col">고유 열림</th>
              <th scope="col">미연결</th>
              <th scope="col">열림까지</th>
              <th scope="col">수신 동의</th>
              <th scope="col">발송</th>
              <th scope="col">실패</th>
              <th scope="col">소진</th>
              <th scope="col">스킵</th>
              <th scope="col">기기 성공/실패</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((stats) => {
              const isTopic = stats.deliveryMode === 'TOPIC';
              const { statusCounts, deviceSends } = stats;

              return (
                <tr key={stats.category}>
                  <th scope="row">
                    <CategoryName>
                      {CATEGORY_LABELS[stats.category]}
                    </CategoryName>
                    {isTopic && <TopicTag>토픽 발송</TopicTag>}
                  </th>
                  <td>
                    {stats.openRate === null ? (
                      <MutedText>계산 불가</MutedText>
                    ) : (
                      <RateWrapper>
                        <strong>
                          {isTopic && '≈ '}
                          {formatRate(stats.openRate)}
                        </strong>
                        <RateTrack aria-hidden="true">
                          <RateBar
                            data-approximate={isTopic}
                            style={{
                              width: `${maxOpenRate > 0 ? (stats.openRate / maxOpenRate) * 100 : 0}%`,
                            }}
                          />
                        </RateTrack>
                      </RateWrapper>
                    )}
                  </td>
                  <td>
                    {formatCount(stats.opens.uniqueLinked)}
                    <SubText>전체 {formatCount(stats.opens.linked)}</SubText>
                  </td>
                  <td>{formatCount(stats.opens.unlinked)}</td>
                  <td>
                    {stats.medianSecondsToOpen === null ? (
                      <MutedText>
                        {isTopic ? '해당 없음' : '집계 없음'}
                      </MutedText>
                    ) : (
                      formatDuration(stats.medianSecondsToOpen)
                    )}
                  </td>
                  <td>
                    {stats.consentingMembers === null ? (
                      <MutedText>집계 없음</MutedText>
                    ) : (
                      formatCount(stats.consentingMembers)
                    )}
                  </td>
                  {statusCounts ? (
                    <>
                      <td>{formatCount(statusCounts.SENT)}</td>
                      <td>{formatCount(statusCounts.FAILED)}</td>
                      <td>{formatCount(statusCounts.DEAD)}</td>
                      <td>
                        {SKIP_NOT_RECORDED_CATEGORIES.includes(
                          stats.category,
                        ) ? (
                          <MutedText>집계 안 됨</MutedText>
                        ) : (
                          formatCount(statusCounts.SKIPPED)
                        )}
                      </td>
                    </>
                  ) : (
                    <td colSpan={4}>
                      <MutedText>
                        {isTopic
                          ? '토픽 1회 발송이라 회원별 결과가 없어요'
                          : '집계 없음'}
                      </MutedText>
                    </td>
                  )}
                  <td>
                    {deviceSends ? (
                      `${formatCount(deviceSends.success)} / ${formatCount(deviceSends.failure)}`
                    ) : (
                      <MutedText>
                        {isTopic ? '해당 없음' : '집계 없음'}
                      </MutedText>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </TableWrapper>
      {failureCategories.length > 0 && (
        <FailureBox>
          <summary>실패 사유 보기</summary>
          <FailureList>
            {failureCategories.map(({ category, failureReasons }) => (
              <li key={category}>
                <strong>{CATEGORY_LABELS[category]}</strong>
                <ul>
                  {failureReasons.map(({ reason, count }) => (
                    <li key={reason}>
                      {reason} · {count.toLocaleString('ko-KR')}건
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </FailureList>
        </FailureBox>
      )}
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
  min-width: 1040px;

  border-collapse: collapse;

  font-variant-numeric: tabular-nums;

  caption {
    padding-bottom: var(--seed-dimension-x3);

    color: var(--seed-color-fg-neutral-muted);
    font-size: var(--seed-font-size-t3);
    text-align: left;
  }

  th,
  td {
    padding: var(--seed-dimension-x3);
    border-bottom: 1px solid var(--seed-color-stroke-neutral-weak);

    text-align: right;
    vertical-align: top;
    white-space: nowrap;
  }

  thead th {
    color: var(--seed-color-fg-neutral-muted);
    font-weight: var(--seed-font-weight-medium);
    font-size: var(--seed-font-size-t3);
  }

  tbody th {
    text-align: left;
  }

  tbody tr:last-of-type th,
  tbody tr:last-of-type td {
    border-bottom: none;
  }

  thead tr:first-of-type th {
    text-align: center;
    border-bottom-color: var(--seed-color-stroke-neutral-solid);
  }

  thead tr:first-of-type th:first-of-type {
    text-align: left;
  }
`;
const CategoryName = styled.span`
  display: block;
  font-weight: var(--seed-font-weight-bold);
`;
const TopicTag = styled.span`
  margin-top: var(--seed-dimension-x1);
  padding: 0 var(--seed-dimension-x2);
  border-radius: var(--seed-radius-r1);

  display: inline-block;

  background-color: var(--seed-color-bg-neutral-weak);
  color: var(--seed-color-fg-neutral-muted);
  font-weight: var(--seed-font-weight-medium);
  font-size: var(--seed-font-size-t2);
`;
const RateWrapper = styled.div`
  min-width: 160px;

  display: grid;
  gap: var(--seed-dimension-x1);

  strong {
    font-weight: var(--seed-font-weight-bold);
    font-size: var(--seed-font-size-t5);
  }
`;
const RateTrack = styled.span`
  overflow: hidden;
  height: 8px;
  border-radius: var(--seed-radius-full);

  display: block;

  background-color: var(--seed-color-bg-neutral-weak);
`;
const RateBar = styled.span`
  height: 100%;
  border-radius: var(--seed-radius-full);

  display: block;

  background-color: var(--seed-color-bg-brand-solid);

  &[data-approximate='true'] {
    background: repeating-linear-gradient(
      -45deg,
      var(--seed-color-palette-carrot-500) 0 4px,
      var(--seed-color-palette-carrot-200) 4px 8px
    );
  }
`;
const SubText = styled.span`
  display: block;

  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t2);
`;
const MutedText = styled.span`
  color: var(--seed-color-fg-neutral-subtle);
  font-size: var(--seed-font-size-t3);
`;
const FailureBox = styled.details`
  color: var(--seed-color-fg-neutral-muted);

  summary {
    font-weight: var(--seed-font-weight-medium);
    cursor: pointer;
  }
`;
const FailureList = styled.ul`
  margin-top: var(--seed-dimension-x3);
  padding-left: var(--seed-dimension-x5);

  display: grid;
  gap: var(--seed-dimension-x3);

  ul {
    margin-top: var(--seed-dimension-x1);
    padding-left: var(--seed-dimension-x5);
  }
`;
