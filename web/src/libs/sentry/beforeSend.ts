import { ApiError } from '@bombom/shared/apis';
import { type ErrorEvent, type EventHint } from '@sentry/react';

type ErrorTag = 'API_ERROR' | 'RENDER_CRASH' | 'JS_RUNTIME';

const RENDER_CRASH_MECHANISM = 'auto.function.react.error_boundary';

const isRenderCrash = (event: ErrorEvent): boolean => {
  return (
    event.exception?.values?.some(
      (exception) => exception.mechanism?.type === RENDER_CRASH_MECHANISM,
    ) ?? false
  );
};

const classifyError = (event: ErrorEvent, hint: EventHint): ErrorTag => {
  if (hint.originalException instanceof ApiError) {
    return 'API_ERROR';
  }

  if (isRenderCrash(event)) {
    return 'RENDER_CRASH';
  }

  return 'JS_RUNTIME';
};

const applyErrorTag = (event: ErrorEvent, errorTag: ErrorTag): ErrorEvent => ({
  ...event,
  tags: { ...event.tags, error_type: errorTag },
});

export const beforeSend = (
  event: ErrorEvent,
  hint: EventHint,
): ErrorEvent | null => {
  const classification = classifyError(event, hint);

  if (classification === 'API_ERROR') {
    return applyErrorTag(
      {
        ...event,
        tags: {
          ...event.tags,
          http_status: (hint.originalException as ApiError).status,
        },
      },
      'API_ERROR',
    );
  }

  return applyErrorTag(event, classification);
};
