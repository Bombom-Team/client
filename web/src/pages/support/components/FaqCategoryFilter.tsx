import styled from '@emotion/styled';
import { FAQ_CATEGORY_LABELS } from '@/types/faq';
import type { FaqCategoryType } from '@/types/faq';

interface FaqCategoryFilterProps {
  activeCategory: FaqCategoryType | 'ALL';
  onCategoryChange: (category: FaqCategoryType | 'ALL') => void;
}

const CATEGORY_OPTIONS: Array<{
  value: FaqCategoryType | 'ALL';
  label: string;
}> = [
  { value: 'ALL', label: '전체' },
  ...(
    Object.entries(FAQ_CATEGORY_LABELS) as Array<[FaqCategoryType, string]>
  ).map(([value, label]) => ({ value, label })),
];

const FaqCategoryFilter = ({
  activeCategory,
  onCategoryChange,
}: FaqCategoryFilterProps) => {
  return (
    <Container>
      {CATEGORY_OPTIONS.map((option) => (
        <FilterButton
          key={option.value}
          type="button"
          isActive={activeCategory === option.value}
          onClick={() => onCategoryChange(option.value)}
        >
          {option.label}
        </FilterButton>
      ))}
    </Container>
  );
};

export default FaqCategoryFilter;

const Container = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ isActive: boolean }>`
  padding: 8px 12px;
  border-radius: 20px;

  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primaryBomBom : theme.colors.dividers};
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.white : theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t4Regular};
`;
