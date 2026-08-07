import { useCallback, useEffect, useState } from 'react';

const useScrollProgress = () => {
  const [progressPercentage, setProgressPercentage] = useState(0);

  const calculateProgress = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    const maxScroll = scrollHeight - clientHeight;

    if (maxScroll <= 0) {
      setProgressPercentage(0);
      return;
    }

    const progress = (scrollTop / maxScroll) * 100;
    setProgressPercentage(Math.min(100, Math.max(0, progress)));
  }, []);

  useEffect(() => {
    let animationFrameId: number | null = null;

    const scheduleCalculation = () => {
      if (animationFrameId !== null) return;

      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = null;
        calculateProgress();
      });
    };

    const resizeObserver = new ResizeObserver(scheduleCalculation);
    resizeObserver.observe(document.body);

    scheduleCalculation();
    window.addEventListener('scroll', scheduleCalculation, { passive: true });
    window.addEventListener('resize', scheduleCalculation);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', scheduleCalculation);
      window.removeEventListener('resize', scheduleCalculation);
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [calculateProgress]);

  return {
    progressPercentage,
  };
};

export default useScrollProgress;
