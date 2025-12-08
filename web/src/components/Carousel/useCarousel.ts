import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DEFAULT_SPEED,
  INFINITY_START_SLIDE_INDEX,
  FINITE_START_SLIDE_INDEX,
  SWIPE_OFFSET_THRESHOLD,
  SWIPE_ANGLE_THRESHOLD,
} from './Carousel.constants';
import { calculateAngle } from '@/utils/math';
import type { TouchEvent } from 'react';

interface UseCarouselProps {
  slideCount: number;
  loop: boolean;
  autoPlay: boolean | { delay: number };
}

const useCarousel = ({ slideCount, loop, autoPlay }: UseCarouselProps) => {
  const [slideIndex, setSlideIndex] = useState(
    loop ? INFINITY_START_SLIDE_INDEX : FINITE_START_SLIDE_INDEX,
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const swipeOffsetRef = useRef(0);
  const swipeStartRef = useRef({ x: 0, y: 0 });
  const slideWrapperRef = useRef<HTMLUListElement>(null);

  const updateTransform = useCallback(() => {
    if (!slideWrapperRef.current) return;

    const offset = swipeOffsetRef.current;
    slideWrapperRef.current.style.transform = `translateX(calc(-${slideIndex * 100}% + ${offset}px))`;
  }, [slideIndex]);

  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false);

    if (!loop) return;

    if (slideIndex < INFINITY_START_SLIDE_INDEX) {
      setSlideIndex(slideCount);
    }

    if (slideIndex > slideCount) {
      setSlideIndex(INFINITY_START_SLIDE_INDEX);
    }
  }, [slideIndex, slideCount, loop]);

  useEffect(() => {
    if (!autoPlay || isSwiping) return;

    const autoSlideDelay =
      typeof autoPlay === 'object' ? autoPlay.delay : DEFAULT_SPEED;
    if (!isTransitioning) {
      timerIdRef.current = setTimeout(() => {
        setIsTransitioning(true);
        setSlideIndex((prev) => prev + 1);
      }, autoSlideDelay);
    }

    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    };
  }, [autoPlay, slideIndex, isTransitioning, isSwiping]);

  const prev = useCallback(() => {
    if (isTransitioning || isSwiping) return;
    if (!loop && slideIndex <= 0) return;

    setIsTransitioning(true);
    setSlideIndex((prev) => prev - 1);
  }, [isTransitioning, isSwiping, loop, slideIndex]);

  const next = useCallback(() => {
    if (isTransitioning || isSwiping) return;
    if (!loop && slideIndex >= slideCount - 1) return;

    setIsTransitioning(true);
    setSlideIndex((prev) => prev + 1);
  }, [isTransitioning, isSwiping, loop, slideIndex, slideCount]);

  const swipeStart = useCallback(
    (clientX: number, clientY: number) => {
      if (isTransitioning) return;

      setIsSwiping(true);
      swipeStartRef.current = { x: clientX, y: clientY };
      swipeOffsetRef.current = 0;
    },
    [isTransitioning],
  );
  const swipeMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isSwiping) return;

      const angle = Math.abs(
        calculateAngle(
          swipeStartRef.current.x,
          swipeStartRef.current.y,
          clientX,
          clientY,
        ),
      );

      if (
        angle > SWIPE_ANGLE_THRESHOLD &&
        angle < 180 - SWIPE_ANGLE_THRESHOLD
      ) {
        setIsSwiping(false);
        swipeOffsetRef.current = 0;
        return;
      }

      const offset = clientX - swipeStartRef.current.x;
      const isFirstSlide = slideIndex === FINITE_START_SLIDE_INDEX;
      const isLastSlide = slideIndex === slideCount - 1;

      const isSwipeBoundary =
        !loop && ((offset > 0 && isFirstSlide) || (offset < 0 && isLastSlide));

      swipeOffsetRef.current = isSwipeBoundary ? 0 : offset;
      updateTransform();
    },
    [loop, isSwiping, slideCount, slideIndex, updateTransform],
  );

  const swipeEnd = useCallback(() => {
    if (!isSwiping) return;

    setIsSwiping(false);

    if (Math.abs(swipeOffsetRef.current) >= SWIPE_OFFSET_THRESHOLD) {
      setIsTransitioning(true);
      const swipeIndex = swipeOffsetRef.current > 0 ? -1 : 1;
      setSlideIndex((prev) => prev + swipeIndex);
    }

    swipeOffsetRef.current = 0;
    if (slideWrapperRef.current) {
      slideWrapperRef.current.style.transform = '';
    }
  }, [isSwiping]);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const touchPoint = e.touches[0];
      if (!touchPoint) return;
      swipeStart(touchPoint.clientX, touchPoint.clientY);
    },
    [swipeStart],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const touchPoint = e.touches[0];
      if (!touchPoint) return;
      swipeMove(touchPoint.clientX, touchPoint.clientY);
    },
    [swipeMove],
  );

  const handleTouchEnd = useCallback(() => {
    swipeEnd();
  }, [swipeEnd]);

  return {
    slideIndex,
    prev,
    next,
    slideWrapperRef,
    isTransitioning,
    isSwiping,
    handleTransitionEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};

export default useCarousel;
