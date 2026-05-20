import { ApiError } from '@bombom/shared/apis';
import { type ErrorEvent, type EventHint } from '@sentry/react';

type ErrorClassification =
  | 'API_ERROR'
  | 'RENDER_CRASH'
  | 'JS_RUNTIME'
  | 'NETWORK_NOISE';

type ErrorTag = 'RENDER_CRASH' | 'JS_RUNTIME';

const RENDER_CRASH_MECHANISM = 'auto.function.react.error_boundary';
const NETWORK_ERROR_MESSAGE_PATTERNS = [
  /^Failed to fetch$/i,
  /^Load failed$/i,
  /^NetworkError when attempting to fetch resource\.?$/i,
];

const isErrorWithMessage = (error: unknown): error is { message: string } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  );
};

const isNetworkNoiseMessage = (message: string): boolean => {
  return NETWORK_ERROR_MESSAGE_PATTERNS.some((pattern) =>
    pattern.test(message),
  );
};

const getExceptionMessages = (event: ErrorEvent): string[] => {
  return (
    event.exception?.values
      ?.map((exception) => exception.value)
      .filter((message): message is string => Boolean(message)) ?? []
  );
};

const isNetworkNoise = (event: ErrorEvent, hint: EventHint): boolean => {
  const messages = getExceptionMessages(event);
  const originalException = hint.originalException;

  if (isErrorWithMessage(originalException)) {
    messages.push(originalException.message);
  }

  return messages.some(isNetworkNoiseMessage);
};

const isRenderCrash = (event: ErrorEvent): boolean => {
  return (
    event.exception?.values?.some(
      (exception) => exception.mechanism?.type === RENDER_CRASH_MECHANISM,
    ) ?? false
  );
};

const classifyError = (
  event: ErrorEvent,
  hint: EventHint,
): ErrorClassification => {
  if (isNetworkNoise(event, hint)) {
    return 'NETWORK_NOISE';
  }

  if (hint.originalException instanceof ApiError) {
    return 'API_ERROR';
  }

  if (isRenderCrash(event)) {
    return 'RENDER_CRASH';
  }

  return 'JS_RUNTIME';
};

const applyErrorTag = (event: ErrorEvent, errorTag: ErrorTag): ErrorEvent => {
  event.tags = { ...event.tags, error_type: errorTag };
  return event;
};

export const beforeSend = (
  event: ErrorEvent,
  hint: EventHint,
): ErrorEvent | null => {
  const classification = classifyError(event, hint);

  if (classification === 'NETWORK_NOISE') {
    return null;
  }

  if (
    classification === 'API_ERROR' &&
    hint.originalException instanceof ApiError
  ) {
    event.tags = { ...event.tags, http_status: hint.originalException.status };
    return event;
  }

  return applyErrorTag(
    event,
    classification === 'RENDER_CRASH' ? 'RENDER_CRASH' : 'JS_RUNTIME',
  );
};
