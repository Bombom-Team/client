import type { Newsletter } from '../src/types/newsletter';

const MAX_ATTEMPTS = 3;
const REQUEST_TIMEOUT_MS = 10_000;
const RETRY_DELAY_MS = 1_000;

export type BuildNewsletter = Pick<
  Newsletter,
  'newsletterId' | 'name' | 'description' | 'category' | 'imageUrl' | 'source'
>;

const isBuildNewsletter = (value: unknown): value is BuildNewsletter => {
  if (typeof value !== 'object' || value === null) return false;

  const { newsletterId, name, description, category, imageUrl, source } =
    value as Record<string, unknown>;
  return (
    typeof newsletterId === 'number' &&
    typeof name === 'string' &&
    typeof description === 'string' &&
    typeof category === 'string' &&
    (imageUrl === undefined || typeof imageUrl === 'string') &&
    typeof source === 'string'
  );
};

const fetchNewsletters = async (apiBaseUrl: string) => {
  const response = await fetch(
    `${apiBaseUrl}/newsletters?includeSuspended=true`,
    { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) },
  );
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const body: unknown = await response.json();
  const newsletters =
    typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>).newsletters
      : undefined;
  if (!Array.isArray(newsletters)) {
    throw new Error('응답에 newsletters 배열이 없습니다');
  }

  return newsletters.filter(isBuildNewsletter);
};

const fetchNewslettersWithRetry = async (apiBaseUrl: string) => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      return await fetchNewsletters(apiBaseUrl);
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY_MS * attempt),
        );
      }
    }
  }

  throw lastError;
};

// 매일메일은 상세 페이지 대신 외부 사이트로 이동하므로 제외합니다.
const fetchDetailPageNewslettersWithRetry = async (apiBaseUrl: string) => {
  const newsletters = await fetchNewslettersWithRetry(apiBaseUrl);
  return newsletters.filter(({ source }) => source !== 'MAEIL_MAIL');
};

// sitemap과 상세 HTML 생성이 같은 빌드에서 API를 한 번만 호출하도록 결과를 재사용합니다.
const detailPageNewslettersCache = new Map<
  string,
  Promise<BuildNewsletter[]>
>();

/** 상세 페이지가 있는 뉴스레터 목록을 조회합니다. */
export const fetchDetailPageNewsletters = (apiBaseUrl: string) => {
  const cached = detailPageNewslettersCache.get(apiBaseUrl);
  if (cached) return cached;

  const request = fetchDetailPageNewslettersWithRetry(apiBaseUrl);
  detailPageNewslettersCache.set(apiBaseUrl, request);
  return request;
};

// GitHub Actions 실행 화면에 경고로 표시되도록 workflow command 형식으로 출력합니다.
export const warn = (title: string, message: string) => {
  console.warn(`::warning title=${title}::${message}`);
};
