// eslint-disable-next-line import/named
import { captureException, ErrorBoundary } from '@sentry/react';
import type { QueryKey } from '@tanstack/react-query';

type CaptureQueryErrorParams = {
  error: unknown;
  queryKey: QueryKey;
};

export const captureQueryError = ({
  error,
  queryKey,
}: CaptureQueryErrorParams) => {
  captureException(error, { extra: { queryKey } });
};

export const SentryErrorBoundary = ErrorBoundary;
