import { useDevice } from '@bombom/shared/ui-web';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { Suspense } from 'react';
import { queries } from '@/apis/queries';
import BomBomPageLayout from '@/components/PageLayout/BomBomPageLayout';
import NewsletterDetailDesktop from '@/pages/newsletter-detail/NewsletterDetailDesktop';
import NewsletterDetailDesktopSkeleton from '@/pages/newsletter-detail/NewsletterDetailDesktopSkeleton';
import NewsletterDetailMobile from '@/pages/newsletter-detail/NewsletterDetailMobile';
import NewsletterDetailMobileSkeleton from '@/pages/newsletter-detail/NewsletterDetailMobileSkeleton';
import { createNewsletterHead } from '@/pages/newsletter-detail/utils/seo';
import { createSlug, getNewsletterDetailUrl } from '@/utils/url';
import type { NewsletterTab } from '@/pages/newsletter-detail/types';
import type { SearchSchemaInput } from '@tanstack/react-router';

interface NewsletterDetailSearch {
  tab?: NewsletterTab;
}

export const Route = createFileRoute('/newsletters/$newsletterId/$name')({
  loaderDeps: ({ search }) => ({ tab: search.tab }),
  loader: async ({ context, params, deps }) => {
    const id = Number(params.newsletterId);
    const newsletter = await context.queryClient.ensureQueryData(
      queries.newsletterDetail({ id }),
    );
    const slug = createSlug(newsletter.name, params.newsletterId);

    if (params.name !== slug) {
      throw redirect({
        to: '/newsletters/$newsletterId/$name',
        params: { newsletterId: params.newsletterId, name: slug },
        search: { tab: deps.tab },
        replace: true,
      });
    }

    return { newsletter };
  },
  head: ({ loaderData, params }) => {
    const newsletter = loaderData?.newsletter;

    if (!newsletter) {
      return {
        meta: [
          { title: '봄봄 | 뉴스레터 상세' },
          { name: 'robots', content: 'noindex' },
        ],
      };
    }

    const url = getNewsletterDetailUrl(params.newsletterId, newsletter.name);
    return createNewsletterHead(newsletter, url);
  },
  component: NewsletterDetailRoute,
  pendingComponent: NewsletterDetailPending,
  validateSearch: (search: NewsletterDetailSearch & SearchSchemaInput) => ({
    tab: search?.tab,
  }),
});

function NewsletterDetailPending() {
  const device = useDevice();
  return device === 'pc' ? (
    <NewsletterDetailDesktopSkeleton />
  ) : (
    <NewsletterDetailMobileSkeleton />
  );
}

function NewsletterDetailRoute() {
  const { newsletterId } = Route.useParams();
  const id = Number(newsletterId);
  const device = useDevice();
  const isMobileView = device !== 'pc';

  if (isMobileView) {
    return (
      <BomBomPageLayout>
        <Suspense fallback={<NewsletterDetailMobileSkeleton />}>
          <NewsletterDetailMobile newsletterId={id} />
        </Suspense>
      </BomBomPageLayout>
    );
  }

  return (
    <BomBomPageLayout>
      <Suspense fallback={<NewsletterDetailDesktopSkeleton />}>
        <NewsletterDetailDesktop newsletterId={id} />
      </Suspense>
    </BomBomPageLayout>
  );
}
