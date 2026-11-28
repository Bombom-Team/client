import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { getNiceCeil, getRateCeil } from '../utils/dailyTrend';
import { formatCount, formatRate } from '../utils/formatStats';
import type { DailyPoint } from '../utils/dailyTrend';
import type { KeyboardEvent, PointerEvent } from 'react';

const WIDTH = 960;
const PLOT_LEFT = 56;
const PLOT_RIGHT = WIDTH - 12;
const PLOT_WIDTH = PLOT_RIGHT - PLOT_LEFT;
const COUNT_TOP = 28;
const COUNT_HEIGHT = 144;
const RATE_TOP = COUNT_TOP + COUNT_HEIGHT + 44;
const RATE_HEIGHT = 96;
const AXIS_LABEL_Y = RATE_TOP + RATE_HEIGHT + 20;
const HEIGHT = AXIS_LABEL_Y + 8;
const MAX_BAR_WIDTH = 24;
const MAX_X_LABELS = 8;

const WEEKDAY_FORMAT = new Intl.DateTimeFormat('ko-KR', {
  weekday: 'short',
  timeZone: 'Asia/Seoul',
});

const formatShortDate = (date: string) => date.slice(5).replace('-', '.');

const formatLongDate = (date: string) =>
  `${Number(date.slice(5, 7))}월 ${Number(date.slice(8, 10))}일 (${WEEKDAY_FORMAT.format(
    new Date(`${date}T00:00:00+09:00`),
  )})`;

// 위쪽 끝만 둥근 세로 막대. 기준선 쪽은 각지게 둔다.
const getBarPath = (x: number, y: number, width: number, height: number) => {
  const radius = Math.min(4, width / 2, height);
  const bottom = y + height;
  return `M${x},${bottom} V${y + radius} Q${x},${y} ${x + radius},${y} H${x + width - radius} Q${x + width},${y} ${x + width},${y + radius} V${bottom} Z`;
};

// 열림률이 없는 날은 선을 끊는다.
const getRateLinePath = (coordinates: ({ x: number; y: number } | null)[]) =>
  coordinates
    .map((point, index) => {
      if (point === null) return '';
      const isRunStart = index === 0 || coordinates[index - 1] === null;
      return `${isRunStart ? 'M' : 'L'}${point.x},${point.y}`;
    })
    .join(' ');

interface DailyTrendPlotProps {
  points: DailyPoint[];
  showSent: boolean;
  showOpened: boolean;
  rateNotice: string | null;
  collectingFrom: string;
}

const DailyTrendPlot = ({
  points,
  showSent,
  showOpened,
  rateNotice,
  collectingFrom,
}: DailyTrendPlotProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  const bandWidth = PLOT_WIDTH / points.length;
  const hasBothBars = showSent && showOpened;
  const barGap = Math.min(4, bandWidth * 0.1);
  const barWidth = Math.min(
    MAX_BAR_WIDTH,
    bandWidth * (hasBothBars ? 0.35 : 0.6),
  );
  const getCenterX = (index: number) => PLOT_LEFT + bandWidth * (index + 0.5);

  const countMax = getNiceCeil(
    Math.max(
      ...points.map(({ sent, opened }) =>
        Math.max(showSent ? (sent ?? 0) : 0, showOpened ? (opened ?? 0) : 0),
      ),
      0,
    ),
  );
  const countTicks = [0, countMax / 2, countMax].filter(Number.isInteger);
  const getCountY = (value: number) =>
    COUNT_TOP + COUNT_HEIGHT - (value / countMax) * COUNT_HEIGHT;

  const rateMax = getRateCeil(
    Math.max(...points.map(({ openRate }) => openRate ?? 0), 0),
  );
  const getRateY = (rate: number) =>
    RATE_TOP + RATE_HEIGHT - (rate / rateMax) * RATE_HEIGHT;
  const rateCoordinates = points.map(({ openRate }, index) =>
    openRate === null ? null : { x: getCenterX(index), y: getRateY(openRate) },
  );

  const labelStep = Math.ceil(points.length / MAX_X_LABELS);
  const collectingIndex = points.findIndex(
    ({ date }) => date >= collectingFrom,
  );
  const activePoint = activeIndex === null ? null : points[activeIndex];
  const activeRatio =
    activeIndex === null ? 0 : getCenterX(activeIndex) / WIDTH;
  // 가장자리 날짜에서는 툴팁이 차트 밖으로 넘치지 않게 기준점을 옮긴다.
  const getTooltipShift = () => {
    if (activeRatio < 0.2) return 0;
    if (activeRatio > 0.8) return -100;
    return -50;
  };

  // 연속 이벤트라 프레임당 한 번만 활성 날짜를 갱신한다.
  const handlePointerMove = (event: PointerEvent<SVGRectElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const { left, width } = svg.getBoundingClientRect();
    const viewX = ((event.clientX - left) / width) * WIDTH;
    const index = Math.min(
      points.length - 1,
      Math.max(0, Math.floor((viewX - PLOT_LEFT) / bandWidth)),
    );
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      setActiveIndex(index);
    });
  };

  const handlePointerLeave = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    setActiveIndex(null);
  };

  const handleKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    const lastIndex = points.length - 1;
    const current = activeIndex ?? lastIndex;
    const nextIndexByKey: Record<string, number> = {
      ArrowLeft: Math.max(0, current - 1),
      ArrowRight: Math.min(lastIndex, current + 1),
      Home: 0,
      End: lastIndex,
    };
    if (event.key === 'Escape') {
      setActiveIndex(null);
      return;
    }
    if (!(event.key in nextIndexByKey)) return;
    event.preventDefault();
    setActiveIndex(nextIndexByKey[event.key]);
  };

  return (
    <Container>
      <PlotSvg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="일별 발송과 열림 추이. 방향키로 날짜를 옮기며 수치를 확인할 수 있어요."
        tabIndex={0}
        onFocus={() => setActiveIndex((index) => index ?? points.length - 1)}
        onBlur={() => setActiveIndex(null)}
        onKeyDown={handleKeyDown}
      >
        {collectingIndex >= 0 && (
          <g aria-hidden="true">
            <rect
              x={PLOT_LEFT + bandWidth * collectingIndex}
              y={COUNT_TOP}
              width={bandWidth * (points.length - collectingIndex)}
              height={RATE_TOP + RATE_HEIGHT - COUNT_TOP}
              fill="var(--seed-color-bg-layer-fill)"
            />
            <PlotText x={PLOT_RIGHT} y={COUNT_TOP - 10} textAnchor="end">
              {rateNotice === null
                ? '음영·점선: 열림 집계 중'
                : '음영: 열림 집계 중'}
            </PlotText>
          </g>
        )}

        <PlotText x={PLOT_LEFT} y={COUNT_TOP - 10} isStrong>
          {hasBothBars
            ? '발송 · 열림 (건)'
            : showSent
              ? '발송 (건)'
              : '열림 (건)'}
        </PlotText>
        {countTicks.map((tick) => (
          <g key={tick} aria-hidden="true">
            <line
              x1={PLOT_LEFT}
              x2={PLOT_RIGHT}
              y1={getCountY(tick)}
              y2={getCountY(tick)}
              stroke="var(--seed-color-palette-gray-300)"
            />
            <PlotText
              x={PLOT_LEFT - 8}
              y={getCountY(tick) + 4}
              textAnchor="end"
            >
              {formatCount(tick)}
            </PlotText>
          </g>
        ))}
        {points.map(({ date, sent, opened }, index) => {
          const centerX = getCenterX(index);
          const sentX = hasBothBars
            ? centerX - barGap / 2 - barWidth
            : centerX - barWidth / 2;
          const openedX = hasBothBars
            ? centerX + barGap / 2
            : centerX - barWidth / 2;
          return (
            <g key={date} aria-hidden="true">
              {showSent && sent !== null && sent > 0 && (
                <path
                  d={getBarPath(
                    sentX,
                    getCountY(sent),
                    barWidth,
                    COUNT_TOP + COUNT_HEIGHT - getCountY(sent),
                  )}
                  fill="var(--seed-color-palette-gray-400)"
                />
              )}
              {showOpened && opened !== null && opened > 0 && (
                <path
                  d={getBarPath(
                    openedX,
                    getCountY(opened),
                    barWidth,
                    COUNT_TOP + COUNT_HEIGHT - getCountY(opened),
                  )}
                  fill="var(--seed-color-palette-carrot-700)"
                />
              )}
            </g>
          );
        })}

        <PlotText x={PLOT_LEFT} y={RATE_TOP - 12} isStrong>
          열림률
        </PlotText>
        {rateNotice === null ? (
          <g aria-hidden="true">
            {[0, rateMax / 2, rateMax].map((tick) => (
              <g key={tick}>
                <line
                  x1={PLOT_LEFT}
                  x2={PLOT_RIGHT}
                  y1={getRateY(tick)}
                  y2={getRateY(tick)}
                  stroke="var(--seed-color-palette-gray-300)"
                />
                <PlotText
                  x={PLOT_LEFT - 8}
                  y={getRateY(tick) + 4}
                  textAnchor="end"
                >
                  {formatRate(tick)}
                </PlotText>
              </g>
            ))}
            <path
              d={getRateLinePath(
                rateCoordinates.map((point, index) =>
                  collectingIndex >= 0 && index >= collectingIndex
                    ? null
                    : point,
                ),
              )}
              fill="none"
              stroke="var(--seed-color-palette-carrot-700)"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {collectingIndex >= 0 && (
              <path
                d={getRateLinePath(
                  rateCoordinates.map((point, index) =>
                    index >= collectingIndex - 1 ? point : null,
                  ),
                )}
                fill="none"
                stroke="var(--seed-color-palette-carrot-700)"
                strokeWidth={2}
                strokeDasharray="6 4"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            )}
            {rateCoordinates.map(
              (point, index) =>
                point !== null &&
                !rateCoordinates[index - 1] &&
                !rateCoordinates[index + 1] && (
                  <circle
                    key={points[index].date}
                    cx={point.x}
                    cy={point.y}
                    r={3}
                    fill="var(--seed-color-palette-carrot-700)"
                  />
                ),
            )}
          </g>
        ) : (
          <PlotText
            x={PLOT_LEFT + PLOT_WIDTH / 2}
            y={RATE_TOP + RATE_HEIGHT / 2}
            textAnchor="middle"
          >
            {rateNotice}
          </PlotText>
        )}

        {points.map(
          ({ date }, index) =>
            (points.length - 1 - index) % labelStep === 0 && (
              <PlotText
                key={date}
                x={getCenterX(index)}
                y={AXIS_LABEL_Y}
                textAnchor={
                  index === points.length - 1
                    ? 'end'
                    : index === 0
                      ? 'start'
                      : 'middle'
                }
                aria-hidden="true"
              >
                {formatShortDate(date)}
              </PlotText>
            ),
        )}

        {activeIndex !== null && activePoint && (
          <g aria-hidden="true">
            <line
              x1={getCenterX(activeIndex)}
              x2={getCenterX(activeIndex)}
              y1={COUNT_TOP}
              y2={RATE_TOP + RATE_HEIGHT}
              stroke="var(--seed-color-palette-gray-600)"
            />
            {rateNotice === null && activePoint.openRate !== null && (
              <circle
                cx={getCenterX(activeIndex)}
                cy={getRateY(activePoint.openRate)}
                r={5}
                fill="var(--seed-color-palette-carrot-700)"
                stroke="var(--seed-color-bg-layer-default)"
                strokeWidth={2}
              />
            )}
          </g>
        )}

        <rect
          x={PLOT_LEFT}
          y={COUNT_TOP}
          width={PLOT_WIDTH}
          height={RATE_TOP + RATE_HEIGHT - COUNT_TOP}
          fill="transparent"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        />
      </PlotSvg>

      <Tooltip
        role="status"
        aria-live="polite"
        isVisible={activePoint !== null}
        style={{
          left: `${activeRatio * 100}%`,
          transform: `translateX(${getTooltipShift()}%)`,
        }}
      >
        {activePoint && (
          <>
            <strong>{formatLongDate(activePoint.date)}</strong>
            {showSent && (
              <TooltipRow>
                <span>발송</span>
                <span>
                  {activePoint.sent === null
                    ? '집계 없음'
                    : `${formatCount(activePoint.sent)}건`}
                </span>
              </TooltipRow>
            )}
            {showOpened && (
              <TooltipRow>
                <span>열림</span>
                <span>{formatCount(activePoint.opened ?? 0)}건</span>
              </TooltipRow>
            )}
            {rateNotice === null && (
              <TooltipRow>
                <span>열림률</span>
                <span>
                  {activePoint.openRate === null
                    ? '발송 없음'
                    : formatRate(activePoint.openRate)}
                </span>
              </TooltipRow>
            )}
            {activePoint.date >= collectingFrom && (
              <TooltipNote>열림이 아직 쌓이는 중이에요</TooltipNote>
            )}
          </>
        )}
      </Tooltip>
    </Container>
  );
};

export default DailyTrendPlot;

const Container = styled.div`
  position: relative;
`;
const PlotSvg = styled.svg`
  width: 100%;
  height: auto;
  border-radius: var(--seed-radius-r2);

  display: block;

  &:focus-visible {
    outline: 3px solid var(--seed-color-palette-carrot-700);
    outline-offset: 4px;
  }
`;
const PlotText = styled.text<{ isStrong?: boolean }>`
  font-weight: ${({ isStrong }) =>
    isStrong
      ? 'var(--seed-font-weight-bold)'
      : 'var(--seed-font-weight-regular)'};
  font-size: var(--seed-font-size-t4);

  fill: ${({ isStrong }) =>
    isStrong
      ? 'var(--seed-color-fg-neutral)'
      : 'var(--seed-color-fg-neutral-muted)'};

  font-variant-numeric: tabular-nums;
`;
const Tooltip = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 0;
  min-width: 160px;
  padding: var(--seed-dimension-x3);
  border: 1px solid var(--seed-color-stroke-neutral-weak);
  border-radius: var(--seed-radius-r2);
  box-shadow: 0 4px 12px rgb(0 0 0 / 12%);

  display: ${({ isVisible }) => (isVisible ? 'grid' : 'none')};
  gap: var(--seed-dimension-x1);

  background-color: var(--seed-color-bg-layer-default);
  font-size: var(--seed-font-size-t4);

  pointer-events: none;
`;
const TooltipRow = styled.div`
  display: flex;
  gap: var(--seed-dimension-x4);
  justify-content: space-between;

  font-variant-numeric: tabular-nums;

  span:first-of-type {
    color: var(--seed-color-fg-neutral-muted);
  }
`;
const TooltipNote = styled.span`
  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t4);
  white-space: nowrap;
`;
