import styled from '@emotion/styled';
import { useCallback, useRef, type PropsWithChildren } from 'react';
import { DEFAULT_SPEED } from './Carousel.constants';
import { CarouselContext } from './contexts/CarouselContext';
import useCarouselAutoPlay from './hooks/useCarouselAutoPlay';
import useCarouselState from './hooks/useCarouselState';
import useCarouselSwipe from './hooks/useCarouselSwipe';
import useCarouselTransition from './hooks/useCarouselTransition';
import type { AutoPlayOption } from './Carousel.types';

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
  const slideWrapperRef = useRef<HTMLUListElement>(null);

  const {
    slideIndex,
    setSlideIndex,
    slideCount,
    canGoPrev,
    canGoNext,
    registerSlideCount,
    prev,
    next,
  } = useCarouselState({ loop });

  const { isTransitioning, setIsTransitioning, handleTransitionEnd } =
    useCarouselTransition({ slideIndex, slideCount, loop, setSlideIndex });

  const { isSwiping, handleTouchStart, handleTouchMove, handleTouchEnd } =
    useCarouselSwipe({
      enabled: !isTransitioning,
      slideIndex,
      canGoPrev,
      canGoNext,
      slideWrapperRef,
      onSwipe: (dir) => {
        setIsTransitioning(true);
        setSlideIndex((prev) => prev + dir);
      },
    });

  const handleNext = useCallback(() => {
    setIsTransitioning(true);
    next();
  }, [setIsTransitioning, next]);

  const handlePrev = useCallback(() => {
    setIsTransitioning(true);
    prev();
  }, [setIsTransitioning, prev]);

  const autoPlayEnabled =
    !!autoPlay && !isSwiping && !isTransitioning && slideCount > 1;

  useCarouselAutoPlay({
    enabled: autoPlayEnabled,
    delay: typeof autoPlay === 'object' ? autoPlay.delay : DEFAULT_SPEED,
    slideIndex,
    onNext: handleNext,
  });

  return (
    <CarouselContext.Provider
      value={{
        slideIndex,
        slideCount,
        registerSlideCount,
        canGoPrev,
        canGoNext,
        slideWrapperRef,
        isTransitioning,
        isSwiping,
        handleNext,
        handlePrev,
        handleTransitionEnd,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
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
