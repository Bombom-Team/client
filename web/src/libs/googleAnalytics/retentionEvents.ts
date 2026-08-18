import { trackGAEvent } from './gaEvents';

const PENDING_SIGN_UP_STORAGE_KEY = 'ga_pending_sign_up';

interface RetentionEventParamsMap {
  sign_up: { method: 'oauth' };
  article_read_completed: { newsletter_category?: string };
  challenge_application_completed: { challenge_id: string };
  challenge_activity_started: {
    challenge_id: string;
    day_index?: number;
    todo_type: string;
  };
}

export const trackRetentionEvent = <
  EventName extends keyof RetentionEventParamsMap,
>(
  eventName: EventName,
  params: RetentionEventParamsMap[EventName],
) => {
  trackGAEvent(eventName, params);
};

export const markSignUpPending = () => {
  try {
    window.sessionStorage.setItem(PENDING_SIGN_UP_STORAGE_KEY, 'true');
  } catch {
    // 분석용 저장소 실패가 회원가입 흐름을 중단하지 않도록 한다.
  }
};

export const trackPendingSignUp = () => {
  try {
    if (window.sessionStorage.getItem(PENDING_SIGN_UP_STORAGE_KEY) !== 'true') {
      return;
    }

    trackRetentionEvent('sign_up', { method: 'oauth' });
    window.sessionStorage.removeItem(PENDING_SIGN_UP_STORAGE_KEY);
  } catch {
    // 분석용 저장소 실패가 앱 진입 흐름을 중단하지 않도록 한다.
  }
};
