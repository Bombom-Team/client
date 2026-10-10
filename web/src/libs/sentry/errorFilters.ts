export const NETWORK_NOISE_ERROR_PATTERNS = [
  /^(?:TypeError:\s*)?Failed to fetch(?: \([^)]+\))?$/i,
  /^(?:TypeError:\s*)?Load failed(?: \([^)]+\))?$/i,
  /^(?:TypeError:\s*)?NetworkError when attempting to fetch resource\.?(?: \([^)]+\))?$/i,
];

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
