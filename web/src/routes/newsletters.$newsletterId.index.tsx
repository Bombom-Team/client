import { createFileRoute, redirect } from '@tanstack/react-router';
import { queries } from '@/apis/queries';
import { createSlug } from '@/utils/url';
import type { NewsletterTab } from '@/pages/newsletter-detail/types';
import type { SearchSchemaInput } from '@tanstack/react-router';

interface NewsletterDetailSearch {
  tab?: NewsletterTab;
}

export const Route = createFileRoute('/newsletters/$newsletterId/')({
  validateSearch: (search: NewsletterDetailSearch & SearchSchemaInput) => ({
    tab: search?.tab,
  }),
  loaderDeps: ({ search }) => ({ tab: search.tab }),
  loader: async ({ context, params, deps }) => {
    const id = Number(params.newsletterId);
    const newsletter = await context.queryClient.ensureQueryData(
      queries.newsletterDetail({ id }),
    );

    throw redirect({
      to: '/newsletters/$newsletterId/$name',
      params: {
        newsletterId: params.newsletterId,
        name: createSlug(newsletter.name, params.newsletterId),
      },
      search: { tab: deps.tab },
      replace: true,
    });
  },
});
