import { ApiError } from '@bombom/shared/apis';
import { Global } from '@emotion/react';
import { QueryClient } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { routeTree } from './routeTree.gen';
import reset from './styles/reset';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (!(error instanceof ApiError)) return failureCount < 3;
        if (error.status === 401) return false;

        return failureCount < 3;
      },
    },
    mutations: {
      retry: () => {
        return false;
      },
    },
  },
});

const router = createRouter({
  routeTree,
  context: { queryClient },
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Global styles={reset} />
    <RouterProvider router={router} />
  </StrictMode>,
);
