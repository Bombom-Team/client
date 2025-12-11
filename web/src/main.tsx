import { ApiError } from '@bombom/shared/apis';
import { Global } from '@emotion/react';
import Clarity from '@microsoft/clarity';
import {
  init as initSentry,
  tanstackRouterBrowserTracingIntegration,
} from '@sentry/react';
import { QueryClient } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ENV } from './apis/env';
import GAInitializer from './libs/googleAnalytics/GAInitializer';
import { routeTree } from './routeTree.gen';
import reset from './styles/reset';
import { isDevelopment, isProduction } from './utils/environment';

if (isProduction) Clarity.init(ENV.clarityProjectId);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // ApiError가 아니라면 네트워크 등 일반 오류 → 최대 3번까지 재시도
        if (!(error instanceof ApiError)) return failureCount < 3;

        // 401은 인증 문제 → 재시도해도 해결되지 않으므로 즉시 실패
        if (error.status === 401) return false;

        // 그 외 ApiError(500, 503 등) → 일시적 서버 오류로 보고 최대 3번 재시도
        return failureCount < 3;
      },
    },
    mutations: {
      retry: () => {
        return false; // mutation은 중복 실행 위험 때문에 재시도하지 않음
      },
    },
  },
});

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  scrollRestoration: true,
});

initSentry({
  dsn: ENV.sentryDsn,
  sendDefaultPii: true,
  integrations: [tanstackRouterBrowserTracingIntegration(router)],
  sampleRate: isDevelopment ? 1 : 0.1,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
  interface HistoryState {
    subscribeUrl: string;
  }
}

async function enableMocking() {
  if (ENV.enableMsw === 'true') {
    const { worker } = await import('./mocks/browser.ts');

    return worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
        options: {
          scope: '/',
        },
      },
      waitUntilReady: true,
    });
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Global styles={reset} />
      <RouterProvider router={router} />
      <GAInitializer />
    </StrictMode>,
  );
});
