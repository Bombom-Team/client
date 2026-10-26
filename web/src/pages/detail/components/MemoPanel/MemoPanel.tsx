import { theme } from '@bombom/shared/theme';
import { ChevronIcon, useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useId } from 'react';
import { useMemoPanelViewport } from '../../hooks/useMemoPanelViewport';
import EditableMemoCard from '../MemoCard/EditableMemoCard';
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
  const device = useDevice();
  const isPC = device === 'pc';
  const notesId = useId();
  // 닫힌 패널의 펼치기 버튼도 확대된 화면 영역을 따라가므로 구독을 유지한다.
  const viewportStyle = useMemoPanelViewport();

  return (
    <Container opened={opened} isPC={isPC} style={viewportStyle}>
      <ToggleButton
        opened={opened}
        isPC={isPC}
        onClick={onToggleButtonClick}
        aria-label={opened ? '읽기 노트 접기' : '읽기 노트 펼치기'}
        aria-expanded={opened}
        aria-controls={notesId}
      >
        <ChevronIcon
          direction={opened ? 'right' : 'left'}
          width={24}
          height={24}
          color={theme.colors.primaryBomBom}
        />
      </ToggleButton>

      <Header inert={!opened} aria-hidden={!opened}>
        <HeaderLeft>
          <IconWrapper>
            <MemoIcon
              fill={theme.colors.primaryBomBom}
              width={24}
              height={24}
            />
          </IconWrapper>
          <HeaderTitleBox>
            <HeaderTitleText>읽기 노트</HeaderTitleText>
            <HeaderTitleCaption>{memos.length}개의 메모</HeaderTitleCaption>
          </HeaderTitleBox>
        </HeaderLeft>

        <CloseButton onClick={onCloseButtonClick} aria-label="읽기 노트 닫기">
          <CloseIcon fill={theme.colors.black} />
        </CloseButton>
      </Header>

      <NotesList id={notesId} inert={!opened} aria-hidden={!opened}>
        {memos.length === 0 ? (
          <EmptyWrapper>
            <EmptyIconWrapper>
              <MemoIcon
                width={36}
                height={36}
                fill={theme.colors.primaryBomBom}
              />
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

const Container = styled.aside<{ opened: boolean; isPC: boolean }>`
  --memo-header-height: ${({ isPC, theme }) =>
    isPC
      ? `calc(${theme.heights.headerPC} + 40px)`
      : `calc(${theme.heights.headerMobile} + ${theme.safeArea.top})`};

  position: fixed;
  top: max(var(--memo-header-height), var(--memo-viewport-top, 0px));
  right: calc(
    100% - var(--memo-viewport-width, 100vw) - var(--memo-viewport-left, 0px)
  );
  z-index: ${({ theme }) => theme.zIndex.panel};
  width: min(342px, var(--memo-viewport-width, 100vw));
  height: max(
    0px,
    calc(
      var(--memo-viewport-height, 100dvh) + var(--memo-viewport-top, 0px) -
        max(var(--memo-header-height), var(--memo-viewport-top, 0px))
    )
  );
  border-left: 1px solid ${({ theme }) => theme.colors.stroke};

  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};

  transform: ${({ opened }) => (opened ? 'translateX(0)' : 'translateX(100%)')};

  transition: transform 0.3s;
`;

const ToggleButton = styled.button<{ opened: boolean; isPC: boolean }>`
  position: absolute;
  top: clamp(40px, 80%, calc(100% - 40px));
  left: -40px;
  width: 40px;
  height: 80px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 8px 0 0 8px;

  display: ${({ opened, isPC }) => (opened && !isPC ? 'none' : 'block')};

  background-color: ${({ theme }) => theme.colors.white};

  transform: translateY(-50%);
`;

const Header = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dividers};

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
const HeaderTitleBox = styled.div``;

const HeaderTitleText = styled.h5`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t7Bold};
`;

const HeaderTitleCaption = styled.h5`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t3Regular};
`;

const IconWrapper = styled.div`
  padding: 6px;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgb(0 0 0 / 5%);

  background-color: ${({ theme }) => `${theme.colors.primaryBomBom}10`};
`;

const CloseButton = styled.button`
  width: 44px;
  height: 44px;
  padding: 6px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotesList = styled.div`
  min-height: 0;
  padding: 24px 24px calc(24px + ${({ theme }) => theme.safeArea.bottom});

  display: flex;
  gap: 16px;
  flex: 1;
  flex-direction: column;

  overflow-y: auto;
  overscroll-behavior-y: contain;
`;

const EmptyWrapper = styled.div`
  padding-top: 80px;
  padding-bottom: 80px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EmptyIconWrapper = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 50%;

  background-color: ${({ theme }) => `${theme.colors.primaryBomBom}10`};
`;
