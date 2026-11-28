import { useEffect, useState } from 'react';

interface UseStepRevealParams {
  target: number;
  firstDelayMs: number;
  stepMs: number;
  shouldReduceMotion: boolean;
}

// 0부터 target까지 한 단계씩 올라가는 숫자(두구두구 숫자, 성장 레벨)
export const useStepReveal = ({
  target,
  firstDelayMs,
  stepMs,
  shouldReduceMotion,
}: UseStepRevealParams) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timerIds = Array.from({ length: target }, (_, index) => {
      const step = index + 1;
      return setTimeout(
        () => setValue(step),
        shouldReduceMotion ? 0 : firstDelayMs + step * stepMs,
      );
    });
    return () => timerIds.forEach(clearTimeout);
  }, [firstDelayMs, shouldReduceMotion, stepMs, target]);

  return value;
};
