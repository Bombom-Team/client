import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Navigate } from '@tanstack/react-router';
import { queries } from '@/apis/queries';
import { compareDates } from '@/utils/date';

export const Route = createFileRoute('/_bombom/_main/challenge/$challengeId/')({
  component: ChallengeRedirect,
});

function ChallengeRedirect() {
  const { challengeId } = Route.useParams();
  const { data: challengeInfo } = useQuery(
    queries.challengesInfo(Number(challengeId)),
  );

  if (!challengeInfo) return null;

  const isLastDayOrAfter =
    compareDates(new Date(challengeInfo.endDate), new Date()) <= 0;

  return (
    <Navigate
      to={
        isLastDayOrAfter
          ? '/challenge/$challengeId/review'
          : '/challenge/$challengeId/daily'
      }
      params={{ challengeId }}
      replace
    />
  );
}
