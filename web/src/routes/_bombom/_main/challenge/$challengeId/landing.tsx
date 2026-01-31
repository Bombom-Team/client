import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_bombom/_main/challenge/$challengeId/landing',
)({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 뉴스레터 읽기 챌린지',
      },
    ],
  }),
  component: ChallengeLanding,
});

function ChallengeLanding() {
  return;
}
