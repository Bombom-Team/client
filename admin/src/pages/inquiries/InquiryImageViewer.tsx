import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

interface InquiryImageViewerProps {
  images: string[];
  // 처음 열 때 보여줄 이미지 위치.
  startIndex: number;
  onClose: () => void;
}

export function InquiryImageViewer({
  images,
  startIndex,
  onClose,
}: InquiryImageViewerProps) {
  const [index, setIndex] = useState(startIndex);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const hasMultiple = images.length > 1;

  // 열릴 때 포커스를 뷰어 안으로 가져온다. 그러지 않으면 뒤에 있는 썸네일 버튼에
  // Tab으로 닿아 뷰어가 하나 더 열리고, 방향키가 두 뷰어를 동시에 넘긴다.
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    overlay.focus();

    return () => {
      previouslyFocused?.focus?.();
    };
  }, []);

  // 다른 이미지를 눌러 열면 그 위치부터 보여준다.
  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      // Tab이 뷰어 밖으로 나가지 않게 가둔다.
      if (event.key === 'Tab') {
        const focusables = overlayRef.current?.querySelectorAll('button');
        if (!focusables || focusables.length === 0) {
          event.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;

        if (
          event.shiftKey &&
          (active === first || active === overlayRef.current)
        ) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }
      if (!hasMultiple) return;
      if (event.key === 'ArrowLeft') {
        setIndex((prev) => (prev - 1 + images.length) % images.length);
      }
      if (event.key === 'ArrowRight') {
        setIndex((prev) => (prev + 1) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, hasMultiple, images.length]);

  const handleStep = (step: number) => {
    setIndex((prev) => (prev + step + images.length) % images.length);
  };

  return (
    <Overlay
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="첨부 이미지 보기"
      tabIndex={-1}
      onClick={onClose}
    >
      <CloseButton type="button" aria-label="닫기" onClick={onClose}>
        <FiX size={20} />
      </CloseButton>

      {hasMultiple && (
        <StepButton
          type="button"
          aria-label="이전 이미지"
          $side="left"
          onClick={(e) => {
            e.stopPropagation();
            handleStep(-1);
          }}
        >
          <FiChevronLeft size={24} />
        </StepButton>
      )}

      {/* 이미지를 눌렀을 때는 닫히지 않게 한다. 배경을 눌러야 닫힌다. */}
      <FullImage
        src={images[index]}
        alt={`첨부 이미지 ${index + 1}`}
        onClick={(e) => e.stopPropagation()}
      />

      {hasMultiple && (
        <StepButton
          type="button"
          aria-label="다음 이미지"
          $side="right"
          onClick={(e) => {
            e.stopPropagation();
            handleStep(1);
          }}
        >
          <FiChevronRight size={24} />
        </StepButton>
      )}

      {hasMultiple && (
        <PageIndicator>
          {index + 1} / {images.length}
        </PageIndicator>
      )}
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.xl};

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgb(15 23 42 / 80%);

  inset: 0;
`;

const FullImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  width: 40px;
  height: 40px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.full};

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgb(255 255 255 / 15%);
  color: ${({ theme }) => theme.colors.white};

  cursor: pointer;

  transition: background-color 0.15s;

  &:hover {
    background-color: rgb(255 255 255 / 30%);
  }
`;

const StepButton = styled('button', {
  shouldForwardProp: (prop) => prop !== '$side',
})<{ $side: 'left' | 'right' }>`
  position: absolute;
  ${({ $side, theme }) =>
    $side === 'left'
      ? `left: ${theme.spacing.lg};`
      : `right: ${theme.spacing.lg};`}
  width: 40px;
  height: 40px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.full};

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgb(255 255 255 / 15%);
  color: ${({ theme }) => theme.colors.white};

  cursor: pointer;

  transition: background-color 0.15s;

  &:hover {
    background-color: rgb(255 255 255 / 30%);
  }
`;

const PageIndicator = styled.span`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.lg};

  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
