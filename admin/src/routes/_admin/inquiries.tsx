import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/inquiries')({
  component: InquiriesLayout,
});

function InquiriesLayout() {
  return <Outlet />;
}
