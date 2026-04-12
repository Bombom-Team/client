import styled from '@emotion/styled';
import type { Device } from '@/hooks/useDevice';
import type { ChangeEvent, KeyboardEvent } from 'react';
import CheckIcon from '#/assets/svg/check.svg';
import EditIcon from '#/assets/svg/edit.svg';

interface WeeklyGoalEditorProps {
  isEditing: boolean;
  goalValue: number | null;
  isPending: boolean;
  device: Device;
  onEditStart: () => void;
  onSave: () => void;
  onCancel: () => void;
  onGoalChange: (value: number | null) => void;
}

interface WeeklyGoalInputProps {
  goalValue: number | null;
  isPending: boolean;
  device: Device;
  onSave: () => void;
  onCancel: () => void;
  onGoalChange: (value: number | null) => void;
}

export function WeeklyGoalInput({
  goalValue,
  isPending,
  device,
  onSave,
  onCancel,
  onGoalChange,
}: WeeklyGoalInputProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^[1-9][0-9]{0,2}$/.test(value)) {
      onGoalChange(Number(value) || null);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <EditInput
      device={device}
      type="text"
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
      autoComplete="off"
      value={goalValue || ''}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onBlur={onSave}
      disabled={isPending}
      placeholder="1-127"
      aria-label="주간 목표 수정"
      onFocus={(e) => {
        e.target.select();
      }}
    />
  );
}

function WeeklyGoalEditor({
  isEditing,
  isPending,
  device,
  onEditStart,
  onSave,
}: Pick<
  WeeklyGoalEditorProps,
  'isEditing' | 'isPending' | 'device' | 'onEditStart' | 'onSave'
>) {
  return (
    <Container device={device}>
      <EditButton
        device={device}
        type="button"
        onClick={isEditing ? onSave : onEditStart}
        aria-label={isEditing ? '주간 목표 저장' : '주간 목표 편집'}
        disabled={isPending}
        isEditing={isEditing}
      >
        {isEditing ? (
          <>
            <CheckIcon width={12} height={12} />
            {device === 'pc' && (
              <ButtonText device={device}>수정 완료</ButtonText>
            )}
          </>
        ) : (
          <EditIcon
            width={device === 'pc' ? 14 : 12}
            height={device === 'pc' ? 14 : 12}
          />
        )}
      </EditButton>
    </Container>
  );
}

export default WeeklyGoalEditor;

const Container = styled.div<{ device: Device }>`
  margin-left: 0.25rem;

  display: flex;
  align-items: center;
`;

const EditButton = styled.button<{
  device: Device;
  isEditing?: boolean;
}>`
  border: none;
  border-radius: 0.1875rem;

  display: flex;
  gap: 0.25rem;
  align-items: center;
  justify-content: center;

  background: ${({ theme, isEditing }) =>
    isEditing ? theme.colors.primary : 'transparent'};
  color: ${({ theme, isEditing }) =>
    isEditing ? theme.colors.white : theme.colors.textTertiary};

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme, isEditing }) =>
      isEditing ? theme.colors.primary : theme.colors.dividers};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  svg {
    fill: currentcolor;
  }

  ${({ device, isEditing }) =>
    device === 'pc'
      ? `
        width: ${isEditing ? 'auto' : '1.25rem'};
        height: 1.25rem;
        padding: ${isEditing ? '0.25rem 0.5rem' : '0.125rem'};
        min-width: ${isEditing ? '72px' : '20px'};
      `
      : `
        width: ${isEditing ? 'auto' : '1.125rem'};
        height: 1.125rem;
        padding: ${isEditing ? '0.1875rem 0.375rem' : '0.125rem'};
        min-width: 18px;
      `}
`;

const ButtonText = styled.span<{ device: Device }>`
  font: ${({ theme, device }) =>
    device === 'pc' ? theme.fonts.caption : theme.fonts.caption};
  font-size: ${({ device }) => (device === 'pc' ? '0.6875rem' : '0.625rem')};
  white-space: nowrap;
`;

const EditInput = styled.input<{ device: Device }>`
  width: 2.5rem;
  height: auto;
  margin: 0;
  padding: 0.125rem 0.25rem;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 0.1875rem;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body2};
  line-height: 1;
  text-align: center;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.0625rem ${({ theme }) => theme.colors.primary}40;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
    font-size: 0.625rem;
  }
`;
