import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_admin/newsletters/$newsletterId/previous',
)({
  component: PreviousArticlesLayout,
});

function PreviousArticlesLayout() {
  return <Outlet />;
}
