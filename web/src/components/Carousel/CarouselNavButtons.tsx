import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useCarouselContext } from './CarouselContext';
import ChevronIcon from '../icons/ChevronIcon';
import type { SlideButtonPosition } from './Carousel.types';

interface CarouselNavButtonsProps {
  position?: SlideButtonPosition;
}

const CarouselNavButtons = ({
  position = 'middle',
}: CarouselNavButtonsProps) => {
  const { prev, next } = useCarouselContext();

  return (
    <>
      <PrevSlideButton
        type="button"
        onClick={prev}
        position={position}
        aria-label="이전 슬라이드 이동"
      >
        <ChevronIcon
          direction="left"
          width="100%"
          height="100%"
          fill={theme.colors.primary}
        />
      </PrevSlideButton>

      <NextSlideButton
        type="button"
        onClick={next}
        position={position}
        aria-label="다음 슬라이드 이동"
      >
        <ChevronIcon
          direction="right"
          width="100%"
          height="100%"
          fill={theme.colors.primary}
        />
      </NextSlideButton>
    </>
  );
};

export default CarouselNavButtons;

const NavButton = styled.button<{ position: SlideButtonPosition }>`
  position: absolute;
  top: ${({ position }) => (position === 'middle' ? '50%' : 'auto')};
  right: 8px;
  bottom: ${({ position }) => (position === 'bottom' ? '8px' : 'auto')};
  width: clamp(32px, 10%, 48px);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgb(0 0 0 / 12%);

  display: flex;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.white};

  transform: ${({ position }) =>
    position === 'middle' ? 'translateY(-50%)' : 'none'};

  &:hover {
    background-color: ${({ theme }) => theme.colors.dividers};
  }
`;

const PrevSlideButton = styled(NavButton)`
  left: 8px;
`;

const NextSlideButton = styled(NavButton)`
  right: 8px;
`;
