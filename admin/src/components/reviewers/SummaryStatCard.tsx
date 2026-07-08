import styled from '@emotion/styled';

type Props = {
  label: string;
  value: string;
  emphasis?: 'default' | 'error';
};

export const SummaryStatCard = ({ label, value, emphasis }: Props) => (
  <Card $emphasis={emphasis}>
    <Label>{label}</Label>
    <Value $emphasis={emphasis}>{value}</Value>
  </Card>
);

export const SummaryStatCardRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
`;

export const SummaryStatCardSkeleton = () => (
  <Card>
    <SkeletonBlock style={{ width: '56px', height: '14px' }} />
    <SkeletonBlock
      style={{ width: '80px', height: '28px', marginTop: '8px' }}
    />
  </Card>
);

const Card = styled.div<{ $emphasis?: 'default' | 'error' }>`
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-top: 3px solid
    ${({ theme, $emphasis }) =>
      $emphasis === 'error' ? theme.colors.error : theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Label = styled.span`
  display: block;

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  letter-spacing: 0.04em;
`;

const Value = styled.span<{ $emphasis?: 'default' | 'error' }>`
  margin-top: 6px;

  display: block;

  color: ${({ theme, $emphasis }) =>
    $emphasis === 'error' ? theme.colors.error : theme.colors.gray900};
  font-size: 28px;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-variant-numeric: tabular-nums;
`;

const SkeletonBlock = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  background: ${({ theme }) => theme.colors.gray100};
`;
