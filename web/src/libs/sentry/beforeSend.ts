import { ApiError } from '@bombom/shared/apis';
import {
  type Breadcrumb,
  type BreadcrumbHint,
  type ErrorEvent,
  type EventHint,
  type SeverityLevel,
} from '@sentry/react';

const RENDER_CRASH_MECHANISM = 'auto.function.react.error_boundary';

export const NETWORK_NOISE_ERROR_PATTERNS = [
  /^(?:TypeError:\s*)?Failed to fetch(?: \([^)]+\))?$/i,
  /^(?:TypeError:\s*)?Load failed(?: \([^)]+\))?$/i,
  /^(?:TypeError:\s*)?NetworkError when attempting to fetch resource\.?(?: \([^)]+\))?$/i,
];

interface Classification {
  tags: Record<string, string | number>;
  level: SeverityLevel;
}

const isRenderCrash = (event: ErrorEvent) => {
  return (
    event.exception?.values?.some(
      (exception) => exception.mechanism?.type === RENDER_CRASH_MECHANISM,
    ) ?? false
  );
};

const isP1Status = (status: number) => status >= 500 || status === 401;

const isNotFound = (event: ErrorEvent) =>
  event.tags?.error_type === 'NOT_FOUND';

export const isNetworkNoiseError = (error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : null;

  return (
    message !== null &&
    NETWORK_NOISE_ERROR_PATTERNS.some((pattern) => pattern.test(message))
  );
};

export const beforeBreadcrumb = (
  breadcrumb: Breadcrumb,
  hint?: BreadcrumbHint,
): Breadcrumb | null => {
  const containsApiError =
    breadcrumb.category === 'console' &&
    Array.isArray(hint?.input) &&
    hint.input.some((value) => value instanceof ApiError);

  return containsApiError ? null : breadcrumb;
};

const classifyError = (event: ErrorEvent, hint: EventHint): Classification => {
  if (isNotFound(event)) {
    return {
      tags: { error_type: 'NOT_FOUND', priority: 'P2' },
      level: 'warning',
    };
  }

  if (hint.originalException instanceof ApiError) {
    const { status } = hint.originalException;
    const isP1 = isP1Status(status);
    return {
      tags: {
        error_type: 'API_ERROR',
        http_status: status,
        priority: isP1 ? 'P1' : 'P2',
      },
      level: isP1 ? 'error' : 'warning',
    };
  }

  if (isRenderCrash(event)) {
    return {
      tags: { error_type: 'RENDER_CRASH', priority: 'P1' },
      level: 'fatal',
    };
  }

  return {
    tags: { error_type: 'JS_RUNTIME', priority: 'P2' },
    level: 'warning',
  };
};

export const beforeSend = (
  event: ErrorEvent,
  hint: EventHint,
): ErrorEvent | null => {
  const { tags, level } = classifyError(event, hint);
  return { ...event, level, tags: { ...event.tags, ...tags } };
};
