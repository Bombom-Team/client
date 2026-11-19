import { createFileRoute, redirect } from '@tanstack/react-router';
import { queries } from '@/apis/queries';
import { compareDates } from '@/utils/date';
import { throwNotFoundForApiError } from '@/utils/routeError';

export const Route = createFileRoute('/_bombom/_main/challenge/$challengeId/')({
  loader: async ({ context, params }) => {
    let challengeInfo;

    try {
      challengeInfo = await context.queryClient.ensureQueryData(
        queries.challengesInfo(Number(params.challengeId)),
      );
    } catch (error) {
      return throwNotFoundForApiError(error, [403, 404]);
    }

    const isLastDayOrAfter =
      compareDates(new Date(challengeInfo.endDate), new Date()) <= 0;

    throw redirect({
      to: isLastDayOrAfter
        ? '/challenge/$challengeId/review'
        : '/challenge/$challengeId/daily',
      params: { challengeId: params.challengeId },
      replace: true,
    });
  },
});
