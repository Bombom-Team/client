import styled from '@emotion/styled';
import {
  Children,
  isValidElement,
  useEffect,
  useMemo,
  type PropsWithChildren,
} from 'react';
import { TRANSITIONS } from './Carousel.constants';
import { useCarouselContext } from './CarouselContext';
import CarouselSlide from './CarouselSlide';
import { CarouselSlideIndexContext } from './CarouselSlideIndexContext';
import useCarouselAccessibility from './useCarouselAccessibility';
import { isProduction } from '@/utils/environment';

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

    // 개발 환경에서만 CarouselSlide 체크
    if (!isProduction) {
      list.forEach((child, index) => {
        if (isValidElement(child) && child.type !== CarouselSlide) {
          console.warn(
            `[Carousel.Slides] ${index}번째 child는 CarouselSlide 컴포넌트가 아닙니다. ` +
              `Carousel.Slides의 children은 반드시 Carousel.Slide 컴포넌트만 사용해야 합니다.`,
          );
        }
      });
    }
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
        const childKey =
          isValidElement(child) && child.key !== null ? child.key : 'slide';
        const key = `${childKey}-${index}`;

        return (
          <CarouselSlideIndexContext.Provider value={index} key={key}>
            {child}
          </CarouselSlideIndexContext.Provider>
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
