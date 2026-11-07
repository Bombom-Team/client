import type { GetNewsletterWithDetailResponse } from '@/apis/newsletters/newsletters.api';

export const createNewsletterSchema = (
  newsletter: GetNewsletterWithDetailResponse,
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
