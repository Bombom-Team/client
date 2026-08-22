import { useEffect } from 'react';
import type { RefObject } from 'react';

interface UseIntersectionTriggerParams<T extends Element> {
  targetRef: RefObject<T | null>;
  enabled: boolean;
  onIntersect: () => void;
}

export const useIntersectionTrigger = <T extends Element>({
  targetRef,
  enabled,
  onIntersect,
}: UseIntersectionTriggerParams<T>) => {
  useEffect(() => {
    const target = targetRef.current;
    if (!target || !enabled) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        onIntersect();
      }
    });

    observer.observe(target);

    return () => observer.disconnect();
  }, [enabled, onIntersect, targetRef]);
};
