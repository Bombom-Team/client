import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/events')({
  component: EventsLayout,
});

function EventsLayout() {
  return <Outlet />;
}
