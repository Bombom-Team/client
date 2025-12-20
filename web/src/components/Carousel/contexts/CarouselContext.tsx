import { createContext, useContext } from 'react';
import type { RefObject } from 'react';

export interface CarouselContextValue {
  // state
  slideIndex: number;
  slideCount: number;
  goPrev: () => void;
  goNext: () => void;
  syncLoopSlideIndex: () => void;
  registerSlideCount: (count: number) => void;
  canGoPrev: boolean;
  canGoNext: boolean;

  // refs
  slideWrapperRef: RefObject<HTMLUListElement | null>;

  // transition/swipe
  isTransitioning: boolean;
  startTransition: () => void;
  stopTransition: () => void;
  isSwiping: boolean;
  startSwipe: (x: number, y: number) => void;
  moveSwipe: (x: number, y: number) => void;
  endSwipe: () => void;

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
