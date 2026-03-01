import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/resources')({
  component: ResourcesLayout,
});

function ResourcesLayout() {
  return <Outlet />;
}
