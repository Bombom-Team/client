import { fetchDetailPageNewsletters, warn } from './newsletters';
import { getNewsletterDetailUrl } from '../src/utils/url';
import type { BuildNewsletter } from './newsletters';

const createNewsletterUrlEntry = ({ newsletterId, name }: BuildNewsletter) => {
  const loc = encodeURI(getNewsletterDetailUrl(newsletterId, name));

  return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
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
    warn(
      'sitemap',
      'API_BASE_URL이 없어 뉴스레터 상세 URL 없이 sitemap을 생성합니다.',
    );
    return sitemap;
  }

  try {
    const newsletters = await fetchDetailPageNewsletters(apiBaseUrl);
    const entries = newsletters.map(createNewsletterUrlEntry);

    if (entries.length === 0) {
      warn(
        'sitemap',
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
      'sitemap',
      `뉴스레터 목록 조회에 실패해 뉴스레터 상세 URL 없이 sitemap을 생성합니다: ${reason}`,
    );
    return sitemap;
  }
};
