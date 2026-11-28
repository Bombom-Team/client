import styled from '@emotion/styled';
import { CATEGORY_LABELS } from '../constants/notificationCategory';
import { formatCount, formatRate } from '../utils/formatStats';
import type { NotificationCategoryStats } from '@/apis/notificationStats/notificationStats.api';

const AXIS_TICKS = [0, 25, 50, 75, 100];

interface OpenRateChartProps {
  categories: NotificationCategoryStats[];
}

const OpenRateChart = ({ categories }: OpenRateChartProps) => {
  const memberCategories = categories.filter(
    ({ deliveryMode }) => deliveryMode === 'MEMBER',
  );
  const measuredCategories = memberCategories
    .filter(
      ({ openRate, statusCounts }) =>
        openRate !== null && statusCounts !== null,
    )
    .sort((a, b) => (b.openRate ?? 0) - (a.openRate ?? 0));
  const unmeasuredCategories = memberCategories.filter(
    (stats) => !measuredCategories.includes(stats),
  );
  const topicCategories = categories.filter(
    ({ deliveryMode }) => deliveryMode === 'TOPIC',
  );

  return (
    <Container aria-labelledby="open-rate-heading">
      <HeadingWrapper>
        <SectionTitle id="open-rate-heading">카테고리별 열림률</SectionTitle>
        <Caption>고유 열림 / 발송</Caption>
      </HeadingWrapper>
      {measuredCategories.length > 0 && (
        <>
          <RowList aria-label="회원별 알림 열림률">
            {measuredCategories.map((stats) => (
              <Row key={stats.category}>
                <CategoryName>{CATEGORY_LABELS[stats.category]}</CategoryName>
                <BarTrack aria-hidden="true">
                  <BarFill
                    style={{
                      width: `${Math.min(100, Math.max(0, (stats.openRate ?? 0) * 100))}%`,
                    }}
                  />
                </BarTrack>
                <RateValue>{formatRate(stats.openRate ?? 0)}</RateValue>
                <CountValue>
                  {formatCount(stats.opens.uniqueLinked)} /{' '}
                  {formatCount(stats.statusCounts?.SENT ?? 0)}건
                </CountValue>
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
        </>
      )}
      {unmeasuredCategories.length > 0 && (
        <UnmeasuredList aria-label="열림률 집계 제외">
          {unmeasuredCategories.map(({ category }) => (
            <li key={category}>{CATEGORY_LABELS[category]} · 계산 불가</li>
          ))}
        </UnmeasuredList>
      )}
      {topicCategories.map((stats) => (
        <TopicRow key={stats.category}>
          <TopicHeading>
            <CategoryName>{CATEGORY_LABELS[stats.category]}</CategoryName>
            <Tag>근사치</Tag>
          </TopicHeading>
          <TopicValue>
            {stats.openRate === null
              ? '계산 불가'
              : `≈ ${formatRate(stats.openRate)}`}
          </TopicValue>
          <Caption>
            고유 열림 {formatCount(stats.opens.uniqueLinked)}건 / 수신 동의{' '}
            {stats.consentingMembers === null
              ? '미집계'
              : `${formatCount(stats.consentingMembers)}명`}
          </Caption>
        </TopicRow>
      ))}
    </Container>
  );
};

export default OpenRateChart;

const ROW_COLUMNS = 'minmax(144px, 200px) minmax(80px, 1fr) 80px 160px';

const Container = styled.section`
  padding: var(--seed-dimension-x6);
  border: 1px solid var(--seed-color-stroke-neutral-weak);
  border-radius: var(--seed-radius-r4);

  display: grid;
  gap: var(--seed-dimension-x4);

  background-color: var(--seed-color-bg-layer-default);
`;
const HeadingWrapper = styled.div`
  display: flex;
  gap: var(--seed-dimension-x2);
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
`;
const SectionTitle = styled.h2`
  font-weight: var(--seed-font-weight-bold);
  font-size: var(--seed-font-size-t7);
  line-height: var(--seed-line-height-t7);
`;
const Caption = styled.span`
  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t4);
`;
const RowList = styled.ul`
  display: grid;
  gap: var(--seed-dimension-x2);

  list-style: none;
`;
const Row = styled.li`
  min-height: 56px;

  display: grid;
  gap: var(--seed-dimension-x4);
  align-items: center;

  grid-template-columns: ${ROW_COLUMNS};
`;
const CategoryName = styled.span`
  font-weight: var(--seed-font-weight-bold);
`;
const BarTrack = styled.div`
  overflow: hidden;
  height: 12px;
  border-radius: var(--seed-radius-r1);

  background-color: var(--seed-color-bg-layer-fill);
`;
const BarFill = styled.div`
  height: 100%;
  border-radius: var(--seed-radius-r1);

  background-color: var(--seed-color-palette-carrot-700);
`;
const RateValue = styled.strong`
  font-size: var(--seed-font-size-t6);
  text-align: right;

  font-variant-numeric: tabular-nums;
`;
const CountValue = styled.span`
  color: var(--seed-color-fg-neutral-muted);
  text-align: right;

  font-variant-numeric: tabular-nums;
`;
const AxisRow = styled.div`
  display: grid;
  gap: var(--seed-dimension-x4);

  grid-template-columns: ${ROW_COLUMNS};
`;
const AxisTrack = styled.div`
  position: relative;
  height: 24px;

  grid-column: 2;
`;
const AxisTick = styled.span`
  position: absolute;
  top: 0;

  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t4);

  font-variant-numeric: tabular-nums;
  transform: translateX(-50%);
`;
const UnmeasuredList = styled.ul`
  display: flex;
  gap: var(--seed-dimension-x2) var(--seed-dimension-x5);
  flex-wrap: wrap;

  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t4);

  list-style: none;
`;
const TopicRow = styled.div`
  padding-top: var(--seed-dimension-x4);
  border-top: 1px solid var(--seed-color-stroke-neutral-weak);

  display: flex;
  gap: var(--seed-dimension-x3) var(--seed-dimension-x5);
  flex-wrap: wrap;
  align-items: baseline;
`;
const TopicHeading = styled.div`
  display: flex;
  gap: var(--seed-dimension-x2);
  align-items: center;
`;
const Tag = styled.span`
  padding: var(--seed-dimension-x1) var(--seed-dimension-x2);
  border-radius: var(--seed-radius-r1);

  background-color: var(--seed-color-bg-layer-fill);
  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t4);
`;
const TopicValue = styled.strong`
  font-size: var(--seed-font-size-t6);
  font-variant-numeric: tabular-nums;
`;
