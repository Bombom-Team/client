import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_bombom/_main/challenge/$challengeId/certification',
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>hihihi</div>;
}
