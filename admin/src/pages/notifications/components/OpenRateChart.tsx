import styled from '@emotion/styled';
import {
  CATEGORY_LABELS,
  OPEN_NOT_RECORDED_CATEGORIES,
} from '../constants/notificationCategory';
import { formatCount, formatRate } from '../utils/formatStats';
import type { NotificationCategoryStats } from '@/apis/notificationStats/notificationStats.api';

// 카테고리 간 비교가 왜곡되지 않도록 최댓값이 아닌 0~100% 고정 축을 쓴다.
const AXIS_TICKS = [0, 25, 50, 75, 100];

// 막대 전체(100%)가 무엇인지: 회원별 발송은 발송 수, 토픽 발송은 수신 동의 회원 수
const getBaseCount = ({
  deliveryMode,
  statusCounts,
  consentingMembers,
}: NotificationCategoryStats) =>
  deliveryMode === 'TOPIC' ? consentingMembers : (statusCounts?.SENT ?? null);

const getBaseText = (stats: NotificationCategoryStats, baseCount: number) =>
  stats.deliveryMode === 'TOPIC'
    ? `수신 동의 ${formatCount(baseCount)}명 기준`
    : `발송 ${formatCount(baseCount)}건 기준`;

const isRateMeasured = (stats: NotificationCategoryStats) =>
  stats.openRate !== null &&
  getBaseCount(stats) !== null &&
  !OPEN_NOT_RECORDED_CATEGORIES.includes(stats.category);

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
          막대 전체가 보낸 알림이고, 그중 열린 만큼을 칠했어요. 같은 알림을 여러
          번 열어도 한 번으로 세요.
        </ChartDescription>
        <LegendList aria-label="범례">
          <LegendItem>
            <LegendSwatch swatchColor="var(--seed-color-palette-carrot-700)" />
            열림
          </LegendItem>
          <LegendItem>
            <LegendSwatch swatchColor="var(--seed-color-palette-carrot-400)" />
            열림(근사 · 수신 동의 회원 기준)
          </LegendItem>
          <LegendItem>
            <LegendSwatch swatchColor="var(--seed-color-palette-gray-400)" />안
            열림
          </LegendItem>
        </LegendList>
      </HeadingWrapper>

      <RowList aria-label="카테고리별 열림과 안 열림">
        {measuredCategories.map((stats) => {
          const isApproximate = stats.deliveryMode === 'TOPIC';
          const openRate = stats.openRate ?? 0;
          const baseCount = getBaseCount(stats) ?? 0;
          const opened = stats.opens.uniqueLinked;
          const unopened = Math.max(baseCount - opened, 0);

          return (
            <Row key={stats.category}>
              <CategoryCell>
                <CategoryName>{CATEGORY_LABELS[stats.category]}</CategoryName>
                {isApproximate && <TopicTag>토픽 발송 · 근사</TopicTag>}
              </CategoryCell>
              <StackedBar aria-hidden="true">
                {opened > 0 && (
                  <OpenedSegment
                    isApproximate={isApproximate}
                    style={{ flexGrow: opened }}
                  />
                )}
                {unopened > 0 && (
                  <UnopenedSegment style={{ flexGrow: unopened }} />
                )}
              </StackedBar>
              <RateValue>
                {isApproximate && '≈ '}
                {formatRate(openRate)}
              </RateValue>
              <DetailCell>
                <span>
                  열림 {formatCount(opened)} · 안 열림 {isApproximate && '≈ '}
                  {formatCount(unopened)}
                </span>
                <BaseText>{getBaseText(stats, baseCount)}</BaseText>
              </DetailCell>
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
  'minmax(120px, 200px) minmax(160px, 1fr) 72px minmax(160px, 220px)';

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
// 막대 전체가 100%다. 끝만 4px로 둥글리고 열림·안 열림 사이는 2px 표면색 간격으로 나눈다.
const StackedBar = styled.div`
  overflow: hidden;
  height: 16px;
  border-radius: 4px;

  display: flex;
  gap: 2px;
`;
const OpenedSegment = styled.span<{ isApproximate: boolean }>`
  min-width: 2px;

  flex-basis: 0;

  background-color: ${({ isApproximate }) =>
    isApproximate
      ? 'var(--seed-color-palette-carrot-400)'
      : 'var(--seed-color-palette-carrot-700)'};
`;
const UnopenedSegment = styled.span`
  min-width: 2px;

  flex-basis: 0;

  background-color: var(--seed-color-palette-gray-400);
`;
const LegendList = styled.ul`
  margin-top: var(--seed-dimension-x2);

  display: flex;
  gap: var(--seed-dimension-x4);
  flex-wrap: wrap;

  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t3);

  list-style: none;
`;
const LegendItem = styled.li`
  display: flex;
  gap: var(--seed-dimension-x2);
  align-items: center;
`;
const LegendSwatch = styled.span<{ swatchColor: string }>`
  width: 12px;
  height: 12px;
  border-radius: var(--seed-radius-r1);

  background-color: ${({ swatchColor }) => swatchColor};
`;
const RateValue = styled.span`
  font-weight: var(--seed-font-weight-bold);
  font-size: var(--seed-font-size-t5);
  text-align: right;

  font-variant-numeric: tabular-nums;
`;
const DetailCell = styled.div`
  display: grid;

  font-size: var(--seed-font-size-t3);

  font-variant-numeric: tabular-nums;
`;
const BaseText = styled.span`
  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t2);
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
