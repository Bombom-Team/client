import { MEDAL_COLORS } from '../../constants/challenge';

interface MedalRatio {
  gold: number;
  silver: number;
  bronze: number;
}

type SegmentData = {
  key: keyof typeof MEDAL_COLORS;
  dashArray: string;
  rotation: number;
};

interface MedalDonutChartProps {
  ratio: MedalRatio;
}

const MedalDonutChart = ({ ratio }: MedalDonutChartProps) => {
  const total = ratio.gold + ratio.silver + ratio.bronze || 1;
  const radius = 28;
  const strokeWidth = 10;
  const cx = 36;
  const cy = 36;
  const circumference = 2 * Math.PI * radius;

  const { segments } = (
    Object.keys(MEDAL_COLORS) as (keyof typeof MEDAL_COLORS)[]
  ).reduce<{ segments: SegmentData[]; cumulative: number }>(
    ({ segments, cumulative }, key) => {
      const value = ratio[key];
      if (value === 0) return { segments, cumulative };
      return {
        segments: [
          ...segments,
          {
            key,
            dashArray: `${(value / total) * circumference} ${circumference}`,
            rotation: (cumulative / total) * 360 - 90,
          },
        ],
        cumulative: cumulative + value,
      };
    },
    { segments: [], cumulative: 0 },
  );

  return (
    <svg width="100%" height="100%" viewBox="0 0 72 72">
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#EDEDED"
        strokeWidth={strokeWidth}
      />
      {segments.map(({ key, dashArray, rotation }) => (
        <circle
          key={key}
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={MEDAL_COLORS[key]}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          transform={`rotate(${rotation} ${cx} ${cy})`}
        />
      ))}
    </svg>
  );
};

export default MedalDonutChart;
