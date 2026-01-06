import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { convertMillisecondsToTime } from '@/utils/time';

interface UseCountdownParams {
  targetTime: string | Date;
  onComplete?: () => void;
  completeDelay?: number;
}

interface Time {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

const INTERVAL_MS = 1000;

export const useCountdown = ({
  targetTime,
  onComplete,
  completeDelay,
}: UseCountdownParams) => {
  const [leftTime, setLeftTime] = useState<Time>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
  });
  const [isCompleting, setIsCompleting] = useState(false);

  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);

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
      setIsCompleting(true);
      const delayTimerId = setTimeout(() => {
        onCompleteRef.current?.();
        setIsCompleting(false);
      }, completeDelay);

      return () => {
        clearTimeout(delayTimerId);
        setIsCompleting(false);
      };
    } else {
      onCompleteRef.current?.();
    }
  }, [leftTime.totalSeconds, completeDelay]);

  useEffect(() => {
    updateLeftTime();

    intervalIdRef.current = setInterval(updateLeftTime, INTERVAL_MS);

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [updateLeftTime, targetTimeMs]);

  return { leftTime, isCompleting };
};
