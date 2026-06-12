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
  const sanitizedQueryKey = queryKey.map((segment) =>
    typeof segment === 'object' && segment !== null ? '{params}' : segment,
  );

  captureException(error, { extra: { queryKey: sanitizedQueryKey } });
};

export const captureMutationError = ({ error }: { error: unknown }) => {
  captureException(error);
};

export const SentryErrorBoundary = ErrorBoundary;
