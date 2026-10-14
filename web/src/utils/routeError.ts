import { ApiError } from '@bombom/shared/apis';
import { notFound } from '@tanstack/react-router';

export const throwNotFoundForApiError = (
  error: unknown,
  notFoundStatuses: readonly number[],
): never => {
  if (error instanceof ApiError && notFoundStatuses.includes(error.status)) {
    throw notFound();
  }

  throw error;
};
