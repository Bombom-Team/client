import styled from '@emotion/styled';
import { useCallback, useState } from 'react';
import { CarouselContext } from './CarouselContext';
import useCarousel from './useCarousel';
import type { AutoPlayOption } from './Carousel.types';
import type { PropsWithChildren } from 'react';

interface CarouselRootProps {
  loop?: boolean;
  autoPlay?: AutoPlayOption;
  hasAnimation?: boolean;
}

const CarouselRoot = ({
  loop = false,
  autoPlay = false,
  hasAnimation = true,
  children,
}: PropsWithChildren<CarouselRootProps>) => {
  const [slideCount, setSlideCount] = useState(0);

  const registerSlideCount = useCallback((count: number) => {
    setSlideCount(count);
  }, []);

  const {
    slideIndex,
    next,
    prev,
    slideWrapperRef,
    isTransitioning,
    isSwiping,
    handleTransitionEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useCarousel({ slideCount, loop, autoPlay });

  return (
    <CarouselContext.Provider
      value={{
        slideIndex,
        slideCount,
        registerSlideCount,

        slideWrapperRef,

        isTransitioning,
        isSwiping,
        handleTransitionEnd,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,

        next,
        prev,

        loop,
        hasAnimation,
      }}
    >
      <Container role="region" aria-label="배너 슬라이드">
        {children}
      </Container>
    </CarouselContext.Provider>
  );
};

export default CarouselRoot;

const Container = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;
  min-height: fit-content;
  padding: 0 12px;

  background: transparent;
`;
