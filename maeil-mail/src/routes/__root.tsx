import { ThemeProvider } from '@emotion/react';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toast } from '@bombom/shared/ui-web';
import { queryClient } from '../main';
import { AuthProvider } from '@/contexts/AuthContext';
import type { QueryClient } from '@tanstack/react-query';
import { theme } from '@/styles/theme';

interface MaeilMailRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MaeilMailRouterContext>()({
  head: () => ({
    meta: [
      { title: '매일메일' },
      { name: 'description', content: '봄봄 × 매일메일' },
    ],
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
