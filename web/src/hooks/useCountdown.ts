import { useCallback, useEffect, useRef, useState } from 'react';
import { convertMillisecondsToTime } from '@/utils/time';

interface UseCountdownParams {
  targetTime: string | Date;
  initialTime?: string | Date;
  onComplete?: () => void;
  completeDelay?: number;
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
  completeDelay = 0,
  interval = 1000,
}: UseCountdownParams) => {
  const [leftTime, setLeftTime] = useState<Time>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
  });

  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const targetTimeMs = useRef(new Date(targetTime).getTime());
  const getCurrentTime = useRef<(() => number) | null>(null);
  const isCompleteRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const delayTimerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    if (completeDelay > 0) {
      delayTimerIdRef.current = setTimeout(() => {
        onCompleteRef.current?.();
      }, completeDelay);
    } else {
      onCompleteRef.current?.();
    }
  }, [leftTime.totalSeconds, completeDelay]);

  useEffect(() => {
    updateLeftTime();

    intervalIdRef.current = setInterval(updateLeftTime, interval);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      if (delayTimerIdRef.current) {
        clearTimeout(delayTimerIdRef.current);
        delayTimerIdRef.current = null;
      }
    };
  }, [interval, updateLeftTime, targetTime]);

  return { leftTime };
};
