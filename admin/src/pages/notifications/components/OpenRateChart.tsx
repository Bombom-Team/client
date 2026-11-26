import styled from '@emotion/styled';
import {
  CATEGORY_LABELS,
  OPEN_NOT_RECORDED_CATEGORIES,
} from '../constants/notificationCategory';
import { formatCount, formatRate } from '../utils/formatStats';
import type { NotificationCategoryStats } from '@/apis/notificationStats/notificationStats.api';

// 카테고리 간 비교가 왜곡되지 않도록 최댓값이 아닌 0~100% 고정 축을 쓴다.
const AXIS_TICKS = [0, 25, 50, 75, 100];

const isRateMeasured = ({ category, openRate }: NotificationCategoryStats) =>
  openRate !== null && !OPEN_NOT_RECORDED_CATEGORIES.includes(category);

const getDenominatorText = ({
  deliveryMode,
  statusCounts,
  consentingMembers,
}: NotificationCategoryStats) => {
  if (deliveryMode === 'TOPIC') {
    return consentingMembers === null
      ? '수신 동의 집계 없음'
      : `수신 동의 ${formatCount(consentingMembers)}명`;
  }
  return statusCounts === null
    ? '발송 집계 없음'
    : `발송 ${formatCount(statusCounts.SENT)}`;
};

const getUnmeasuredText = ({ category }: NotificationCategoryStats) =>
  OPEN_NOT_RECORDED_CATEGORIES.includes(category)
    ? '열림 미수집 · 앱이 이동할 화면이 없어 기록되지 않아요'
    : '계산 불가 · 기간 내 발송이 없어요';

interface OpenRateChartProps {
  categories: NotificationCategoryStats[];
}

const OpenRateChart = ({ categories }: OpenRateChartProps) => {
  // 측정된 카테고리는 열림률 순으로, 측정할 수 없는 카테고리는 아래에 둔다.
  const measuredCategories = categories
    .filter(isRateMeasured)
    .sort((a, b) => (b.openRate ?? 0) - (a.openRate ?? 0));
  const unmeasuredCategories = categories.filter(
    (stats) => !isRateMeasured(stats),
  );

  return (
    <Container aria-labelledby="open-rate-heading">
      <HeadingWrapper>
        <SectionTitle id="open-rate-heading">카테고리별 열림률</SectionTitle>
        <ChartDescription>
          같은 알림을 여러 번 열어도 한 번으로 센 고유 열림 ÷ 발송. 옅은 막대는
          수신 동의 회원 수로 나눈 근사치예요.
        </ChartDescription>
      </HeadingWrapper>

      <RowList>
        {measuredCategories.map((stats) => {
          const isApproximate = stats.deliveryMode === 'TOPIC';
          const openRate = stats.openRate ?? 0;

          return (
            <Row key={stats.category}>
              <CategoryCell>
                <CategoryName>{CATEGORY_LABELS[stats.category]}</CategoryName>
                {isApproximate && <TopicTag>토픽 발송 · 근사</TopicTag>}
              </CategoryCell>
              <Track aria-hidden="true">
                <Bar
                  isApproximate={isApproximate}
                  style={{ width: `${Math.min(openRate, 1) * 100}%` }}
                />
              </Track>
              <RateValue>
                {isApproximate && '≈ '}
                {formatRate(openRate)}
              </RateValue>
              <DetailText>
                {formatCount(stats.opens.uniqueLinked)} /{' '}
                {getDenominatorText(stats)}
              </DetailText>
            </Row>
          );
        })}
        {unmeasuredCategories.map((stats) => (
          <Row key={stats.category}>
            <CategoryCell>
              <CategoryName>{CATEGORY_LABELS[stats.category]}</CategoryName>
            </CategoryCell>
            <UnmeasuredText>{getUnmeasuredText(stats)}</UnmeasuredText>
          </Row>
        ))}
      </RowList>

      <AxisRow aria-hidden="true">
        <AxisTrack>
          {AXIS_TICKS.map((tick) => (
            <AxisTick key={tick} style={{ left: `${tick}%` }}>
              {tick}%
            </AxisTick>
          ))}
        </AxisTrack>
      </AxisRow>
    </Container>
  );
};

export default OpenRateChart;

const ROW_COLUMNS =
  'minmax(120px, 200px) minmax(160px, 1fr) 72px minmax(120px, 180px)';

const Container = styled.section`
  padding: var(--seed-dimension-x6);
  border: 1px solid var(--seed-color-stroke-neutral-weak);
  border-radius: var(--seed-radius-r4);

  display: grid;
  gap: var(--seed-dimension-x4);

  background-color: var(--seed-color-bg-layer-default);
`;
const HeadingWrapper = styled.div`
  display: grid;
  gap: var(--seed-dimension-x1);
`;
const SectionTitle = styled.h2`
  font-weight: var(--seed-font-weight-bold);
  font-size: var(--seed-font-size-t7);
  line-height: var(--seed-line-height-t7);
`;
const ChartDescription = styled.p`
  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t3);
`;
const RowList = styled.ul`
  display: grid;
  gap: var(--seed-dimension-x1);

  list-style: none;
`;
const Row = styled.li`
  min-height: 48px;
  padding-block: var(--seed-dimension-x2);

  display: grid;
  gap: var(--seed-dimension-x4);
  align-items: center;

  grid-template-columns: ${ROW_COLUMNS};
`;
const CategoryCell = styled.div`
  min-width: 0;

  display: grid;
  gap: var(--seed-dimension-x1);
`;
const CategoryName = styled.span`
  font-weight: var(--seed-font-weight-bold);
`;
const TopicTag = styled.span`
  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t2);
`;
// 세로 격자선은 25% 간격의 1px 선, 왼쪽 기준선만 한 단계 진하게 둔다.
const Track = styled.div`
  height: 24px;
  border-right: 1px solid var(--seed-color-palette-gray-300);
  border-left: 1px solid var(--seed-color-palette-gray-600);

  display: flex;
  align-items: center;

  background-image: linear-gradient(
    to right,
    var(--seed-color-palette-gray-300) 1px,
    transparent 1px
  );
  background-size: 25% 100%;
`;
const Bar = styled.span<{ isApproximate: boolean }>`
  height: 16px;
  min-width: 2px;
  border-radius: 0 4px 4px 0;

  display: block;

  background-color: ${({ isApproximate }) =>
    isApproximate
      ? 'var(--seed-color-palette-carrot-400)'
      : 'var(--seed-color-palette-carrot-700)'};
`;
const RateValue = styled.span`
  font-weight: var(--seed-font-weight-bold);
  font-size: var(--seed-font-size-t5);
  text-align: right;

  font-variant-numeric: tabular-nums;
`;
const DetailText = styled.span`
  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t3);

  font-variant-numeric: tabular-nums;
`;
const UnmeasuredText = styled.span`
  color: var(--seed-color-fg-neutral-subtle);
  font-size: var(--seed-font-size-t3);

  grid-column: 2 / -1;
`;
const AxisRow = styled.div`
  display: grid;
  gap: var(--seed-dimension-x4);

  grid-template-columns: ${ROW_COLUMNS};
`;
const AxisTrack = styled.div`
  position: relative;
  height: 20px;

  grid-column: 2;
`;
const AxisTick = styled.span`
  position: absolute;
  top: 0;

  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t2);

  font-variant-numeric: tabular-nums;
  transform: translateX(-50%);
`;
