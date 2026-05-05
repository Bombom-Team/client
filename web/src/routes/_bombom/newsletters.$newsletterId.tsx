import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';
import { queries } from '@/apis/queries';
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
  loader: async ({ context, params }) => {
    const id = Number(params.newsletterId);
    const newsletter = await context.queryClient.ensureQueryData(
      queries.newsletterDetail({ id }),
    );
    return { newsletter };
  },
  head: ({ loaderData, params }) => {
    const newsletter = loaderData?.newsletter;

    if (!newsletter) {
      return {
        meta: [{ title: '봄봄 | 뉴스레터 상세' }],
      };
    }

    const description = (newsletter.description ?? '').slice(0, 160);
    const title = `${newsletter.name} | 봄봄`;
    const url = `https://www.bombom.news/newsletters/${params.newsletterId}`;
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
        {
          name: 'twitter:card',
          content: image ? 'summary_large_image' : 'summary',
        },
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
    };
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
