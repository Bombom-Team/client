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
  const [isReloading] = useState(
    () => isChunkLoadError(error) && canAutoReload(),
  );

  useEffect(() => {
    if (!isChunkLoadError(error)) return;

    captureChunkLoadError({ error, isAutoReload: isReloading });

    if (!isReloading) return;

    lastAutoReloadAtStorage.set(Date.now());
    window.location.reload();
  }, [error, isReloading]);

  return isReloading;
};
