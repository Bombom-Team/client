// eslint-disable-next-line import/named
import { captureException, ErrorBoundary } from '@sentry/react';
import type { MutationKey, QueryKey } from '@tanstack/react-query';

type CaptureQueryErrorParams = {
  error: unknown;
  queryKey: QueryKey;
};

type CaptureMutationErrorParams = {
  error: unknown;
  mutationKey?: MutationKey;
};

export const captureQueryError = ({
  error,
  queryKey,
}: CaptureQueryErrorParams) => {
  captureException(error, { extra: { queryKey } });
};

export const captureMutationError = ({
  error,
  mutationKey,
}: CaptureMutationErrorParams) => {
  captureException(error, { extra: { mutationKey } });
};

export const SentryErrorBoundary = ErrorBoundary;
