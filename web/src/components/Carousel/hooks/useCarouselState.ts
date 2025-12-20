import { useCallback, useState } from 'react';
import {
  LOOP_START_SLIDE_INDEX,
  NON_LOOP_START_SLIDE_INDEX,
} from '../Carousel.constants';

interface UseCarouselStateParams {
  loop: boolean;
}

const useCarouselState = ({ loop }: UseCarouselStateParams) => {
  const [slideIndex, setSlideIndex] = useState(
    loop ? LOOP_START_SLIDE_INDEX : NON_LOOP_START_SLIDE_INDEX,
  );
  const [slideCount, setSlideCount] = useState(0);

  const canGoPrev = loop || slideIndex > NON_LOOP_START_SLIDE_INDEX;
  const canGoNext = loop || slideIndex < slideCount - 1;

  const registerSlideCount = useCallback((count: number) => {
    setSlideCount(count);
  }, []);

  const goPrev = useCallback(() => {
    setSlideIndex((prev) => prev - 1);
  }, []);

  const goNext = useCallback(() => {
    setSlideIndex((prev) => prev + 1);
  }, []);

  const syncLoopSlideIndex = useCallback(() => {
    if (!loop) return;

    if (slideIndex < LOOP_START_SLIDE_INDEX) {
      setSlideIndex(slideCount);
    }

    if (slideIndex > slideCount) {
      setSlideIndex(LOOP_START_SLIDE_INDEX);
    }
  }, [loop, slideIndex, slideCount]);

  return {
    slideIndex,
    goPrev,
    goNext,
    syncLoopSlideIndex,
    slideCount,
    canGoPrev,
    canGoNext,
    registerSlideCount,
  };
};

export default useCarouselState;
