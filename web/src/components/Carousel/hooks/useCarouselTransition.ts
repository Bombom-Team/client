import { useCallback, useState } from 'react';

const useCarouselTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = useCallback(() => {
    setIsTransitioning(true);
  }, []);

  const stopTransition = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  return {
    isTransitioning,
    startTransition,
    stopTransition,
    setIsTransitioning,
  };
};

export default useCarouselTransition;
