import { createFileRoute } from '@tanstack/react-router';
import NewsletterRequestFunnel from '@/pages/newsletter-request/components/NewsletterRequestFunnel';

export const Route = createFileRoute('/_bombom/newsletter-requests_/new')({
  head: () => ({
    meta: [
      { title: '봄봄 | 뉴스레터 신청하기' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: NewsletterRequestNewPage,
});

function NewsletterRequestNewPage() {
  return <NewsletterRequestFunnel />;
}
