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
  const inFlightRef = useRef<Promise<void> | null>(null);
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
      // 동시에 들어온 동기화는 진행 중인 요청 하나로 합친다.
      // 강제 동기화는 진행 중인 요청이 토큰 재등록 전에 보낸 값일 수 있어 끝난 뒤 다시 보낸다.
      const inFlight = inFlightRef.current;
      if (inFlight) {
        await inFlight;
        if (!isForced) return;
      }

      const request = sendOsNotificationPermission(isForced);
      inFlightRef.current = request;
      try {
        await request;
      } finally {
        if (inFlightRef.current === request) inFlightRef.current = null;
      }
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
