import { theme } from '@bombom/shared/theme';
import styled from '@emotion/styled';
import EditableMemoCard from '../MemoCard/EditableMemoCard';
import ChevronIcon from '@/components/icons/ChevronIcon';
import type { Highlight } from '../../types/highlight';
import CloseIcon from '#/assets/svg/close.svg';
import MemoIcon from '#/assets/svg/memo.svg';

interface MemoPanelProps {
  opened: boolean;
  memos: Highlight[];
  removeHighlight: ({ id }: { id: number }) => void;
  updateMemo: (id: number, memo: string) => void;
  onCloseButtonClick: () => void;
  onToggleButtonClick: () => void;
}

const MemoPanel = ({
  opened,
  memos,
  removeHighlight,
  updateMemo,
  onCloseButtonClick,
  onToggleButtonClick,
}: MemoPanelProps) => {
  return (
    <Container opened={opened}>
      <ToggleButton opened={opened} onClick={onToggleButtonClick}>
        <ChevronIcon
          direction={opened ? 'right' : 'left'}
          width={24}
          height={24}
          color={theme.colors.primary}
        />
      </ToggleButton>

      <Header>
        <HeaderLeft>
          <IconWrapper>
            <MemoIcon fill={theme.colors.primary} width={24} height={24} />
          </IconWrapper>
          <HeaderTitleBox>
            <HeaderTitleText>읽기 노트</HeaderTitleText>
            <HeaderTitleCaption>{memos.length}개의 메모</HeaderTitleCaption>
          </HeaderTitleBox>
        </HeaderLeft>

        <CloseButton onClick={onCloseButtonClick}>
          <CloseIcon fill={theme.colors.black} />
        </CloseButton>
      </Header>

      <NotesList>
        {memos.length === 0 ? (
          <EmptyWrapper>
            <EmptyIconWrapper>
              <MemoIcon width={36} height={36} fill={theme.colors.primary} />
            </EmptyIconWrapper>
            <HeaderTitleText>아직 메모가 없어요</HeaderTitleText>
            <HeaderTitleCaption>
              중요한 내용을 메모로 기록해보세요
            </HeaderTitleCaption>
          </EmptyWrapper>
        ) : (
          memos?.map((note) => (
            <EditableMemoCard
              key={note.id}
              id={note.id}
              content={note.text}
              memo={note.memo}
              onRemoveButtonClick={removeHighlight}
              onMemoChange={updateMemo}
            />
          ))
        )}
      </NotesList>
    </Container>
  );
};

export default MemoPanel;

const Container = styled.aside<{ opened: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.panel};
  width: 21.375rem;
  height: 100%;
  padding-top: 4.5rem;
  border-left: 1px solid ${({ theme }) => theme.colors.stroke};

  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};

  transform: ${({ opened }) => (opened ? 'translateX(0)' : 'translateX(100%)')};

  transition: transform 0.3s;
`;

const ToggleButton = styled.button<{ opened: boolean }>`
  position: absolute;
  top: 80vh;
  left: -2.5rem;
  width: 2.5rem;
  height: 5rem;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 0.5rem 0 0 0.5rem;

  background-color: ${({ theme }) => theme.colors.white};

  transform: translateY(-50%);
`;

const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dividers};

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  gap: 0.625rem;
  align-items: center;
`;
const HeaderTitleBox = styled.div``;

const HeaderTitleText = styled.h5`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading5};
`;

const HeaderTitleCaption = styled.h5`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.caption};
`;

const IconWrapper = styled.div`
  padding: 0.375rem;
  border-radius: 50%;
  box-shadow: 0 0.0625rem 0.125rem rgb(0 0 0 / 5%);

  background-color: ${({ theme }) => `${theme.colors.primary}10`};
`;

const CloseButton = styled.button`
  padding: 0.375rem;
`;

const NotesList = styled.div`
  padding: 1.5rem;

  display: flex;
  gap: 1rem;
  flex: 1;
  flex-direction: column;

  overflow-y: auto;
`;

const EmptyWrapper = styled.div`
  padding-top: 5rem;
  padding-bottom: 5rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EmptyIconWrapper = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 50%;

  background-color: ${({ theme }) => `${theme.colors.primary}10`};
`;
