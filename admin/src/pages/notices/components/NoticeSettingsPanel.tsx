import styled from '@emotion/styled';
import {
  NOTICE_CATEGORY_LABELS,
  type NoticeCategoryType,
  type NoticeVisibility,
} from '@/types/notice';

const NOTICE_CATEGORY_OPTIONS: { label: string; value: NoticeCategoryType }[] =
  Object.entries(NOTICE_CATEGORY_LABELS).map(([value, label]) => ({
    label,
    value: value as NoticeCategoryType,
  }));

interface NoticeSettingsPanelProps {
  category: NoticeCategoryType;
  visibility: NoticeVisibility;
  onCategoryChange: (category: NoticeCategoryType) => void;
  onVisibilityChange: (visibility: NoticeVisibility) => void;
}

export const NoticeSettingsPanel = ({
  category,
  visibility,
  onCategoryChange,
  onVisibilityChange,
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

      <Section>
        <Label>공개 범위</Label>
        <VisibilityToggle>
          <VisibilityButton
            $isActive={visibility === 'PUBLIC'}
            onClick={() => onVisibilityChange('PUBLIC')}
            type="button"
          >
            공개
          </VisibilityButton>
          <VisibilityButton
            $isActive={visibility === 'PRIVATE'}
            onClick={() => onVisibilityChange('PRIVATE')}
            type="button"
          >
            비공개
          </VisibilityButton>
        </VisibilityToggle>
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

const VisibilityToggle = styled.div`
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  display: flex;
`;

const VisibilityButton = styled.button<{ $isActive: boolean }>`
  padding: 6px;
  border: none;

  flex: 1;

  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : 'white'};
  color: ${({ theme, $isActive }) =>
    $isActive ? 'white' : theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};

  cursor: pointer;
  transition:
    color 0.15s,
    background-color 0.15s;
`;
