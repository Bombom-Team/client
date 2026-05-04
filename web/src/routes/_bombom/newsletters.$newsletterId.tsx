import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { useDevice } from '@/hooks/useDevice';
import NewsletterDetailDesktop from '@/pages/newsletter-detail/NewsletterDetailDesktop';
import NewsletterDetailDesktopSkeleton from '@/pages/newsletter-detail/NewsletterDetailDesktopSkeleton';
import NewsletterDetailMobile from '@/pages/newsletter-detail/NewsletterDetailMobile';
import NewsletterDetailMobileSkeleton from '@/pages/newsletter-detail/NewsletterDetailMobileSkeleton';
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
  const device = useDevice();
  const isMobileView = device !== 'pc';

  if (isMobileView) {
    return (
      <Suspense fallback={<NewsletterDetailMobileSkeleton />}>
        <NewsletterDetailMobile newsletterId={id} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<NewsletterDetailDesktopSkeleton />}>
      <NewsletterDetailDesktop newsletterId={id} />
    </Suspense>
  );
}
