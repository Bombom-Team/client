import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { putOsNotificationPermission } from '@/apis/notification';
import { getDeviceUUID } from '@/utils/device';
import { checkNotificationPermission, getMemberId } from '@/utils/notification';

// 서버의 마이페이지 알림 설정과 별개로, 기기 OS 설정의 알림 권한을 서버에 알려 알림 지표의 도달 모수를 보정한다.
export const useOsNotificationPermissionSync = () => {
  const lastSyncedRef = useRef<string | null>(null);
  const appStateRef = useRef(AppState.currentState);

  const syncOsNotificationPermission = useCallback(async () => {
    try {
      const memberId = await getMemberId();
      if (!memberId) return;

      const deviceUuid = await getDeviceUUID();
      if (!deviceUuid) return;

      const granted = await checkNotificationPermission();
      const syncKey = `${memberId}:${deviceUuid}:${granted}`;
      if (lastSyncedRef.current === syncKey) return;

      await putOsNotificationPermission({ memberId, deviceUuid, granted });
      lastSyncedRef.current = syncKey;
    } catch (error) {
      console.error('OS 알림 권한 동기화에 실패했습니다.', error);
    }
  }, []);

  useEffect(() => {
    syncOsNotificationPermission();

    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        const previousAppState = appStateRef.current;
        appStateRef.current = nextAppState;

        if (
          previousAppState.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          syncOsNotificationPermission();
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [syncOsNotificationPermission]);

  return { syncOsNotificationPermission };
};
