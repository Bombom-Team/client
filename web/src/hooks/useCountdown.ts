import { useCallback, useEffect, useRef, useState } from 'react';
import { convertMillisecondsToTime } from '@/utils/time';

interface UseCountdownParams {
  targetTime: string | Date;
  initialTime?: string | Date;
  onComplete?: () => void;
  interval?: number;
}

interface Time {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

export const useCountdown = ({
  targetTime,
  initialTime,
  onComplete,
  interval = 1000,
}: UseCountdownParams) => {
  const [leftTime, setLeftTime] = useState<Time>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
  });
  const [isComplete, setIsComplete] = useState(false);
  const targetTimeMs = useRef(new Date(targetTime).getTime());
  const getCurrentTime = useRef<(() => number) | null>(null);

  const createCurrentTimeTracker = useCallback((currentTimeMs: number) => {
    const startPerformanceTime = performance.now();
    return () => currentTimeMs + (performance.now() - startPerformanceTime);
  }, []);

  useEffect(() => {
    if (initialTime) {
      const initialTimeMs = new Date(initialTime).getTime();
      getCurrentTime.current = createCurrentTimeTracker(initialTimeMs);
    } else {
      getCurrentTime.current = () => Date.now();
    }

    targetTimeMs.current = new Date(targetTime).getTime();
  }, [createCurrentTimeTracker, initialTime, targetTime]);

  const updateTimeLeft = useCallback(() => {
    if (!getCurrentTime.current) return;

    const currentTime = getCurrentTime.current();
    const timeDiff = Math.max(0, targetTimeMs.current - currentTime);

    const remainTime = convertMillisecondsToTime(timeDiff);
    setLeftTime(remainTime);

    if (remainTime.totalSeconds <= 0 && !isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [onComplete, isComplete]);

  useEffect(() => {
    if (isComplete) return;

    updateTimeLeft();

    const timerId = setInterval(updateTimeLeft, interval);

    return () => {
      clearInterval(timerId);
    };
  }, [interval, updateTimeLeft, isComplete]);

  useEffect(() => {
    setIsComplete(false);
  }, [targetTime, initialTime]);

  return { leftTime, isComplete };
};
