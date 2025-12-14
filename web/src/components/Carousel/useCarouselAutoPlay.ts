import { useEffect } from 'react';
import type { AutoPlayOption } from './Carousel.types';

const useCarouselAutoPlay = ({
  enabled,
  delay,
  slideIndex,
  onNext,
}: {
  enabled: false | AutoPlayOption;
  delay: number;
  slideIndex: number;
  onNext: () => void;
}) => {
  useEffect(() => {
    if (!enabled) return;

    const id = setTimeout(onNext, delay);

    return () => clearTimeout(id);
  }, [enabled, slideIndex, onNext, delay]);
};

export default useCarouselAutoPlay;
