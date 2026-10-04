import styled from '@emotion/styled';
import { useState } from 'react';
import type { DashboardStatsResponse } from '@/apis/dashboard/dashboard.api';

interface SignupTrendProps {
  data: DashboardStatsResponse['dailyJoinedTrend'];
}

const SignupTrend = ({ data }: SignupTrendProps) => {
  const [days, setDays] = useState<7 | 30>(7);
  const validPoints = data?.filter(
    (point): point is { date: string; count: number } =>
      typeof point.date === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(point.date) &&
      Number.isFinite(Date.parse(point.date)) &&
      typeof point.count === 'number' &&
      Number.isSafeInteger(point.count) &&
      point.count >= 0,
  );
  const isComplete =
    data?.length === 30 &&
    validPoints?.length === 30 &&
    validPoints.every(
      (point, index) =>
        index === 0 ||
        Date.parse(point.date) - Date.parse(validPoints[index - 1].date) ===
          86_400_000,
    );
  const points = isComplete ? validPoints.slice(-days) : [];
  const total = points.reduce((sum, point) => sum + point.count, 0);
  const tickStep = Math.max(
    1,
    Math.ceil(Math.max(...points.map((point) => point.count), 0) / 4),
  );
  const axisMax = tickStep * 4;
  const coordinates = points.map((point, index) => ({
    ...point,
    x: 52 + (index / (points.length - 1)) * 704,
    y: 224 - (point.count / axisMax) * 184,
  }));

  return (
    <Container aria-labelledby="trend-heading">
      <HeadingWrapper>
        <h2 id="trend-heading">일별 가입 추이</h2>
        <PeriodWrapper role="group" aria-label="가입 추이 조회 기간">
          {([7, 30] as const).map((period) => (
            <PeriodButton
              key={period}
              type="button"
              aria-pressed={days === period}
              disabled={!isComplete}
              onClick={() => setDays(period)}
            >
              {period}일
            </PeriodButton>
          ))}
        </PeriodWrapper>
      </HeadingWrapper>
      {isComplete ? (
        <>
          <DescriptionBox>
            서울 날짜 기준 · 오늘 포함 · 테스트 계정 제외
          </DescriptionBox>
          <figure>
            <ChartBox
              viewBox="0 0 800 272"
              role="img"
              aria-label={`최근 ${days}일 일별 가입 추이`}
            >
              <title>{`최근 ${days}일 일별 가입 추이`}</title>
              <desc>{`${points[0].date}부터 ${points[points.length - 1].date}까지 ${total}명 가입. 날짜별 수치는 아래 표에서 확인할 수 있습니다.`}</desc>
              {[0, 1, 2, 3, 4].map((tick) => (
                <g key={tick}>
                  <line
                    x1="52"
                    x2="756"
                    y1={224 - tick * 46}
                    y2={224 - tick * 46}
                    stroke="var(--seed-color-stroke-neutral-weak)"
                  />
                  <text x="40" y={229 - tick * 46} textAnchor="end">
                    {(tick * tickStep).toLocaleString('ko-KR')}
                  </text>
                </g>
              ))}
              <polyline
                points={coordinates
                  .map((point) => `${point.x},${point.y}`)
                  .join(' ')}
                fill="none"
                stroke="var(--seed-color-stroke-brand-solid)"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              {coordinates.map((point, index) => (
                <g key={point.date}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="var(--seed-color-stroke-brand-solid)"
                  >
                    <title>{`${point.date} 가입 ${point.count}명`}</title>
                  </circle>
                  {(index === 0 ||
                    index === points.length - 1 ||
                    index % Math.ceil(days / 5) === 0) && (
                    <text x={point.x} y="252" textAnchor="middle">
                      {point.date.slice(5).replace('-', '/')}
                    </text>
                  )}
                </g>
              ))}
            </ChartBox>
            <CaptionBox>
              <strong>기간 가입 {total.toLocaleString('ko-KR')}명</strong>
              <span>
                하루 평균{' '}
                {(total / days).toLocaleString('ko-KR', {
                  maximumFractionDigits: 1,
                })}
                명
              </span>
            </CaptionBox>
          </figure>
          {total === 0 && (
            <DescriptionBox>선택한 기간에 가입한 회원이 없어요.</DescriptionBox>
          )}
          <DetailsBox>
            <summary>날짜별 수치 보기</summary>
            <table>
              <caption>최근 {days}일 가입 회원 수</caption>
              <thead>
                <tr>
                  <th scope="col">날짜</th>
                  <th scope="col">가입 회원</th>
                </tr>
              </thead>
              <tbody>
                {points.map((point) => (
                  <tr key={point.date}>
                    <th scope="row">{point.date}</th>
                    <td>{point.count.toLocaleString('ko-KR')}명</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DetailsBox>
        </>
      ) : (
        <MissingBox>
          <strong>일별 가입 데이터를 아직 받을 수 없어요.</strong>
          <p>
            서버 업데이트 상태를 확인한 뒤 새로고침해 주세요. 누락된 수치를
            0명으로 표시하지 않아요.
          </p>
        </MissingBox>
      )}
    </Container>
  );
};

export default SignupTrend;

const Container = styled.section`
  padding: var(--seed-dimension-x6);
  border: 1px solid var(--seed-color-stroke-neutral-weak);
  border-radius: var(--seed-radius-r4);

  background-color: var(--seed-color-bg-layer-default);
`;
const HeadingWrapper = styled.div`
  display: flex;
  gap: var(--seed-dimension-x3);
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  h2 {
    font-size: var(--seed-font-size-t7);
    line-height: var(--seed-line-height-t7);
  }
`;
const PeriodWrapper = styled.div`
  display: flex;
  gap: var(--seed-dimension-x1);
`;
const PeriodButton = styled.button`
  min-width: 56px;
  min-height: 44px;
  padding: var(--seed-dimension-x2) var(--seed-dimension-x3);
  border: 1px solid var(--seed-color-stroke-neutral-weak);
  border-radius: var(--seed-radius-r2);

  color: var(--seed-color-fg-neutral-muted);

  &[aria-pressed='true'] {
    background-color: var(--seed-color-bg-brand-weak);
    color: var(--seed-color-palette-carrot-800);
    font-weight: var(--seed-font-weight-bold);
  }
  &:disabled { opacity: 0.5; }
`;
const DescriptionBox = styled.p`
  margin-top: var(--seed-dimension-x3);

  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t3);
`;
const ChartBox = styled.svg`
  width: 100%;
  height: auto;
  margin-top: var(--seed-dimension-x4);

  display: block;

  text {
    font-size: var(--seed-font-size-t3);
    fill: var(--seed-color-fg-neutral-muted);
  }
`;
const CaptionBox = styled.figcaption`
  display: flex;
  gap: var(--seed-dimension-x4);
  flex-wrap: wrap;
  justify-content: space-between;

  font-variant-numeric: tabular-nums;
`;
const DetailsBox = styled.details`
  margin-top: var(--seed-dimension-x4);
  color: var(--seed-color-fg-neutral-muted);
  summary { cursor: pointer; }

  table {
    width: 100%;
    border-collapse: collapse;
  }
  caption { padding: var(--seed-dimension-x3); }

  th, td {
    padding: var(--seed-dimension-x2);
    border-bottom: 1px solid var(--seed-color-stroke-neutral-weak);

    text-align: left;
  }
`;
const MissingBox = styled.div`
  min-height: 160px;

  display: flex;
  gap: var(--seed-dimension-x2);
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: var(--seed-color-fg-neutral-muted);
  text-align: center;
`;
