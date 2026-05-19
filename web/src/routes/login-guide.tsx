import { createFileRoute } from '@tanstack/react-router';
import InAppBrowserGuide from '../pages/login/components/InAppBrowserGuide';

export const Route = createFileRoute('/login-guide')({
  head: () => ({
    meta: [
      {
        name: 'robots',
        content: 'noindex, follow',
      },
      {
        title: '봄봄 | 로그인',
      },
    ],
  }),
  component: InAppBrowserGuide,
});
