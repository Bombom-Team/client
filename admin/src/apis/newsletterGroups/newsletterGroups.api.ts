import { fetcher } from '@bombom/shared/apis';
import type { NewsletterGroup } from '@/types/newsletterGroup';

export const getNewsletterGroups = async () => {
  return fetcher.get<NewsletterGroup[]>({
    path: '/newsletter-groups',
  });
};
