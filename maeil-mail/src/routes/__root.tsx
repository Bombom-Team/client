import { ThemeProvider } from '@emotion/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { queryClient } from '../main';
import type { QueryClient } from '@tanstack/react-query';
import { theme } from '@/styles/theme';

interface MaeilMailRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MaeilMailRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <Outlet />
        </ThemeProvider>
      </QueryClientProvider>
      <TanStackRouterDevtools />
    </>
  );
}
