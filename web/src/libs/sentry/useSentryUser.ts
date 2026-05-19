/* eslint-disable import/named */ // @sentry/react re-exports via `export * from '@sentry/browser'` — pnpm virtual store 구조로 eslint-plugin-import가 체인을 정적 분석 불가
import { setUser } from '@sentry/react';
/* eslint-enable import/named */
import { useEffect } from 'react';
import type { UserProfile } from '@/types/me';

export function useSentryUser(userProfile: UserProfile | undefined) {
  useEffect(() => {
    if (userProfile) {
      setUser({ id: String(userProfile.id) });
    } else {
      setUser(null);
    }
  }, [userProfile]);
}
