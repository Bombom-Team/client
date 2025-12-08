import styled from '@emotion/styled';
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  type ComponentProps,
  type PropsWithChildren,
  type ReactElement,
} from 'react';
import { TRANSITIONS } from './Carousel.constants';
import { useCarouselContext } from './CarouselContext';
import CarouselSlide from './CarouselSlide';
import useCarouselAccessibility from './useCarouselAccessibility';

interface CarouselSlidesProps {
  showNextSlidePart?: boolean;
}

const CarouselSlides = ({
  showNextSlidePart = false,
  children,
}: PropsWithChildren<CarouselSlidesProps>) => {
  const list = useMemo(() => Children.toArray(children), [children]);

  const {
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
    hasAnimation,
    loop,
  } = useCarouselContext();

  const hasMultipleSlides = slideCount > 1;

  const { handleFocus, handleBlur } = useCarouselAccessibility();

  const slidesToRender = loop
    ? [list[list.length - 1], ...list, list[0]]
    : [...list];

  useEffect(() => {
    registerSlideCount(list.length);
  }, [list, registerSlideCount]);

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
      aria-label={`총 ${slideCount}개 중 ${loop ? slideIndex : slideIndex + 1}번째 슬라이드`}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...(hasMultipleSlides && {
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
      })}
    >
      {slidesToRender.map((child, index) => {
        const isCurrent = index === slideIndex;

        if (isValidElement(child) && child.type === CarouselSlide) {
          return cloneElement(
            child as ReactElement<ComponentProps<typeof CarouselSlide>>,
            { isCurrent, key: index },
          );
        }

        return (
          <CarouselSlide isCurrent={isCurrent} key={index}>
            {child}
          </CarouselSlide>
        );
      })}
    </Container>
  );
};

export default CarouselSlides;

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
