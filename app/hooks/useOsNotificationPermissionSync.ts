import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { putOsNotificationPermission } from '@/apis/notification';
import { getDeviceUUID } from '@/utils/device';
import { checkNotificationPermission, getMemberId } from '@/utils/notification';

interface SyncOsNotificationPermissionParams {
  // 토큰을 다시 등록하면 서버의 기기 행이 새로 만들어지므로, 같은 값이어도 다시 보내 권한 값을 맞춘다.
  isForced?: boolean;
}

// 서버의 마이페이지 알림 설정과 별개로, 기기 OS 설정의 알림 권한을 서버에 알려 알림 지표의 도달 모수를 보정한다.
export const useOsNotificationPermissionSync = () => {
  const lastSyncedRef = useRef<string | null>(null);
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const appStateRef = useRef(AppState.currentState);

  const sendOsNotificationPermission = useCallback(async (isForced: boolean) => {
    try {
      const memberId = await getMemberId();
      if (!memberId) return;

      const deviceUuid = await getDeviceUUID();
      if (!deviceUuid) return;

      const granted = await checkNotificationPermission();
      const syncKey = `${memberId}:${deviceUuid}:${granted}`;
      if (!isForced && lastSyncedRef.current === syncKey) return;

      await putOsNotificationPermission({ memberId, deviceUuid, granted });
      lastSyncedRef.current = syncKey;
    } catch (error) {
      console.error('OS 알림 권한 동기화에 실패했습니다.', error);
    }
  }, []);

  const syncOsNotificationPermission = useCallback(
    async ({ isForced = false }: SyncOsNotificationPermissionParams = {}) => {
      // 요청을 하나씩 차례로 보낸다. 각 요청이 보낼 때의 권한을 다시 읽으므로 대기 중 바뀐 권한도 반영되고,
      // 이전 값의 요청이 나중에 끝나 서버 값을 덮어쓰는 일이 없다. 같은 값은 lastSyncedRef로 건너뛴다.
      const request = queueRef.current.then(() =>
        sendOsNotificationPermission(isForced),
      );
      queueRef.current = request;
      await request;
    },
    [sendOsNotificationPermission],
  );

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
