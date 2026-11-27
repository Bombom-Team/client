import styled from '@emotion/styled';
import {
  CATEGORY_LABELS,
  OPEN_NOT_RECORDED_CATEGORIES,
  SKIP_NOT_RECORDED_CATEGORIES,
} from '../constants/notificationCategory';
import { formatCount, formatDuration, formatRate } from '../utils/formatStats';
import type { NotificationCategoryStats } from '@/apis/notificationStats/notificationStats.api';

// 0은 옅게 두어 0이 아닌 실패·소진 같은 값이 먼저 보이게 한다.
const renderCount = (value: number) => (
  <CountText isZero={value === 0}>{formatCount(value)}</CountText>
);

interface CategoryEventTableProps {
  categories: NotificationCategoryStats[];
}

const CategoryEventTable = ({ categories }: CategoryEventTableProps) => {
  const failureCategories = categories.filter(
    ({ failureReasons }) => failureReasons.length > 0,
  );

  return (
    <Container aria-labelledby="category-event-heading">
      <SectionTitle id="category-event-heading">상세 수치</SectionTitle>
      <TableWrapper>
        <Table>
          <caption>
            발송 → 기기 전송 → 열림 순서예요. ≈는 수신 동의 회원 수로 나눈
            근사치, —는 해당하지 않는 값이에요. 아티클 도착·문의 답변 도착은
            수신 거부 시 기록이 남지 않아 스킵을 집계하지 않아요(미집계).
          </caption>
          <thead>
            <GroupRow>
              <th scope="col" rowSpan={2}>
                카테고리
              </th>
              <th scope="colgroup" colSpan={5} data-group-start>
                발송
              </th>
              <th scope="colgroup" colSpan={2} data-group-start>
                기기 전송
              </th>
              <th scope="colgroup" colSpan={5} data-group-start>
                열림
              </th>
            </GroupRow>
            <tr>
              <th scope="col" data-group-start>
                수신 동의
              </th>
              <th scope="col">발송</th>
              <th scope="col">실패</th>
              <th scope="col">소진</th>
              <th scope="col">스킵</th>
              <th scope="col" data-group-start>
                성공
              </th>
              <th scope="col">실패</th>
              <th scope="col" data-group-start>
                열림률
              </th>
              <th scope="col">고유 열림</th>
              <th scope="col">열림 횟수</th>
              <th scope="col">미연결</th>
              <th scope="col">열림까지</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((stats) => {
              const isTopic = stats.deliveryMode === 'TOPIC';
              const { statusCounts, deviceSends } = stats;
              const isOpenNotRecorded = OPEN_NOT_RECORDED_CATEGORIES.includes(
                stats.category,
              );
              const isSkipNotRecorded = SKIP_NOT_RECORDED_CATEGORIES.includes(
                stats.category,
              );

              return (
                <tr key={stats.category}>
                  <th scope="row">
                    <CategoryName>
                      {CATEGORY_LABELS[stats.category]}
                    </CategoryName>
                    {isTopic && <TopicTag>토픽 발송</TopicTag>}
                  </th>
                  <td data-group-start>
                    {stats.consentingMembers === null ? (
                      <MutedText>—</MutedText>
                    ) : (
                      renderCount(stats.consentingMembers)
                    )}
                  </td>
                  {isTopic ? (
                    <td colSpan={6}>
                      <MutedText>
                        토픽 1회 발송이라 회원별 결과가 없어요
                      </MutedText>
                    </td>
                  ) : (
                    <>
                      <td>
                        {statusCounts ? (
                          renderCount(statusCounts.SENT)
                        ) : (
                          <MutedText>—</MutedText>
                        )}
                      </td>
                      <td>
                        {statusCounts ? (
                          renderCount(statusCounts.FAILED)
                        ) : (
                          <MutedText>—</MutedText>
                        )}
                      </td>
                      <td>
                        {statusCounts ? (
                          renderCount(statusCounts.DEAD)
                        ) : (
                          <MutedText>—</MutedText>
                        )}
                      </td>
                      <td>
                        {statusCounts && !isSkipNotRecorded ? (
                          renderCount(statusCounts.SKIPPED)
                        ) : (
                          <MutedText>
                            {isSkipNotRecorded ? '미집계' : '—'}
                          </MutedText>
                        )}
                      </td>
                      <td data-group-start>
                        {deviceSends ? (
                          renderCount(deviceSends.success)
                        ) : (
                          <MutedText>—</MutedText>
                        )}
                      </td>
                      <td>
                        {deviceSends ? (
                          renderCount(deviceSends.failure)
                        ) : (
                          <MutedText>—</MutedText>
                        )}
                      </td>
                    </>
                  )}
                  {isOpenNotRecorded ? (
                    <td colSpan={5} data-group-start>
                      <MutedText>열림 미수집</MutedText>
                    </td>
                  ) : (
                    <>
                      <td data-group-start>
                        {stats.openRate === null ? (
                          <MutedText>계산 불가</MutedText>
                        ) : (
                          <RateText>
                            {isTopic && '≈ '}
                            {formatRate(stats.openRate)}
                          </RateText>
                        )}
                      </td>
                      <td>{renderCount(stats.opens.uniqueLinked)}</td>
                      <td>{renderCount(stats.opens.linked)}</td>
                      <td>{renderCount(stats.opens.unlinked)}</td>
                      <td>
                        {stats.medianSecondsToOpen === null ? (
                          <MutedText>—</MutedText>
                        ) : (
                          formatDuration(stats.medianSecondsToOpen)
                        )}
                      </td>
                    </>
                  )}
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
  min-width: 960px;

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
    padding: var(--seed-dimension-x3) var(--seed-dimension-x2);
    border-bottom: 1px solid var(--seed-color-stroke-neutral-weak);

    text-align: right;
    vertical-align: middle;
    white-space: nowrap;
  }

  /* 그룹이 시작하는 열에만 세로선을 둬서 발송·기기 전송·열림 묶음을 나눈다. */
  [data-group-start] {
    border-left: 1px solid var(--seed-color-stroke-neutral-weak);
  }

  thead th {
    color: var(--seed-color-fg-neutral-muted);
    font-weight: var(--seed-font-weight-medium);
    font-size: var(--seed-font-size-t3);
    vertical-align: bottom;

    border-bottom-color: var(--seed-color-stroke-neutral-solid);
  }

  thead th[rowspan],
  tbody th {
    position: sticky;
    left: 0;

    background-color: var(--seed-color-bg-layer-default);
    text-align: left;
  }

  /* 여러 칸을 합친 안내 문구가 특정 칸의 값처럼 읽히지 않게 가운데에 둔다. */
  tbody td[colspan] {
    text-align: center;
  }

  tbody tr:hover,
  tbody tr:hover th {
    background-color: var(--seed-color-bg-layer-fill);
  }

  tbody tr:last-of-type th,
  tbody tr:last-of-type td {
    border-bottom: none;
  }
`;
const GroupRow = styled.tr`
  th[scope='colgroup'] {
    padding-block: var(--seed-dimension-x2);

    background-color: var(--seed-color-bg-layer-fill);
    color: var(--seed-color-fg-neutral);
    font-weight: var(--seed-font-weight-bold);
    text-align: left;

    border-bottom-color: var(--seed-color-stroke-neutral-weak);
  }
`;
const CategoryName = styled.span`
  font-weight: var(--seed-font-weight-bold);
`;
const TopicTag = styled.span`
  margin-left: var(--seed-dimension-x2);
  padding: 0 var(--seed-dimension-x2);
  border-radius: var(--seed-radius-r1);

  display: inline-block;

  background-color: var(--seed-color-bg-neutral-weak);
  color: var(--seed-color-fg-neutral-muted);
  font-weight: var(--seed-font-weight-medium);
  font-size: var(--seed-font-size-t2);
`;
const RateText = styled.strong`
  font-weight: var(--seed-font-weight-bold);
`;
const CountText = styled.span<{ isZero: boolean }>`
  color: ${({ isZero }) =>
    isZero ? 'var(--seed-color-fg-neutral-subtle)' : 'inherit'};
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
