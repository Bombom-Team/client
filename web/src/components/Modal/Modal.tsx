import { theme } from '@bombom/shared/theme';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useDevice } from '@/hooks/useDevice';
import type { PropsWithChildren, Ref } from 'react';
import CloseIcon from '#/assets/svg/close.svg';

type Position = 'center' | 'bottom' | 'dropdown' | 'fullscreen';

interface UseModalParams extends PropsWithChildren {
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
}: UseModalParams) => {
  const device = useDevice();
  const isMobile = device === 'mobile';
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
            isMobile={isMobile}
          >
            <CloseIcon width={36} height={36} fill={theme.colors.black} />
          </CloseButton>
        )}
        <ContentWrapper position={position} isMobile={isMobile}>
          {children}
        </ContentWrapper>
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

  backdrop-filter: blur(0.125rem);
`;

const Container = styled.div<{
  position: Position;
}>`
  position: fixed;
  z-index: ${({ theme }) => theme.zIndex.overlay};

  display: flex;
  flex-direction: column;

  background: ${({ theme }) => theme.colors.white};

  ${({ position }) => containerStyles[position]}
`;

const CloseButton = styled.button<{ isMobile: boolean }>`
  position: absolute;
  top: ${({ isMobile }) => (isMobile ? '0.75rem' : '1.25rem')};
  right: ${({ isMobile }) => (isMobile ? '0.75rem' : '1.25rem')};
  border: none;

  display: flex;
  align-items: center;
  justify-content: center;

  background: none;
`;

const ContentWrapper = styled.div<{ position: Position; isMobile: boolean }>`
  min-height: 0;

  display: flex;
  flex-direction: column;

  overflow-y: auto;

  ${({ position, isMobile }) => contentWrapperStyles(isMobile)[position]}
`;

const containerStyles = {
  dropdown: {
    height: 'auto',
    borderRadius: '0.5rem',
    boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, 0.15)',
  },
  bottom: {
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    maxHeight: '80vh',
    borderRadius: '0.75rem 0.75rem 0 0',
    boxShadow: 'none',
  },
  center: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '90vw',
    maxHeight: '90vh',
    borderRadius: '0.75rem',
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

const contentWrapperStyles = (isMobile: boolean) => ({
  dropdown: css`
    height: auto;
    padding: 1rem;

    align-items: stretch;
  `,
  bottom: css`
    height: 100%;
    padding: ${isMobile ? '1.5rem 0.75rem' : '2rem'};

    align-items: center;
  `,
  center: css`
    width: 100%;
    height: 100%;
    padding: ${isMobile ? '1.5rem' : '2.25rem 3.25rem'};

    align-items: center;
  `,
  fullscreen: css`
    width: 100%;
    height: 100%;
    padding: ${isMobile ? '1.5rem 0.75rem' : '2.25rem 3.25rem'};

    align-items: center;
    justify-content: center;
  `,
});
