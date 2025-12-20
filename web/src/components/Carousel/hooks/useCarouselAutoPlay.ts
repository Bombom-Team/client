import { useEffect } from 'react';

interface UseCarouselAutoPlayParams {
  enabled: boolean;
  delay: number;
  slideIndex: number;
  onNext: () => void;
}

const useCarouselAutoPlay = ({
  enabled,
  delay,
  slideIndex,
  onNext,
}: UseCarouselAutoPlayParams) => {
  useEffect(() => {
    if (!enabled) return;

    const id = setTimeout(onNext, delay);

    return () => clearTimeout(id);
  }, [enabled, slideIndex, onNext, delay]);
};

export default useCarouselAutoPlay;
