import { ApiError } from '@bombom/shared/apis';
import { type ErrorEvent, type EventHint } from '@sentry/react';

export const beforeSend = (
  event: ErrorEvent,
  hint: EventHint,
): ErrorEvent | null => {
  const error = hint.originalException;

  // 유저 네트워크 단절 — 조치 불가, 드롭
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return null;
  }

  if (error instanceof ApiError) {
    event.tags = { ...event.tags, http_status: error.status };
  } else {
    event.tags = { ...event.tags, error_type: 'JS_RUNTIME' };
  }

  return event;
};
