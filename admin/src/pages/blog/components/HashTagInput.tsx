import styled from '@emotion/styled';
import { useState, type KeyboardEvent } from 'react';

interface HashTagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export const HashTagInput = ({ tags, onChange }: HashTagInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const MAX_TAG_LENGTH = 30;
  const MAX_TAG_COUNT = 10;
  const VALID_TAG = /^[a-zA-Z0-9가-힣_-]+$/;

  const addTag = () => {
    const trimmed = inputValue.trim().replace(/^#/, '');
    if (
      trimmed &&
      trimmed.length <= MAX_TAG_LENGTH &&
      VALID_TAG.test(trimmed) &&
      tags.length < MAX_TAG_COUNT &&
      !tags.includes(trimmed)
    ) {
      onChange([...tags, trimmed]);
    }
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
    if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <Container>
      <TagList>
        {tags.map((tag) => (
          <Tag key={tag}>
            #{tag}
            <RemoveButton
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              type="button"
            >
              ×
            </RemoveButton>
          </Tag>
        ))}
      </TagList>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder="태그 입력 후 Enter"
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-direction: column;
`;

const TagList = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  padding: 2px 8px;
  border-radius: 12px;

  display: inline-flex;
  gap: 4px;
  align-items: center;

  background: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const RemoveButton = styled.button`
  padding: 0;
  border: none;

  background: none;
  color: ${({ theme }) => theme.colors.gray500};
  font-size: 14px;
  line-height: 1;

  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.gray900};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 6px 8px;
  outline: none;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  font-size: ${({ theme }) => theme.fontSize.sm};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;
