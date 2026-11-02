import { useEffect, useState } from 'react';
import { isChunkLoadError } from '@/libs/sentry/errorFilters';
import { captureChunkLoadError } from '@/libs/sentry/sentryUtils';
import { createSessionStorage } from '@/utils/sessionStorage';

const AUTO_RELOAD_COOLDOWN_MS = 5 * 60 * 1000;

const lastAutoReloadAtStorage = createSessionStorage<number | null>(
  'chunk-load-error-reloaded-at',
  null,
);

const canAutoReload = () => {
  if (!navigator.onLine) return false;

  const lastAutoReloadAt = lastAutoReloadAtStorage.get();
  return (
    lastAutoReloadAt === null ||
    Date.now() - lastAutoReloadAt > AUTO_RELOAD_COOLDOWN_MS
  );
};

export const useChunkLoadErrorReload = (error: unknown) => {
  const [isReloading, setIsReloading] = useState(
    () => isChunkLoadError(error) && canAutoReload(),
  );

  useEffect(() => {
    if (!isChunkLoadError(error)) return;

    if (isReloading) {
      if (lastAutoReloadAtStorage.set(Date.now())) {
        captureChunkLoadError({ error, isAutoReload: true });
        window.location.reload();
      } else {
        setIsReloading(false);
      }
      return;
    }

    captureChunkLoadError({ error, isAutoReload: false });
  }, [error, isReloading]);

  return isReloading;
};
