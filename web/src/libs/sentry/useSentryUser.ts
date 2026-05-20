// eslint-disable-next-line import/named
import { setUser } from '@sentry/react';
import { useEffect } from 'react';
import type { UserProfile } from '@/types/me';

export const useSentryUser = (userProfile?: UserProfile) => {
  const userId = userProfile?.id ?? null;

  useEffect(() => {
    if (userId) {
      setUser({ id: userId });
      return;
    }

    setUser(null);
  }, [userId]);
};
