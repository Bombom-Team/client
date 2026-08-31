import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import Checkbox from '@/components/Checkbox/Checkbox';
import CancelIcon from '#/assets/svg/close.svg';
import DeleteIcon from '#/assets/svg/delete.svg';

interface SelectionControlProps {
  editMode: boolean;
  checkedCount: number;
  isAllSelected: boolean;
  onEnterEditMode: () => void;
  onExitEditMode: () => void;
  onToggleSelectAll: () => void;
  onDeleteClick: () => void;
}

const SelectionControl = ({
  editMode,
  checkedCount,
  isAllSelected,
  onEnterEditMode,
  onExitEditMode,
  onToggleSelectAll,
  onDeleteClick,
}: SelectionControlProps) => {
  if (!editMode) {
    return <TextButton onClick={onEnterEditMode}>선택 삭제</TextButton>;
  }

  const isDeleteDisabled = checkedCount === 0;

  return (
    <DeleteWrapper>
      <Checkbox id="all" checked={isAllSelected} onChange={onToggleSelectAll} />
      <DeleteCount>{checkedCount}개 선택됨</DeleteCount>
      <HorizontalDivider />
      <DeleteIconButton disabled={isDeleteDisabled} onClick={onDeleteClick}>
        <DeleteIcon
          fill={
            isDeleteDisabled
              ? theme.colors.disabledBackground
              : theme.colors.error
          }
        />
      </DeleteIconButton>
      <CancelIcon fill={theme.colors.black} onClick={onExitEditMode} />
    </DeleteWrapper>
  );
};

export default SelectionControl;

const DeleteWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const DeleteCount = styled.p`
  min-width: 68px;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;

const HorizontalDivider = styled.div`
  width: 2px;
  height: 16px;

  background-color: ${({ theme }) => theme.colors.stroke};
`;

const TextButton = styled.button`
  padding-left: 8px;

  display: flex;
  gap: 4px;
  align-items: center;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
    transition: all 0.2s ease-in-out;
  }
`;

const DeleteIconButton = styled.button``;
