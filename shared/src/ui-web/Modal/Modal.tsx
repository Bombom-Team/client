import { theme } from '../../core/theme';
import { css } from '@emotion/react';
import type { CSSObject } from '@emotion/react';
import styled from '@emotion/styled';
import CloseIcon from '../icons/CloseIcon';
import type { PropsWithChildren, Ref } from 'react';

type Position = 'center' | 'bottom' | 'dropdown' | 'fullscreen';

interface ModalProps extends PropsWithChildren {
  modalRef: Ref<HTMLDivElement | null>;
  closeModal: () => void;
  isOpen: boolean;
  position?: Position;
  showCloseButton?: boolean;
  showBackdrop?: boolean;
}

const Modal = ({
  modalRef,
  closeModal,
  position = 'center',
  showCloseButton = true,
  showBackdrop = true,
  isOpen,
  children,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      {showBackdrop && <Backdrop />}
      <Container
        role="dialog"
        aria-modal="true"
        ref={modalRef}
        position={position}
      >
        {showCloseButton && (
          <CloseButton
            type="button"
            onClick={closeModal}
            aria-label="모달 닫기"
          >
            <CloseIcon width={36} height={36} fill={theme.colors.black} />
          </CloseButton>
        )}
        <ContentWrapper position={position}>{children}</ContentWrapper>
      </Container>
    </>
  );
};

export default Modal;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex.overlay};
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgb(0 0 0 / 30%);

  backdrop-filter: blur(2px);
`;

const Container = styled.div<{ position: Position }>`
  position: fixed;
  z-index: ${({ theme }) => theme.zIndex.overlay};

  display: flex;
  flex-direction: column;

  background: ${({ theme }) => theme.colors.white};

  ${({ position }) => containerStyles[position]}
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  border: none;

  display: flex;
  align-items: center;
  justify-content: center;

  background: none;

  @media (width >= 769px) {
    top: 20px;
    right: 20px;
  }
`;

const ContentWrapper = styled.div<{ position: Position }>`
  min-height: 0;

  display: flex;
  flex-direction: column;

  overflow-y: auto;

  ${({ position }) => contentWrapperStyles[position]}
`;

const containerStyles: Record<Position, CSSObject> = {
  dropdown: {
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  bottom: {
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    maxHeight: '80vh',
    borderRadius: '12px 12px 0 0',
    boxShadow: 'none',
  },
  center: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '90vw',
    maxHeight: '90vh',
    borderRadius: '12px',
    boxShadow: 'none',
  },
  fullscreen: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 0,
    boxShadow: 'none',
  },
};

const contentWrapperStyles: Record<Position, ReturnType<typeof css>> = {
  dropdown: css`
    height: auto;
    padding: 16px;

    align-items: stretch;
  `,
  bottom: css`
    height: 100%;
    padding: 24px 12px;

    align-items: center;

    @media (width >= 769px) {
      padding: 32px;
    }
  `,
  center: css`
    width: 100%;
    height: 100%;
    padding: 24px;

    align-items: center;

    @media (width >= 769px) {
      padding: 36px 52px;
    }
  `,
  fullscreen: css`
    width: 100%;
    height: 100%;
    padding: 24px 12px;

    align-items: center;
    justify-content: center;

    @media (width >= 769px) {
      padding: 36px 52px;
    }
  `,
};
