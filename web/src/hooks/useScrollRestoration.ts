import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useDebounce } from './useDebounce';
import { READ_THRESHOLD } from '@/constants/article';
import { createStorage } from '@/utils/localStorage';
import { getScrollPercent } from '@/utils/scroll';

const DEFAULT_SCROLL_LOCATION = 0;

type StorageKey = `scroll-${string}`;

interface UseScrollRestorationParams {
  pathname: string;
  enabled: boolean;
  threshold?: number;
}

const useScrollRestoration = ({
  pathname,
  enabled,
  threshold = READ_THRESHOLD,
}: UseScrollRestorationParams) => {
  const storageKey: StorageKey = `scroll-${pathname}`;
  const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollStorage = createStorage<number>(
    storageKey,
    DEFAULT_SCROLL_LOCATION,
  );

  const restoreScroll = useCallback((scrollLocation: number) => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
    }

    window.scroll({
      top: scrollLocation,
      behavior: 'instant',
    });
  }, []);

  const handleScroll = useDebounce(() => {
    const scrollPercent = getScrollPercent();
    if (scrollPercent >= threshold) {
      scrollStorage.remove();
      return;
    }

    scrollStorage.set(window.scrollY);
  }, 100);

  // 모바일 화면 전환과 겹치지 않도록 화면이 보이기 전에 읽던 위치로 바로 옮긴다.
  // 라우터가 같은 커밋에서 새 화면의 스크롤을 맨 위로 되돌리므로 다음 프레임에서 복원한다.
  useLayoutEffect(() => {
    const scrollLocation = scrollStorage.get();
    if (!scrollLocation || !enabled) return;

    const frameId = requestAnimationFrame(() => restoreScroll(scrollLocation));

    return () => cancelAnimationFrame(frameId);
    // store 생성될 때마다 다시 복구하는 이슈
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restoreScroll, enabled]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
};

export default useScrollRestoration;
