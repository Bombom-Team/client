// web/scripts/prerender.ts(webpack 빌드)에서도 import합니다. 빌드 때 지워지는 type import만 사용합니다.
import type { Newsletter } from '@/types/newsletter';

const DESCRIPTION_MAX_LENGTH = 160;

// 목록 응답(빌드)과 상세 응답(route)을 모두 받도록 두 응답에 공통인 필드만 사용합니다.
type NewsletterSeoSource = Pick<
  Newsletter,
  'name' | 'description' | 'category' | 'imageUrl'
>;

export type NewsletterHeadMeta =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string };

export interface NewsletterHead {
  meta: NewsletterHeadMeta[];
  links: { rel: string; href: string }[];
  scripts: { type: string; children: string }[];
}

const createNewsletterSchema = (
  newsletter: NewsletterSeoSource,
  url: string,
) => {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWorkSeries',
    name: newsletter.name,
    description: newsletter.description,
    genre: newsletter.category,
    inLanguage: 'ko',
    url,
  };

  if (newsletter.imageUrl) {
    schema.image = newsletter.imageUrl;
  }

  return JSON.stringify(schema);
};

/**
 * 뉴스레터 상세 페이지의 head 태그를 만듭니다.
 * 상세 route의 head와 빌드 때 생성하는 상세 HTML이 같은 값을 쓰도록 이 함수 하나로 만듭니다.
 */
export const createNewsletterHead = (
  newsletter: NewsletterSeoSource,
  url: string,
): NewsletterHead => {
  const description = newsletter.description.slice(0, DESCRIPTION_MAX_LENGTH);
  const title = `${newsletter.name} | 봄봄`;
  const image = newsletter.imageUrl ?? '';

  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:image:alt', content: newsletter.name },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      // 뉴스레터 이미지는 대부분 정사각형 로고라 2:1로 잘리는 summary_large_image 대신 summary를 씁니다.
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      ...(image
        ? [
            { name: 'twitter:image', content: image },
            { name: 'twitter:image:alt', content: newsletter.name },
          ]
        : []),
    ],
    links: [{ rel: 'canonical', href: url }],
    scripts: [
      {
        type: 'application/ld+json',
        children: createNewsletterSchema(newsletter, url),
      },
    ],
  };
};
