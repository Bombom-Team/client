import { ThemeProvider } from '@emotion/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { HeadContent, Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toast } from '@bombom/shared/ui-web';
import { queryClient } from '../main';
import { AuthProvider } from '@/contexts/AuthContext';
import type { QueryClient } from '@tanstack/react-query';
import { theme } from '@/styles/theme';

interface MaeilMailRouterContext {
  queryClient: QueryClient;
}

const DEFAULT_OG_IMAGE = 'https://maeilmail.bombom.news/og-image.png';

export const Route = createRootRouteWithContext<MaeilMailRouterContext>()({
  head: () => ({
    meta: [
      { title: '매일메일' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: '봄봄 × 매일메일' },
      { property: 'og:locale', content: 'ko_KR' },
      { property: 'og:image', content: DEFAULT_OG_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <Outlet />
            <Toast />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
      <TanStackRouterDevtools />
    </>
  );
}
