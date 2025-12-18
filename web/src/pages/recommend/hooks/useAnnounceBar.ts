import { useCallback, useEffect, useState } from 'react';

const STORAGE_PREFIX = 'announcebar:hidden';

export function useAnnounceBar(noticeId?: number) {
  const [isHidden, setIsHidden] = useState(false);

  const storageKey =
    noticeId !== undefined ? `${STORAGE_PREFIX}:${noticeId}` : null;

  useEffect(() => {
    if (!storageKey) return;

    const stored = localStorage.getItem(storageKey);
    setIsHidden(stored === 'true');
  }, [storageKey]);

  const hide = useCallback(() => {
    if (!storageKey) return;

    localStorage.setItem(storageKey, 'true');
    setIsHidden(true);
  }, [storageKey]);

  return {
    isHidden,
    hide,
  };
}
