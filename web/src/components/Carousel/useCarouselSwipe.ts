import { useCallback, useRef, useState } from 'react';
import {
  SWIPE_ANGLE_THRESHOLD,
  SWIPE_OFFSET_THRESHOLD,
} from './Carousel.constants';
import { calculateAngle } from '@/utils/math';
import type { RefObject, TouchEvent } from 'react';

const useCarouselSwipe = ({
  enabled,
  slideIndex,
  slideCount,
  loop,
  slideWrapperRef,
  onSwipe,
}: {
  enabled: boolean;
  slideIndex: number;
  slideCount: number;
  loop: boolean;
  slideWrapperRef: RefObject<HTMLUListElement | null>;
  onSwipe: (direction: -1 | 1) => void;
}) => {
  const [isSwiping, setIsSwiping] = useState(false);
  const swipeStartRef = useRef({ x: 0, y: 0 });
  const swipeOffsetRef = useRef(0);

  const swipeStart = useCallback(
    (x: number, y: number) => {
      if (!enabled) return;

      setIsSwiping(true);
      swipeStartRef.current = { x, y };
      swipeOffsetRef.current = 0;
    },
    [enabled],
  );

  const swipeMove = useCallback(
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
      const isFirst = slideIndex === 0;
      const isLast = slideIndex === slideCount - 1;

      const isBoundary =
        !loop && ((offset > 0 && isFirst) || (offset < 0 && isLast));

      swipeOffsetRef.current = isBoundary ? 0 : offset;

      slideWrapperRef.current.style.transform = `translateX(calc(-${slideIndex * 100}% + ${swipeOffsetRef.current}px))`;
    },
    [isSwiping, slideIndex, slideCount, loop, slideWrapperRef],
  );

  const swipeEnd = useCallback(() => {
    if (!isSwiping) return;
    setIsSwiping(false);

    if (Math.abs(swipeOffsetRef.current) >= SWIPE_OFFSET_THRESHOLD) {
      onSwipe(swipeOffsetRef.current > 0 ? -1 : 1);
    }

    swipeOffsetRef.current = 0;
    slideWrapperRef.current?.style.removeProperty('transform');
  }, [isSwiping, onSwipe, slideWrapperRef]);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const touchPoint = e.touches[0];
      if (touchPoint) swipeStart(touchPoint.clientX, touchPoint.clientY);
    },
    [swipeStart],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const touchPoint = e.touches[0];
      if (touchPoint) swipeMove(touchPoint.clientX, touchPoint.clientY);
    },
    [swipeMove],
  );

  return {
    isSwiping,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd: swipeEnd,
  };
};

export default useCarouselSwipe;
