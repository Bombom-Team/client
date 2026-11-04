import { logger } from '../utils';
import ApiError from './ApiError';
import { ENV } from '@bombom/shared/env';

const DEFAULT_ERROR_MESSAGES: Record<number, string> = {
  400: '잘못된 요청입니다. 입력값을 확인해주세요.',
  401: '로그인이 필요합니다.',
  403: '접근 권한이 없습니다.',
  404: '요청한 리소스를 찾을 수 없습니다.',
  413: '파일 용량이 너무 큽니다. 더 작은 파일로 시도해주세요.',
  500: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
};

type JsonBody = Record<string, unknown> | unknown[] | FormData;
type Query = Record<string, string | number | boolean | undefined | string[]>;

type FetchMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

interface RequestOptions<TRequest extends JsonBody> {
  path: string;
  baseUrl?: string;
  method: FetchMethod;
  query?: Query;
  body?: TRequest;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  signal?: AbortSignal;
}

type FetcherOptions<TRequest extends JsonBody> = Pick<
  RequestOptions<TRequest>,
  'path' | 'baseUrl' | 'body' | 'headers'
>;

type GetFetcherOptions = Pick<
  RequestOptions<never>,
  'path' | 'baseUrl' | 'query' | 'headers' | 'credentials' | 'signal'
>;

type PostFetcherOptions<TRequest extends JsonBody> = FetcherOptions<TRequest> &
  Pick<RequestOptions<TRequest>, 'query'>;

type PatchFetcherOptions<TRequest extends JsonBody> = FetcherOptions<TRequest> &
  Pick<RequestOptions<TRequest>, 'query'>;

export const fetcher = {
  get: async <TResponse>(options: GetFetcherOptions) =>
    request<never, TResponse>({ ...options, method: 'GET' }),
  post: async <TRequest extends JsonBody, TResponse>(
    options: PostFetcherOptions<TRequest>,
  ) => request<TRequest, TResponse>({ ...options, method: 'POST' }),
  patch: async <TRequest extends JsonBody, TResponse>(
    options: PatchFetcherOptions<TRequest>,
  ) => request<TRequest, TResponse>({ ...options, method: 'PATCH' }),
  put: async <TRequest extends JsonBody, TResponse>(
    options: FetcherOptions<TRequest>,
  ) => request<TRequest, TResponse>({ ...options, method: 'PUT' }),
  delete: async <TRequest extends JsonBody, TResponse>(
    options: FetcherOptions<TRequest>,
  ) => request<TRequest, TResponse>({ ...options, method: 'DELETE' }),
};

const request = async <TRequest extends JsonBody, TResponse>({
  path,
  baseUrl = ENV.baseUrl,
  method,
  query = {},
  body,
  headers,
  credentials = 'include',
  signal,
}: RequestOptions<TRequest>): Promise<TResponse> => {
  try {
    const url = new URL(baseUrl + path);
    const stringifiedQuery: Record<string, string> = Object.fromEntries(
      Object.entries(query)
        .map(([key, value]) => [key, value?.toString()])
        .filter(([, value]) => value),
    );
    url.search = new URLSearchParams(stringifiedQuery).toString();

    const isFormData = body instanceof FormData;

    const config: RequestInit = {
      method,
      credentials,
      signal,
      headers: {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...headers,
      },
    };

    if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
      config.body = isFormData ? body : JSON.stringify(body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const status = response.status;
      const contentType = response.headers.get('Content-Type');
      let rawBody;
      let errorMessage = DEFAULT_ERROR_MESSAGES[status];

      try {
        if (contentType?.includes('application/json')) {
          rawBody = await response.json();
          errorMessage = rawBody.message ?? errorMessage;
        } else {
          rawBody = await response.text();
          errorMessage = rawBody || errorMessage;
        }
      } catch {
        errorMessage = '응답 파싱에 실패했습니다.';
      }

      throw new ApiError(status, errorMessage ?? '', rawBody);
    }

    const contentType = response.headers.get('Content-Type');

    if (contentType?.includes('application/json')) {
      try {
        return await response.json();
      } catch {
        throw new ApiError(response.status, 'JSON 파싱에 실패했습니다.');
      }
    }

    return undefined as TResponse;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
