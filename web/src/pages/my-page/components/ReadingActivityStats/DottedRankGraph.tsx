import styled from '@emotion/styled';

interface RankPoint {
  label: string;
  rank: number;
}

interface Props {
  points: RankPoint[];
  currentRank: number;
  showYAxis?: boolean;
  showArea?: boolean;
  showBadge?: boolean;
  largeXAxisLabel?: boolean;
}

const CHART_WIDTH = 320;
const CHART_HEIGHT = 200;
const PADDING = {
  top: 56,
  right: 20,
  bottom: 34,
  left: 34,
} as const;
const MIN_RANK = 1;
const MAX_RANK = 30;
const Y_AXIS_LABELS = [1, 10, 20, 30] as const;

const DottedRankGraph = ({
  points,
  currentRank,
  showYAxis = true,
  showArea = false,
  showBadge = true,
  largeXAxisLabel = false,
}: Props) => {
  const rankPoints = points.map((point, index) =>
    index === points.length - 1 ? { ...point, rank: currentRank } : point,
  );
  const graphWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const graphHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const pointGap =
    rankPoints.length > 1 ? graphWidth / (rankPoints.length - 1) : 0;

  const getX = (index: number) => PADDING.left + pointGap * index;
  const getY = (rank: number) => {
    const clampedRank = Math.min(Math.max(rank, MIN_RANK), MAX_RANK);
    const rankRate = (clampedRank - MIN_RANK) / (MAX_RANK - MIN_RANK);

    return PADDING.top + graphHeight * rankRate;
  };
  const polylinePoints = rankPoints
    .map((point, index) => `${getX(index)},${getY(point.rank)}`)
    .join(' ');
  const areaPoints = `${PADDING.left},${PADDING.top + graphHeight} ${polylinePoints} ${PADDING.left + graphWidth},${PADDING.top + graphHeight}`;
  const lastPoint = rankPoints.at(-1);
  const lastPointX =
    rankPoints.length > 0 ? getX(rankPoints.length - 1) : PADDING.left;
  const lastPointY = lastPoint ? getY(lastPoint.rank) : PADDING.top;

  return (
    <Container aria-label={`현재 순위 ${currentRank}위 그래프`} role="img">
      <Chart viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
        {showArea && (
          <defs>
            <linearGradient
              id="rank-area-gradient"
              x1="0"
              y1={PADDING.top}
              x2="0"
              y2={PADDING.top + graphHeight}
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FE5E04" stopOpacity="0.18" />
              <stop offset="1" stopColor="#FE5E04" stopOpacity="0" />
            </linearGradient>
          </defs>
        )}
        {showYAxis && (
          <AxisLine
            x1={PADDING.left}
            y1={PADDING.top}
            x2={PADDING.left}
            y2={PADDING.top + graphHeight}
          />
        )}
        <AxisLine
          x1={PADDING.left}
          y1={PADDING.top + graphHeight}
          x2={PADDING.left + graphWidth}
          y2={PADDING.top + graphHeight}
        />
        {showYAxis &&
          Y_AXIS_LABELS.map((label) => (
            <AxisLabel
              key={label}
              x={PADDING.left - 14}
              y={getY(label)}
              dominantBaseline="middle"
              textAnchor="end"
            >
              {label}
            </AxisLabel>
          ))}
        {rankPoints.map((point, index) => (
          <XAxisLabel
            key={point.label}
            $large={largeXAxisLabel}
            x={getX(index)}
            y={PADDING.top + graphHeight + 22}
            textAnchor="middle"
          >
            {point.label}
          </XAxisLabel>
        ))}
        {showArea && <RankArea points={areaPoints} />}
        <RankLine points={polylinePoints} />
        {rankPoints.map((point, index) => (
          <RankDot
            key={`${point.label}-${point.rank}`}
            cx={getX(index)}
            cy={getY(point.rank)}
            r={4}
          />
        ))}
        {showBadge && lastPoint && (
          <RankBadge
            transform={`translate(${lastPointX - 22} ${lastPointY - 52})`}
          >
            <rect width="44" height="38" rx="8" />
            <path d="M17 38H27L22 46Z" />
            <text x="22" y="25" textAnchor="middle">
              {currentRank}위
            </text>
          </RankBadge>
        )}
      </Chart>
    </Container>
  );
};

export default DottedRankGraph;

const Container = styled.div`
  width: 100%;
`;

const Chart = styled.svg`
  width: 100%;
  height: auto;

  display: block;
`;

const AxisLine = styled.line`
  stroke: ${({ theme }) => theme.colors.stroke};
  stroke-dasharray: 3 4;
  stroke-width: 1;
`;

const AxisLabel = styled.text`
  font: ${({ theme }) => theme.fonts.t2Regular};
  fill: ${({ theme }) => theme.colors.textSecondary};
`;

const XAxisLabel = styled.text<{ $large: boolean }>`
  font: ${({ $large, theme }) =>
    $large ? theme.fonts.t5Bold : theme.fonts.t2Regular};
  fill: ${({ theme }) => theme.colors.textPrimary};
`;

const RankLine = styled.polyline`
  fill: none;
  stroke: ${({ theme }) => theme.colors.primaryBomBom};
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3;
`;

const RankArea = styled.polygon`
  fill: url('#rank-area-gradient');
`;

const RankDot = styled.circle`
  fill: ${({ theme }) => theme.colors.white};
  stroke: ${({ theme }) => theme.colors.primaryBomBom};
  stroke-width: 3;
`;

const RankBadge = styled.g`
  rect,
  path {
    fill: ${({ theme }) => theme.colors.primaryBomBom};
  }

  text {
    font: ${({ theme }) => theme.fonts.t5Bold};
    fill: ${({ theme }) => theme.colors.white};
  }
`;
