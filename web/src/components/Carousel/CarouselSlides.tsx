import styled from '@emotion/styled';
import { Children, useEffect, type PropsWithChildren } from 'react';
import { TRANSITIONS } from './Carousel.constants';
import { useCarouselContext } from './CarouselContext';
import useCarouselAccessibility from './useCarouselAccessibility';

interface CarouselSlidesProps {
  showNextSlidePart?: boolean;
}

export function CarouselSlides({
  showNextSlidePart = false,
  children,
}: PropsWithChildren<CarouselSlidesProps>) {
  const {
    slideIndex,
    slideCount,
    slides,
    registerSlides,
    slideWrapperRef,
    isTransitioning,
    isSwiping,
    handleTransitionEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    hasAnimation,
    loop,
  } = useCarouselContext();

  const hasMultipleSlides = slideCount > 1;

  const { handleFocus, handleBlur } = useCarouselAccessibility();

  useEffect(() => {
    const list = Children.toArray(children);
    registerSlides(list);
  }, [children, registerSlides]);

  return (
    <Container
      ref={slideWrapperRef}
      slideIndex={slideIndex}
      isTransitioning={isTransitioning}
      isSwiping={isSwiping}
      onTransitionEnd={handleTransitionEnd}
      hasAnimation={hasMultipleSlides ? hasAnimation : false}
      showNextSlidePart={hasMultipleSlides ? showNextSlidePart : false}
      tabIndex={0}
      aria-live="off"
      aria-atomic="true"
      aria-label={`총 ${slideCount}개 중 ${slideIndex + 1}번째 슬라이드`}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...(hasMultipleSlides && {
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
      })}
    >
      {loop && slides[slides.length - 1]}
      {children}
      {loop && slides[0]}
    </Container>
  );
}

const Container = styled.ul<{
  slideIndex: number;
  isTransitioning: boolean;
  isSwiping: boolean;
  hasAnimation: boolean;
  showNextSlidePart: boolean;
}>`
  position: relative;
  margin: ${({ showNextSlidePart }) =>
    showNextSlidePart ? '0 20px 0 -12px' : '0 -12px'};

  display: flex;

  transform: ${({ slideIndex }) => `translateX(-${slideIndex * 100}%)`};
  transition: ${({ hasAnimation, isTransitioning, isSwiping }) => {
    if (!hasAnimation || isSwiping) return TRANSITIONS.none;
    if (isTransitioning) return TRANSITIONS.slide;
    return TRANSITIONS.none;
  }};
`;
