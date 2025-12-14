import { useEffect } from 'react';
import { DEFAULT_SPEED } from './Carousel.constants';
import type { AutoPlayOption } from './Carousel.types';

const useCarouselAutoPlay = ({
  enabled,
  isSwiping,
  isTransitioning,
  onNext,
}: {
  enabled: false | AutoPlayOption;
  isSwiping: boolean;
  isTransitioning: boolean;
  onNext: () => void;
}) => {
  useEffect(() => {
    if (!enabled || isSwiping || isTransitioning) return;

    const delay = typeof enabled === 'object' ? enabled.delay : DEFAULT_SPEED;

    const id = setTimeout(onNext, delay);
    return () => clearTimeout(id);
  }, [enabled, isSwiping, isTransitioning, onNext]);
};

export default useCarouselAutoPlay;
