import { trackGAEvent } from './gaEvents';
import { createSessionStorage } from '@/utils/sessionStorage';

const pendingSignUpStorage = createSessionStorage<boolean>(
  'ga_pending_sign_up',
  false,
);

interface RetentionEventParamsMap {
  sign_up: { method: 'oauth' };
  article_read_completed: { newsletter_category?: string };
  challenge_application_completed: { challenge_id: string };
  challenge_activity_started: { challenge_id: string };
  challenge_attendance_completed: { challenge_id: string };
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
  pendingSignUpStorage.set(true);
};

export const trackPendingSignUp = () => {
  if (!pendingSignUpStorage.get()) {
    return;
  }

  trackRetentionEvent('sign_up', { method: 'oauth' });
  pendingSignUpStorage.remove();
};
