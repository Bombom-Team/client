import styled from '@emotion/styled';

interface MetricProps {
  label: string;
  value: number | undefined;
  description: string;
  emphasis?: boolean;
  fractionDigits?: number;
  unit?: string;
}

const Metric = ({
  label,
  value,
  description,
  emphasis = false,
  fractionDigits = 0,
  unit = '명',
}: MetricProps) => {
  const hasValue =
    typeof value === 'number' && Number.isFinite(value) && value >= 0;
  return (
    <Container $emphasis={emphasis}>
      <dt>{label}</dt>
      <ValueBox>
        {hasValue ? (
          <>
            <strong>
              {value.toLocaleString('ko-KR', {
                maximumFractionDigits: fractionDigits,
              })}
            </strong>
            <span>{unit}</span>
          </>
        ) : (
          <MissingBox>집계 없음</MissingBox>
        )}
      </ValueBox>
      <DescriptionBox>{description}</DescriptionBox>
    </Container>
  );
};

export default Metric;

const Container = styled.div<{ $emphasis: boolean }>`
  min-width: 0;
  padding: var(--seed-dimension-x6);
  border-radius: var(--seed-radius-r4);

  display: flex;
  gap: var(--seed-dimension-x2);
  flex-direction: column;

  background-color: ${({ $emphasis }) => ($emphasis ? 'var(--seed-color-bg-brand-weak)' : 'var(--seed-color-bg-layer-default)')};

  dt {
    color: var(--seed-color-fg-neutral-muted);
    font-weight: var(--seed-font-weight-medium);
  }
  strong { color: ${({ $emphasis }) => ($emphasis ? 'var(--seed-color-palette-carrot-800)' : 'var(--seed-color-fg-neutral)')}; }
`;

const ValueBox = styled.dd`
  display: flex;
  gap: var(--seed-dimension-x2);
  flex-wrap: wrap;
  align-items: baseline;

  font-variant-numeric: tabular-nums;

  strong {
    font-weight: var(--seed-font-weight-bold);
    font-size: var(--seed-font-size-t13);
    line-height: var(--seed-line-height-t13);

    overflow-wrap: anywhere;
  }
  span { color: var(--seed-color-fg-neutral-muted); }
`;

const MissingBox = styled.span`
  min-height: var(--seed-line-height-t13);

  display: inline-flex;
  align-items: center;
`;

const DescriptionBox = styled.dd`
  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t3);
  line-height: var(--seed-line-height-t3);
`;
