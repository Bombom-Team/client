import { getNewsletterDetailUrl } from '../src/utils/url';

const MAX_ATTEMPTS = 3;
const REQUEST_TIMEOUT_MS = 10_000;
const RETRY_DELAY_MS = 1_000;

interface SitemapNewsletter {
  newsletterId: number;
  name: string;
  source: string;
}

const isSitemapNewsletter = (value: unknown): value is SitemapNewsletter => {
  if (typeof value !== 'object' || value === null) return false;

  const { newsletterId, name, source } = value as Record<string, unknown>;
  return (
    typeof newsletterId === 'number' &&
    typeof name === 'string' &&
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

  return newsletters.filter(isSitemapNewsletter);
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

const createNewsletterUrlEntry = ({
  newsletterId,
  name,
}: SitemapNewsletter) => {
  const loc = encodeURI(getNewsletterDetailUrl(newsletterId, name));

  return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
};

// GitHub Actions 실행 화면에 경고로 표시되도록 workflow command 형식으로 출력합니다.
const warn = (message: string) => {
  console.warn(`::warning title=sitemap::${message}`);
};

/**
 * 정적 sitemap에 뉴스레터 상세 URL을 추가합니다.
 * 조회에 실패해도 빌드를 막지 않고 정적 sitemap을 그대로 반환합니다.
 */
export const appendNewsletterUrls = async (
  sitemap: string,
  apiBaseUrl: string | undefined,
) => {
  if (!apiBaseUrl) {
    warn('API_BASE_URL이 없어 뉴스레터 상세 URL 없이 sitemap을 생성합니다.');
    return sitemap;
  }

  try {
    const newsletters = await fetchNewslettersWithRetry(apiBaseUrl);
    // 매일메일은 상세 페이지 대신 외부 사이트로 이동하므로 제외합니다.
    const entries = newsletters
      .filter(({ source }) => source !== 'MAEIL_MAIL')
      .map(createNewsletterUrlEntry);

    if (entries.length === 0) {
      warn(
        '조회된 뉴스레터가 없어 뉴스레터 상세 URL 없이 sitemap을 생성합니다.',
      );
      return sitemap;
    }

    return sitemap.replace(
      '</urlset>',
      `  <!-- 뉴스레터 상세 (빌드 시 생성) -->\n${entries.join('\n')}\n\n</urlset>`,
    );
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    warn(
      `뉴스레터 목록 조회에 실패해 뉴스레터 상세 URL 없이 sitemap을 생성합니다: ${reason}`,
    );
    return sitemap;
  }
};
