// eslint-disable-next-line import/named
import { captureException, captureMessage, ErrorBoundary } from '@sentry/react';
import type { QueryKey } from '@tanstack/react-query';

type CaptureQueryErrorParams = {
  error: unknown;
  queryKey: QueryKey;
};

export const captureQueryError = ({
  error,
  queryKey,
}: CaptureQueryErrorParams) => {
  const sanitizedQueryKey = queryKey.map((segment) =>
    typeof segment === 'object' && segment !== null ? '{params}' : segment,
  );

  captureException(error, { extra: { queryKey: sanitizedQueryKey } });
};

export const captureMutationError = ({ error }: { error: unknown }) => {
  captureException(error);
};

export const captureNotFound = ({ path }: { path: string }) => {
  captureMessage('Route not found', {
    tags: { error_type: 'NOT_FOUND' },
    extra: { path },
  });
};

export const SentryErrorBoundary = ErrorBoundary;
