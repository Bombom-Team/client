import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_admin/faqs')({
  component: FaqsLayout,
});

function FaqsLayout() {
  return <Outlet />;
}
