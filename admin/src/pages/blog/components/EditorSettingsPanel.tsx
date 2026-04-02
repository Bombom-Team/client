import styled from '@emotion/styled';
import { type ChangeEvent } from 'react';
import { HashTagInput } from './HashTagInput';
import type { BlogVisibility } from '@/types/blog';

interface Category {
  id: number;
  name: string;
}

interface EditorSettingsPanelProps {
  thumbnailUrl: string | null;
  categories: Category[];
  categoryId: number | null;
  hashTags: string[];
  visibility: BlogVisibility;
  onThumbnailUpload: (file: File) => void;
  onCategoryChange: (categoryId: number | null) => void;
  onHashTagsChange: (tags: string[]) => void;
  onVisibilityChange: (visibility: BlogVisibility) => void;
}

const THUMBNAIL_INPUT_ID = 'thumbnail-upload';

export const EditorSettingsPanel = ({
  thumbnailUrl,
  categories,
  categoryId,
  hashTags,
  visibility,
  onThumbnailUpload,
  onCategoryChange,
  onHashTagsChange,
  onVisibilityChange,
}: EditorSettingsPanelProps) => {
  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onThumbnailUpload(file);
  };

  return (
    <Panel>
      <PanelTitle>글 설정</PanelTitle>

      <Section>
        <Label>썸네일</Label>
        {/* label + htmlFor으로 시멘틱하게 input 연결 — onClick 불필요 */}
        <ThumbnailArea htmlFor={THUMBNAIL_INPUT_ID}>
          {thumbnailUrl ? (
            <ThumbnailImage src={thumbnailUrl} alt="썸네일" />
          ) : (
            <ThumbnailPlaceholder>+ 이미지 업로드</ThumbnailPlaceholder>
          )}
        </ThumbnailArea>
        <input
          id={THUMBNAIL_INPUT_ID}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleThumbnailChange}
        />
      </Section>

      <Section>
        <Label>카테고리</Label>
        <Select
          value={categoryId ?? ''}
          onChange={(e) =>
            onCategoryChange(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">카테고리 선택</option>
          {categories.length === 0 ? (
            <option disabled>카테고리 없음</option>
          ) : (
            categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))
          )}
        </Select>
      </Section>

      <Section>
        <Label>해시태그</Label>
        <HashTagInput tags={hashTags} onChange={onHashTagsChange} />
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
  width: 220px;
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

const ThumbnailArea = styled.label`
  overflow: hidden;
  width: 100%;
  border: 2px dashed ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  display: flex;
  align-items: center;
  justify-content: center;

  aspect-ratio: 16/9;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;

  object-fit: cover;
`;

const ThumbnailPlaceholder = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
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
  transition: color 0.15s, background-color 0.15s;
`;
