import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/notices')({
  component: NoticesLayout,
});

function NoticesLayout() {
  return <Outlet />;
}
