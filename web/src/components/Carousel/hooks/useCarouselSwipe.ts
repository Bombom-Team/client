import { useCallback, useMemo, useRef, useState } from 'react';
import {
  SWIPE_ANGLE_THRESHOLD,
  SWIPE_OFFSET_THRESHOLD,
} from '../Carousel.constants';
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
  const isFirst = useMemo(() => !loop && slideIndex === 0, [loop, slideIndex]);
  const isLast = useMemo(
    () => !loop && slideIndex === slideCount - 1,
    [loop, slideIndex, slideCount],
  );

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

      const isBoundary = (offset > 0 && isFirst) || (offset < 0 && isLast);

      swipeOffsetRef.current = isBoundary ? offset * 0.3 : offset;

      slideWrapperRef.current.style.transform = `translateX(calc(-${slideIndex * 100}% + ${swipeOffsetRef.current}px))`;
    },
    [isSwiping, slideWrapperRef, isFirst, isLast, slideIndex],
  );

  const swipeEnd = useCallback(() => {
    if (!isSwiping) return;
    setIsSwiping(false);

    const swipeDirection = swipeOffsetRef.current > 0 ? -1 : 1;
    const canSwipe =
      loop ||
      (swipeDirection === 1 && !isLast) ||
      (swipeDirection === -1 && !isFirst);

    if (
      Math.abs(swipeOffsetRef.current) >= SWIPE_OFFSET_THRESHOLD &&
      canSwipe
    ) {
      onSwipe(swipeDirection);
    }

    swipeOffsetRef.current = 0;
    slideWrapperRef.current?.style.removeProperty('transform');
  }, [isFirst, isLast, isSwiping, loop, onSwipe, slideWrapperRef]);

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
