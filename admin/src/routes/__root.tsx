import { ThemeProvider } from '@emotion/react';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { NoticeProvider } from '@/contexts/NoticeContext';
import { GlobalStyles } from '@/styles/GlobalStyles';
import { theme } from '@/styles/theme';
import type { QueryClient } from '@tanstack/react-query';

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <NoticeProvider>
        <Outlet />
        {import.meta.env.DEV && <TanStackRouterDevtools />}
      </NoticeProvider>
    </ThemeProvider>
  ),
});
