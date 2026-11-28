import { fetcher } from '@bombom/shared/apis';

// TODO(BOM-1326): 어드민 서버 배포 후 OpenAPI 타입으로 교체
// 어드민 서버가 관리자 세션을 확인한 뒤 fcm-server 알림 지표 집계를 그대로 전달한다.
export type NotificationCategory =
  | 'ARTICLE'
  | 'EVENT'
  | 'CHALLENGE_TODO_REMINDER'
  | 'CHALLENGE_START'
  | 'INQUIRY_MESSAGE_ARRIVAL';

export type NotificationStatus =
  | 'PENDING'
  | 'SENT'
  | 'FAILED'
  | 'DEAD'
  | 'SKIPPED';

export type NotificationPlatform = 'IOS' | 'ANDROID';

export interface NotificationCategoryStats {
  category: NotificationCategory;
  deliveryMode: 'MEMBER' | 'TOPIC';
  statusCounts: Record<NotificationStatus, number> | null;
  failureReasons: { reason: string; count: number }[];
  deviceSends: { success: number; failure: number } | null;
  // uniqueLinked: 기간 안에 열린 고유 알림 수(열린 시각 기준)
  opens: { linked: number; uniqueLinked: number; unlinked: number };
  // 기간에 보낸 알림 중 한 번이라도 열린 수(발송일 기준, 열린 시점 무관). openRate의 분자다.
  openedOfSent: number;
  openRate: number | null;
  medianSecondsToOpen: number | null;
  consentingMembers: number | null;
  // 토픽 발송만: 기간에 발송한 스케줄들의 발송 시점 수신 동의 회원 수 합. openRate의 분모다.
  estimatedRecipients: number | null;
}

// 발송일 코호트: opened는 그날 보낸 알림 중 열린 수.
// 토픽 발송(EVENT)은 sent가 null이고, 대신 그날 발송 시점 수신 동의 회원 수(estimatedRecipients)가 온다.
export interface NotificationDailyStats {
  date: string;
  category: NotificationCategory;
  sent: number | null;
  opened: number;
  estimatedRecipients: number | null;
}

export interface GetNotificationStatsParams {
  from: string;
  to: string;
}

export interface GetNotificationStatsResponse {
  aggregatedAt: string;
  from: string;
  to: string;
  categories: NotificationCategoryStats[];
  reach: {
    membersWithToken: number;
    devicesWithToken: number;
    devicesOsPermissionGranted: number;
    devicesOsPermissionDenied: number;
    devicesOsPermissionUnknown: number;
  };
  opensByPlatform: { platform: NotificationPlatform; count: number }[];
  // 일별 집계 이전 버전 서버는 이 필드를 보내지 않는다.
  daily?: NotificationDailyStats[];
}

export const getNotificationStats = async ({
  from,
  to,
}: GetNotificationStatsParams) => {
  return fetcher.get<GetNotificationStatsResponse>({
    path: '/notifications/stats',
    query: { from, to },
  });
};
