import styled from '@emotion/styled';

interface ShareBarSegment {
  label: string;
  count: number;
  color: string;
}

interface ShareBarProps {
  title: string;
  unit: string;
  segments: ShareBarSegment[];
}

// 전체를 구성하는 몇 개의 묶음을 한 줄 막대와 범례로 보여준다.
const ShareBar = ({ title, unit, segments }: ShareBarProps) => {
  const total = segments.reduce((sum, segment) => sum + segment.count, 0);
  const formatShare = (count: number) =>
    `${Math.round((count / total) * 100).toLocaleString('ko-KR')}%`;

  return (
    <Container>
      <TitleWrapper>
        <Title>{title}</Title>
        <TotalText>
          합계 {total.toLocaleString('ko-KR')}
          {unit}
        </TotalText>
      </TitleWrapper>
      {total > 0 ? (
        <BarTrack
          role="img"
          aria-label={`${title}: ${segments
            .map(({ label, count }) => `${label} ${formatShare(count)}`)
            .join(', ')}`}
        >
          {/* 0건 항목은 최소 너비 때문에 색이 보이지 않도록 막대에서 빼고 범례에만 남긴다. */}
          {segments
            .filter(({ count }) => count > 0)
            .map(({ label, count, color }) => (
              <BarSegment
                key={label}
                style={{ flexGrow: count, backgroundColor: color }}
              />
            ))}
        </BarTrack>
      ) : (
        <EmptyText>아직 집계된 수치가 없어요.</EmptyText>
      )}
      <LegendList>
        {segments.map(({ label, count, color }) => (
          <LegendItem key={label}>
            <LegendSwatch style={{ backgroundColor: color }} />
            <span>{label}</span>
            <LegendValue>
              {count.toLocaleString('ko-KR')}
              {unit}
              {total > 0 && ` · ${formatShare(count)}`}
            </LegendValue>
          </LegendItem>
        ))}
      </LegendList>
    </Container>
  );
};

export default ShareBar;

const Container = styled.div`
  min-width: 0;
  padding: var(--seed-dimension-x6);
  border-radius: var(--seed-radius-r4);

  display: grid;
  gap: var(--seed-dimension-x3);

  background-color: var(--seed-color-bg-layer-default);
`;
const TitleWrapper = styled.div`
  display: flex;
  gap: var(--seed-dimension-x2);
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
`;
const Title = styled.h3`
  font-weight: var(--seed-font-weight-bold);
  font-size: var(--seed-font-size-t5);
  line-height: var(--seed-line-height-t5);
`;
const TotalText = styled.span`
  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t4);

  font-variant-numeric: tabular-nums;
`;
// 막대 끝만 4px로 둥글리고, 구간 사이는 2px 표면색 간격으로 나눈다.
const BarTrack = styled.div`
  overflow: hidden;
  height: 16px;
  border-radius: 4px;

  display: flex;
  gap: 2px;
`;
const BarSegment = styled.span`
  min-width: 2px;
  flex-basis: 0;
`;
const EmptyText = styled.p`
  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t4);
`;
const LegendList = styled.ul`
  display: grid;
  gap: var(--seed-dimension-x2);

  list-style: none;
`;
const LegendItem = styled.li`
  display: flex;
  gap: var(--seed-dimension-x2);
  align-items: center;
`;
const LegendSwatch = styled.span`
  width: 12px;
  height: 12px;
  border-radius: var(--seed-radius-r1);

  flex-shrink: 0;
`;
const LegendValue = styled.span`
  margin-left: auto;

  font-weight: var(--seed-font-weight-medium);

  font-variant-numeric: tabular-nums;
`;
