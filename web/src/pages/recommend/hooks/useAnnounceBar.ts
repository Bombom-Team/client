import { useCallback } from 'react';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';

const ANNOUNCEBAR_VISIBLE_KEY = 'announcebar-visible';

export function useAnnounceBar(noticeId?: number) {
  const enabled = noticeId !== undefined;

  const [isVisible, setIsVisible] = useLocalStorageState<boolean>(
    enabled ? `${ANNOUNCEBAR_VISIBLE_KEY}:${noticeId}` : '',
    true,
  );

  const hide = useCallback(() => {
    if (!enabled) return;
    setIsVisible(false);
  }, [enabled, setIsVisible]);

  return {
    isVisible: enabled ? isVisible : true,
    hide,
  };
}
