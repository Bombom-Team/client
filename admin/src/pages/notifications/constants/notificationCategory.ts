import type { NotificationCategory } from '@/apis/notificationStats/notificationStats.api';

export const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  ARTICLE: '아티클 도착',
  EVENT: '이벤트',
  CHALLENGE_START: '챌린지 시작',
  CHALLENGE_TODO_REMINDER: '챌린지 할 일 리마인드',
  INQUIRY_MESSAGE_ARRIVAL: '문의 답변 도착',
};

// 수신 거부 시 알림 row를 지우는 카테고리라 스킵이 기록되지 않는다.
export const SKIP_NOT_RECORDED_CATEGORIES: NotificationCategory[] = [
  'ARTICLE',
  'INQUIRY_MESSAGE_ARRIVAL',
];

// 앱이 이동할 화면이 없어 웹으로 열림 메시지가 가지 않는 카테고리라 열림이 기록되지 않는다.
export const OPEN_NOT_RECORDED_CATEGORIES: NotificationCategory[] = [
  'CHALLENGE_START',
  'CHALLENGE_TODO_REMINDER',
];
