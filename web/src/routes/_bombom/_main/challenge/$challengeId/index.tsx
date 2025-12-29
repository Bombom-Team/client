import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_bombom/_main/challenge/$challengeId/')({
  component: ChallengeRedirect,
});

function ChallengeRedirect() {
  const { challengeId } = Route.useParams();

  return (
    <Navigate
      to="/challenge/$challengeId/daily"
      params={{ challengeId }}
      replace
    />
  );
}
