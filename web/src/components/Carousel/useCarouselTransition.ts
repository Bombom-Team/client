import { useCallback, useState } from 'react';
import { LOOP_START_SLIDE_INDEX } from './Carousel.constants';

const useCarouselTransition = ({
  slideIndex,
  slideCount,
  loop,
  setSlideIndex,
}: {
  slideIndex: number;
  slideCount: number;
  loop: boolean;
  setSlideIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false);

    if (!loop) return;

    if (slideIndex < LOOP_START_SLIDE_INDEX) {
      setSlideIndex(slideCount);
    }

    if (slideIndex > slideCount) {
      setSlideIndex(LOOP_START_SLIDE_INDEX);
    }
  }, [loop, slideIndex, slideCount, setSlideIndex]);

  return {
    isTransitioning,
    setIsTransitioning,
    handleTransitionEnd,
  };
};

export default useCarouselTransition;
