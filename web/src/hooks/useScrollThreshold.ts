import { useEffect, useRef } from 'react';
import { useDebounce } from './useDebounce';
import { READ_THRESHOLD } from '@/constants/article';
import { getScrollPercent } from '@/utils/scroll';
import type { RefObject } from 'react';

interface UseScrollThresholdParams {
  enabled?: boolean;
  threshold?: number;
  throttleMs?: number;
  scrollRef?: RefObject<HTMLElement | null>;
  onTrigger: () => void;
}

export function useScrollThreshold({
  enabled = false,
  threshold = READ_THRESHOLD,
  throttleMs = 500,
  scrollRef,
  onTrigger,
}: UseScrollThresholdParams) {
  const startTimeRef = useRef(Date.now());

  const throttledHandleScroll = useDebounce(() => {
    if (!enabled) return;

    const scrollPercent = getScrollPercent(scrollRef?.current);
    const durationMs = Date.now() - startTimeRef.current;

    if (scrollPercent >= threshold && durationMs >= throttleMs) {
      onTrigger();
    }
  }, 100);

  useEffect(() => {
    if (enabled && getScrollPercent(scrollRef?.current) === 100) {
      onTrigger();
    }
  }, [enabled, onTrigger, scrollRef]);

  useEffect(() => {
    window.addEventListener('scroll', throttledHandleScroll);
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [throttledHandleScroll]);
}
