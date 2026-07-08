import { theme } from '@bombom/shared/theme';
import { ThemeProvider } from '@emotion/react';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import Toast from '@/components/Toast/Toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { useChannelTalk } from '@/hooks/useChannelTalk';
import { useDevice } from '@/hooks/useDevice';
import usePageTracking from '@/libs/googleAnalytics/usePageTracking';
import { useWebViewAuth } from '@/libs/webview/useWebViewAuth';
import { useWebViewRouting } from '@/libs/webview/useWebViewRouting';
import { queryClient } from '@/main';
import type { QueryClient } from '@tanstack/react-query';
import type { redirect } from '@tanstack/react-router';

interface BomBomRouterContext {
  queryClient: QueryClient;
}

// 우하단 채널톡 런처 버튼(약 60px + 하단 여백)과 겹치지 않도록 토스트를 그 위로 띄운다.
// 채널톡 버튼은 PC에서만 노출되므로 PC에서만 간격을 띄운다.
const CHANNEL_TALK_TOAST_OFFSET = 96;

const RootComponent = () => {
  const device = useDevice();

  usePageTracking();
  useWebViewAuth();
  useWebViewRouting();
  useChannelTalk();

  const toastOffset = device === 'pc' ? CHANNEL_TALK_TOAST_OFFSET : undefined;

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <Outlet />
            <Toast offset={toastOffset} />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRouteWithContext<BomBomRouterContext>()({
  head: () => ({
    meta: [
      { title: '봄봄' },
      {
        name: 'description',
        content: '봄봄 - 뉴스레터, 아티클, 트렌드 정보를 한 곳에!',
      },
      { property: 'og:title', content: '봄봄' },
      {
        property: 'og:description',
        content: '봄봄 - 뉴스레터, 아티클, 트렌드 정보를 한 곳에!',
      },
      { property: 'og:image', content: '/assets/png/og-image.png' },
      { property: 'og:image:alt', content: '봄봄 로고' },
      { property: 'og:url', content: 'https://www.bombom.news' },
      { name: 'twitter:title', content: '봄봄' },
      {
        name: 'twitter:description',
        content: '봄봄 - 뉴스레터, 아티클, 트렌드 정보를 한 곳에!',
      },
      { name: 'twitter:image', content: '/assets/png/og-image.png' },
      { name: 'twitter:image:alt', content: '봄봄 로고' },
      { name: 'robots', content: 'index, follow' },
    ],
    links: [{ rel: 'canonical', href: 'https://www.bombom.news' }],
  }),
  component: () => (
    <>
      <HeadContent />
      <RootComponent />
    </>
  ),
  beforeLoad: async (): Promise<void | ReturnType<typeof redirect>> => {
    // const maintenancePath = '/maintenance';

    // try {
    //   const response = await fetch(ENV.monitoringStatusUrl, {
    //     cache: 'no-store',
    //   });

    //   if (!response.ok) {
    //     throw new Error(`Failed to fetch status: ${response.status}`);
    //   }

    //   const prometheusResult = (await response.json()) as PrometheusResponse;
    //   const status =
    //     prometheusResult.data.result[0]?.value[1] ?? SERVER_STATUS.off;

    //   const isServerOn = status === SERVER_STATUS.on;

    //   if (!isServerOn && location.pathname !== maintenancePath) {
    //     return redirect({ to: maintenancePath });
    //   } else if (isServerOn && location.pathname === maintenancePath) {
    //     return redirect({ to: '/' });
    //   }
    // } catch (err) {
    //   console.error('Server status check failed:', err);
    //   if (location.pathname !== maintenancePath) {
    //     return redirect({ to: maintenancePath });
    //   }
    // }

    return;
  },
});
