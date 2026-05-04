import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import NewsletterDetailPage from '@/pages/newsletter-detail/NewsletterDetailPage';
import NewsletterDetailPageSkeleton from '@/pages/newsletter-detail/NewsletterDetailPageSkeleton';
import type { NewsletterTab } from '@/pages/newsletter-detail/types';
import type { SearchSchemaInput } from '@tanstack/react-router';

interface NewsletterDetailSearch {
  tab?: NewsletterTab;
}

export const Route = createFileRoute('/_bombom/newsletters/$newsletterId')({
  head: () => ({
    meta: [
      {
        name: 'robots',
        content: 'noindex, nofollow',
      },
      {
        title: '봄봄 | 뉴스레터 상세',
      },
    ],
  }),
  component: NewsletterDetailRoute,
  validateSearch: (search: NewsletterDetailSearch & SearchSchemaInput) => ({
    tab: search?.tab,
  }),
});

function NewsletterDetailRoute() {
  const { newsletterId } = Route.useParams();
  const id = Number(newsletterId);

  return (
    <Suspense fallback={<NewsletterDetailPageSkeleton />}>
      <NewsletterDetailPage newsletterId={id} />
    </Suspense>
  );
}
