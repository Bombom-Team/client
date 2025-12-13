import styled from '@emotion/styled';
import { CarouselContext } from './CarouselContext';
import useCarousel from './useCarousel';
import type { AutoPlayOption } from './Carousel.types';
import type { PropsWithChildren } from 'react';

/**
 * 1. 무한 캐러셀만 자동 재생 설정 가능
 * 2. 자동 재생 활성화 상태에서만 재생 속도 설정 가능
 */
type PlayOption =
  | { loop: true; autoPlay?: AutoPlayOption }
  | { loop?: false; autoPlay?: false };

type CarouselRootProps = { hasAnimation?: boolean } & PlayOption;

const CarouselRoot = ({
  loop = false,
  autoPlay = false,
  hasAnimation = true,
  children,
}: PropsWithChildren<CarouselRootProps>) => {
  const {
    slideIndex,
    slideCount,
    registerSlideCount,
    next,
    prev,
    slideWrapperRef,
    isTransitioning,
    isSwiping,
    handleTransitionEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useCarousel({ loop, autoPlay });

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
