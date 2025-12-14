import { useCallback, useState } from 'react';
import {
  LOOP_START_SLIDE_INDEX,
  NON_LOOP_START_SLIDE_INDEX,
} from './Carousel.constants';

const useCarouselState = ({ loop }: { loop: boolean }) => {
  const [slideIndex, setSlideIndex] = useState(
    loop ? LOOP_START_SLIDE_INDEX : NON_LOOP_START_SLIDE_INDEX,
  );
  const [slideCount, setSlideCount] = useState(0);

  const registerSlideCount = useCallback((count: number) => {
    setSlideCount(count);
  }, []);

  const prev = useCallback(() => {
    setSlideIndex((prev) => prev - 1);
  }, []);

  const next = useCallback(() => {
    setSlideIndex((prev) => prev + 1);
  }, []);

  return {
    slideIndex,
    slideCount,
    setSlideIndex,
    registerSlideCount,
    prev,
    next,
  };
};

export default useCarouselState;
