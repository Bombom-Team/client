import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useCarouselContext } from './contexts/CarouselContext';
import ChevronIcon from '../icons/ChevronIcon';
import type { SlideButtonPosition } from './Carousel.types';

interface CarouselNavButtonsProps {
  position?: SlideButtonPosition;
}

const CarouselNavButtons = ({
  position = 'middle',
}: CarouselNavButtonsProps) => {
  const { goNext, goPrev, canGoPrev, canGoNext, startTransition } =
    useCarouselContext();

  const handleNext = () => {
    startTransition();
    goNext();
  };

  const handlePrev = () => {
    startTransition();
    goPrev();
  };

  return (
    <Container position={position}>
      <NavButton
        type="button"
        onClick={handlePrev}
        disabled={!canGoPrev}
        aria-label="이전 슬라이드 이동"
      >
        <ChevronIcon
          direction="left"
          width="100%"
          height="100%"
          fill={canGoPrev ? theme.colors.primary : theme.colors.disabledText}
        />
      </NavButton>

      <NavButton
        type="button"
        onClick={handleNext}
        disabled={!canGoNext}
        aria-label="다음 슬라이드 이동"
      >
        <ChevronIcon
          direction="right"
          width="100%"
          height="100%"
          fill={canGoNext ? theme.colors.primary : theme.colors.disabledText}
        />
      </NavButton>
    </Container>
  );
};

export default CarouselNavButtons;

const Container = styled.div<{ position: SlideButtonPosition }>`
  position: ${({ position }) =>
    position === 'middle' ? 'absolute' : 'relative'};
  top: 50%;
  left: 0;
  width: 100%;
  padding: 12px 8px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  pointer-events: none;

  transform: ${({ position }) =>
    position === 'middle' ? 'translateY(-50%)' : 'none'};
`;

const NavButton = styled.button`
  width: clamp(32px, 10%, 48px);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgb(0 0 0 / 12%);

  display: flex;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.white};

  pointer-events: auto;
`;
