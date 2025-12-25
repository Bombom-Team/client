import { useCallback, useRef, useState } from 'react';
import {
  SWIPE_ANGLE_THRESHOLD,
  SWIPE_OFFSET_THRESHOLD,
  SWIPE_RESISTANCE_FACTOR,
} from '../Carousel.constants';
import { calculateAngle } from '@/utils/math';
import type { RefObject } from 'react';

interface UseCarouselSwipeParams {
  enabled: boolean;
  slideIndex: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  slideWrapperRef: RefObject<HTMLUListElement | null>;
  onSwipe: (direction: -1 | 1) => void;
}

const useCarouselSwipe = ({
  enabled,
  slideIndex,
  canGoPrev,
  canGoNext,
  slideWrapperRef,
  onSwipe,
}: UseCarouselSwipeParams) => {
  const [isSwiping, setIsSwiping] = useState(false);
  const swipeStartRef = useRef({ x: 0, y: 0 });
  const swipeOffsetRef = useRef(0);

  const startSwipe = useCallback(
    (x: number, y: number) => {
      if (!enabled) return;

      setIsSwiping(true);
      swipeStartRef.current = { x, y };
      swipeOffsetRef.current = 0;
    },
    [enabled],
  );

  const moveSwipe = useCallback(
    (x: number, y: number) => {
      if (!isSwiping || !slideWrapperRef.current) return;

      const angle = Math.abs(
        calculateAngle(swipeStartRef.current.x, swipeStartRef.current.y, x, y),
      );

      if (
        angle > SWIPE_ANGLE_THRESHOLD &&
        angle < 180 - SWIPE_ANGLE_THRESHOLD
      ) {
        setIsSwiping(false);
        return;
      }

      const offset = x - swipeStartRef.current.x;

      const canSwipe = (offset > 0 && canGoPrev) || (offset < 0 && canGoNext);

      swipeOffsetRef.current = canSwipe
        ? offset
        : offset * SWIPE_RESISTANCE_FACTOR;

      slideWrapperRef.current.style.transform = `translateX(calc(-${slideIndex * 100}% + ${swipeOffsetRef.current}px))`;
    },
    [isSwiping, slideWrapperRef, canGoPrev, canGoNext, slideIndex],
  );

  const endSwipe = useCallback(() => {
    if (!isSwiping) return;
    setIsSwiping(false);

    const swipeDirection = swipeOffsetRef.current > 0 ? -1 : 1;
    const canSwipe =
      (swipeDirection === 1 && canGoNext) ||
      (swipeDirection === -1 && canGoPrev);

    if (
      Math.abs(swipeOffsetRef.current) >= SWIPE_OFFSET_THRESHOLD &&
      canSwipe
    ) {
      onSwipe(swipeDirection);
    }

    swipeOffsetRef.current = 0;
    slideWrapperRef.current?.style.removeProperty('transform');
  }, [isSwiping, canGoNext, canGoPrev, onSwipe, slideWrapperRef]);

  return {
    isSwiping,
    startSwipe,
    moveSwipe,
    endSwipe,
  };
};

export default useCarouselSwipe;
