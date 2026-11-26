import {
  addWebViewMessageListener,
  isIOS,
  isWebView,
} from '@bombom/shared/ui-web';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { usePostNotificationOpenMutation } from '@/hooks/usePostNotificationOpenMutation';
import type { PostNotificationOpenParams } from '@/apis/notification/notification.api';
import type { RNToWebMessage } from '@bombom/shared';

type NotificationRoutingPayload = Extract<
  RNToWebMessage,
  { type: 'NOTIFICATION_ROUTING' }
>['payload'];

// 식별자를 보내지 않는 구버전 앱의 알림은 이동할 url로 카테고리만 추론한다.
const NOTIFICATION_CATEGORY_BY_URL_PREFIX = [
  { prefix: '/articles/', category: 'ARTICLE' },
  { prefix: '/event', category: 'EVENT' },
  { prefix: '/support/inquiry/', category: 'INQUIRY_MESSAGE_ARRIVAL' },
];

// 앱 WebView의 user agent는 `bombom/{version} {brand} {os}` 형식이다.
const APP_VERSION_PATTERN = /bombom\/(\S+)/;

const getCategoryFromUrl = (url: string) =>
  NOTIFICATION_CATEGORY_BY_URL_PREFIX.find(({ prefix }) =>
    url.startsWith(prefix),
  )?.category ?? null;

const createNotificationOpenParams = (
  payload: NotificationRoutingPayload,
): PostNotificationOpenParams => ({
  category: payload.category ?? getCategoryFromUrl(payload.url),
  notificationId: payload.notificationId ?? null,
  scheduleId: payload.scheduleId ?? null,
  memberId: payload.memberId ?? null,
  deviceUuid: payload.deviceUuid ?? null,
  platform: payload.platform ?? (isIOS() ? 'IOS' : 'ANDROID'),
  appVersion:
    payload.appVersion ??
    navigator.userAgent.match(APP_VERSION_PATTERN)?.[1] ??
    null,
});

export const useWebViewRouting = () => {
  const navigate = useNavigate();
  const { mutate: postNotificationOpen } = usePostNotificationOpenMutation();

  useEffect(() => {
    if (!isWebView()) return;

    const cleanup = addWebViewMessageListener((message: RNToWebMessage) => {
      if (message.type === 'NOTIFICATION_ROUTING') {
        postNotificationOpen(createNotificationOpenParams(message.payload));
        navigate({
          to: message.payload.url,
        });
        return;
      }
    });

    return cleanup;
  }, [navigate, postNotificationOpen]);
};
