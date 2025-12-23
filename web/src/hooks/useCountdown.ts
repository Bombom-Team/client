import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { convertMillisecondsToTime } from '@/utils/time';

interface UseCountdownParams {
  targetTime: string | Date;
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
  onComplete,
  completeDelay,
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
  const onCompleteRef = useRef(onComplete);
  const delayTimerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const targetTimeMs = useMemo(
    () => new Date(targetTime).getTime(),
    [targetTime],
  );

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const updateLeftTime = useCallback(() => {
    const currentTime = Date.now();
    const timeDiff = Math.max(0, targetTimeMs - currentTime);
    const remainTime = convertMillisecondsToTime(timeDiff);

    setLeftTime(remainTime);
  }, [targetTimeMs]);

  useEffect(() => {
    if (leftTime.totalSeconds > 0) return;

    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    if (completeDelay) {
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
