const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NUMERIC_PATTERN = /^\d+$/;

export const normalizeNotFoundPath = (path: string) => {
  const normalized = path
    .split('/')
    .map((segment) => {
      if (NUMERIC_PATTERN.test(segment)) return ':id';
      if (UUID_PATTERN.test(segment)) return ':uuid';
      return segment;
    })
    .join('/');

  return normalized || '/';
};
