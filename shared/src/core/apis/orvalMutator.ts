import { fetcher } from './fetcher';

const BASE_URL_PREFIX = '/api/v1';

type OrvalConfig = {
  url: string;
  method: 'get' | 'post' | 'patch' | 'put' | 'delete';
  params?: Record<string, string | number | boolean | undefined | string[]>;
  data?: Record<string, unknown> | unknown[];
  headers?: HeadersInit;
};

const stripBasePath = (url: string) =>
  url.startsWith(BASE_URL_PREFIX) ? url.slice(BASE_URL_PREFIX.length) : url;

const toQuery = (params: OrvalConfig['params']) => {
  if (!params) return undefined;
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === 'boolean') return [key, value ? 'true' : 'false'];
      return [key, value as string | number | string[] | undefined];
    }),
  );
};

export const orvalMutator = async <T>(config: OrvalConfig): Promise<T> => {
  const path = stripBasePath(config.url);
  const query = toQuery(config.params);

  switch (config.method) {
    case 'get':
      return fetcher.get<T>({ path, query });
    case 'post':
      return fetcher.post<never, T>({
        path,
        body: config.data as never,
        headers: config.headers,
      });
    case 'patch':
      return fetcher.patch<never, T>({
        path,
        query,
        body: config.data as never,
      });
    case 'put':
      return fetcher.put<never, T>({ path, body: config.data as never });
    case 'delete':
      return fetcher.delete<never, T>({ path, body: config.data as never });
  }
};

export default orvalMutator;
