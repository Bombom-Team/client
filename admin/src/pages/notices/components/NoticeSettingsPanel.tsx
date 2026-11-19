import styled from '@emotion/styled';
import {
  NOTICE_CATEGORY_LABELS,
  type NoticeCategoryType,
} from '@/types/notice';

const NOTICE_CATEGORY_OPTIONS: { label: string; value: NoticeCategoryType }[] =
  Object.entries(NOTICE_CATEGORY_LABELS).map(([value, label]) => ({
    label,
    value: value as NoticeCategoryType,
  }));

interface NoticeSettingsPanelProps {
  category: NoticeCategoryType;
  onCategoryChange: (category: NoticeCategoryType) => void;
}

export const NoticeSettingsPanel = ({
  category,
  onCategoryChange,
}: NoticeSettingsPanelProps) => {
  return (
    <Panel>
      <PanelTitle>공지 설정</PanelTitle>

      <Section>
        <Label>카테고리</Label>
        <Select
          value={category}
          onChange={(e) =>
            onCategoryChange(e.target.value as NoticeCategoryType)
          }
        >
          {NOTICE_CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Section>
    </Panel>
  );
};

const Panel = styled.aside`
  width: 320px;
  padding: 16px;
  border-left: 1px solid ${({ theme }) => theme.colors.gray200};

  flex-shrink: 0;

  background: ${({ theme }) => theme.colors.gray50};

  overflow-y: auto;
`;

const PanelTitle = styled.h3`
  margin-bottom: 16px;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.base};
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  margin-bottom: 8px;

  display: block;

  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const Select = styled.select`
  width: 100%;
  padding: 6px 8px;
  outline: none;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  background: white;
  font-size: ${({ theme }) => theme.fontSize.sm};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;
