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

  const timerIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const targetTimeMs = useRef(new Date(targetTime).getTime());
  const getCurrentTime = useRef<(() => number) | null>(null);
  const isCompleteRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

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
    isCompleteRef.current = false;
  }, [createCurrentTimeTracker, initialTime, targetTime]);

  const updateLeftTime = useCallback(() => {
    if (!getCurrentTime.current) return;

    const currentTime = getCurrentTime.current();
    const timeDiff = Math.max(0, targetTimeMs.current - currentTime);
    const remainTime = convertMillisecondsToTime(timeDiff);

    setLeftTime(remainTime);
  }, []);

  useEffect(() => {
    if (leftTime.totalSeconds > 0 || isCompleteRef.current) return;

    isCompleteRef.current = true;

    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }

    onCompleteRef.current?.();
  }, [leftTime.totalSeconds]);

  useEffect(() => {
    updateLeftTime();

    timerIdRef.current = setInterval(updateLeftTime, interval);

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
    };
  }, [interval, updateLeftTime, targetTime]);

  return { leftTime };
};
