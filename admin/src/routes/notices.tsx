import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/notices')({
  component: NoticesLayout,
});

function NoticesLayout() {
  return <Outlet />;
}
