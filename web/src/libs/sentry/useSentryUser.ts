import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import type { UserProfile } from '@/types/me';

export const useSentryUser = (userProfile: UserProfile | undefined) => {
  useEffect(() => {
    if (userProfile) {
      Sentry.setUser({ id: String(userProfile.id) });
    } else {
      Sentry.setUser(null);
    }
  }, [userProfile]);
};
