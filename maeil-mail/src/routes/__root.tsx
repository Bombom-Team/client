import { theme } from '@bombom/shared/core';
import { ThemeProvider } from '@emotion/react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider theme={theme}>
      <Outlet />
      <TanStackRouterDevtools />
    </ThemeProvider>
  );
}
