import styled from '@emotion/styled';
import { useState } from 'react';
import DailyTrendPlot from './DailyTrendPlot';
import { CATEGORY_LABELS } from '../constants/notificationCategory';
import { buildDailyPoints } from '../utils/dailyTrend';
import { getSeoulDateRange } from '../utils/dateRange';
import { formatCount, formatRate } from '../utils/formatStats';
import type {
  NotificationCategory,
  NotificationCategoryStats,
  NotificationDailyStats,
} from '@/apis/notificationStats/notificationStats.api';
import type { ChangeEvent } from 'react';

const TOTAL_SELECTION = 'TOTAL';
// 발송일 코호트라 최근 이틀(어제·오늘) 보낸 알림은 열림이 아직 쌓이는 중이다.
const COLLECTING_DAYS = 2;

type TrendSelection = typeof TOTAL_SELECTION | NotificationCategory;

interface DailyTrendChartProps {
  categories: NotificationCategoryStats[];
  daily: NotificationDailyStats[] | undefined;
}

const DailyTrendChart = ({ categories, daily }: DailyTrendChartProps) => {
  const [selection, setSelection] = useState<TrendSelection>(TOTAL_SELECTION);
  const isTotal = selection === TOTAL_SELECTION;
  const isTopic =
    !isTotal &&
    categories.find(({ category }) => category === selection)?.deliveryMode ===
      'TOPIC';
  // 전체는 회원별 알림만 합친다. 이벤트의 발송 시점 수신 동의 수는 근사치라 섞으면 열림률이 틀어진다.
  const totalCategories = categories
    .filter(({ deliveryMode }) => deliveryMode === 'MEMBER')
    .map(({ category }) => category);
  const points = buildDailyPoints({
    daily: daily ?? [],
    categories: isTotal ? totalCategories : [selection],
  });

  const handleSelectionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelection(event.target.value as TrendSelection);
  };

  return (
    <Container aria-labelledby="daily-trend-heading">
      <HeadingWrapper>
        <div>
          <SectionTitle id="daily-trend-heading">일별 추이</SectionTitle>
          <ChartDescription>
            발송일 기준{isTotal && ' · 이벤트 제외'}
          </ChartDescription>
        </div>
        <SelectLabel>
          카테고리
          <CategorySelect value={selection} onChange={handleSelectionChange}>
            <option value={TOTAL_SELECTION}>전체</option>
            {categories.map(({ category }) => (
              <option key={category} value={category}>
                {CATEGORY_LABELS[category]}
              </option>
            ))}
          </CategorySelect>
        </SelectLabel>
      </HeadingWrapper>

      {daily === undefined && (
        <NoticeText>
          일별 데이터를 아직 받지 못했어요. 알림 서버를 배포하면 표시돼요.
        </NoticeText>
      )}
      {daily !== undefined && points.length === 0 && (
        <NoticeText>선택한 기간에 일별 데이터가 없어요.</NoticeText>
      )}
      {points.length > 0 && (
        <>
          <LegendList aria-label="범례">
            <LegendItem>
              <LegendSwatch swatchColor="var(--seed-color-palette-gray-400)" />
              {isTopic ? '수신 동의(발송 시점)' : '발송'}
            </LegendItem>
            <LegendItem>
              <LegendSwatch swatchColor="var(--seed-color-palette-carrot-700)" />
              열림
            </LegendItem>
            <LegendItem>
              <LineKey />
              {isTopic ? '열림률(≈)' : '열림률'}
            </LegendItem>
          </LegendList>
          <DailyTrendPlot
            points={points}
            isApproximate={isTopic}
            collectingFrom={getSeoulDateRange(COLLECTING_DAYS).from}
          />
          <TableDetails>
            <summary>날짜별 수치 보기</summary>
            <TableWrapper>
              <DailyTable>
                <caption>
                  {isTotal ? '전체(이벤트 제외)' : CATEGORY_LABELS[selection]}{' '}
                  일별 발송과 열림
                </caption>
                <thead>
                  <tr>
                    <th scope="col">날짜</th>
                    <th scope="col">{isTopic ? '수신 동의' : '발송'}</th>
                    <th scope="col">열림</th>
                    <th scope="col">열림률</th>
                  </tr>
                </thead>
                <tbody>
                  {points.map(({ date, sent, opened, openRate }) => (
                    <tr key={date}>
                      <th scope="row">{date}</th>
                      <td>{sent === null ? '해당 없음' : formatCount(sent)}</td>
                      <td>{formatCount(opened)}</td>
                      <td>
                        {openRate === null
                          ? '—'
                          : `${isTopic ? '≈ ' : ''}${formatRate(openRate)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DailyTable>
            </TableWrapper>
          </TableDetails>
        </>
      )}
    </Container>
  );
};

export default DailyTrendChart;

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
  gap: var(--seed-dimension-x4);
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
`;
const SectionTitle = styled.h2`
  margin-bottom: var(--seed-dimension-x1);

  font-weight: var(--seed-font-weight-bold);
  font-size: var(--seed-font-size-t7);
  line-height: var(--seed-line-height-t7);
`;
const ChartDescription = styled.p`
  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t4);
`;
const SelectLabel = styled.label`
  display: flex;
  gap: var(--seed-dimension-x2);
  align-items: center;

  color: var(--seed-color-fg-neutral-muted);
  font-weight: var(--seed-font-weight-medium);
`;
const CategorySelect = styled.select`
  min-height: 44px;
  padding: var(--seed-dimension-x2) var(--seed-dimension-x3);
  border: 1px solid var(--seed-color-stroke-neutral-weak);
  border-radius: var(--seed-radius-r2);

  background-color: var(--seed-color-bg-layer-default);
  color: var(--seed-color-fg-neutral);
  font: inherit;
`;
const NoticeText = styled.p`
  padding: var(--seed-dimension-x6);
  border-radius: var(--seed-radius-r3);

  background-color: var(--seed-color-bg-layer-fill);
  color: var(--seed-color-fg-neutral-muted);
  text-align: center;
`;
const LegendList = styled.ul`
  display: flex;
  gap: var(--seed-dimension-x4);
  flex-wrap: wrap;

  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t4);

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
const LineKey = styled.span`
  width: 16px;
  height: 2px;
  border-radius: var(--seed-radius-full);

  background-color: var(--seed-color-palette-carrot-700);
`;
const TableDetails = styled.details`
  color: var(--seed-color-fg-neutral-muted);

  summary {
    font-weight: var(--seed-font-weight-medium);
    cursor: pointer;
  }
`;
const TableWrapper = styled.div`
  max-height: 320px;
  margin-top: var(--seed-dimension-x3);

  overflow-y: auto;
`;
const DailyTable = styled.table`
  width: 100%;

  color: var(--seed-color-fg-neutral);
  font-size: var(--seed-font-size-t4);

  border-collapse: collapse;

  font-variant-numeric: tabular-nums;

  caption {
    padding-bottom: var(--seed-dimension-x2);

    color: var(--seed-color-fg-neutral-muted);
    text-align: left;
  }

  th,
  td {
    padding: var(--seed-dimension-x2) var(--seed-dimension-x3);
    border-bottom: 1px solid var(--seed-color-stroke-neutral-weak);

    text-align: right;
  }

  thead th {
    color: var(--seed-color-fg-neutral-muted);
    font-weight: var(--seed-font-weight-medium);
  }

  th:first-of-type {
    text-align: left;
  }
`;
