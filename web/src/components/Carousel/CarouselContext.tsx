import { createContext, useContext } from 'react';
import type { RefObject, TouchEvent } from 'react';

export interface CarouselContextValue {
  // state
  slideIndex: number;
  slideCount: number;
  registerSlideCount: (count: number) => void;

  // refs
  slideWrapperRef: RefObject<HTMLUListElement | null>;

  // transition/swipe
  isTransitioning: boolean;
  isSwiping: boolean;
  handleTransitionEnd: () => void;
  handleTouchStart: (e: TouchEvent) => void;
  handleTouchMove: (e: TouchEvent) => void;
  handleTouchEnd: () => void;

  // navigation
  next: () => void;
  prev: () => void;

  // options
  loop: boolean;
  hasAnimation: boolean;
}

export const CarouselContext = createContext<CarouselContextValue | null>(null);

export function useCarouselContext() {
  const ctx = useContext(CarouselContext);
  if (!ctx) {
    throw new Error(
      'Carousel.* 컴포넌트는 반드시 <Carousel.Root> 내부에서만 사용해야 합니다.',
    );
  }
  return ctx;
}
