import { createFileRoute } from '@tanstack/react-router';
import { Suspense, useEffect } from 'react';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import MyChallengeSection from '@/pages/my-page/components/MyChallengeSection/MyChallengeSection';
import MyChallengeSectionSkeleton from '@/pages/my-page/components/MyChallengeSection/MyChallengeSectionSkeleton';

export const Route = createFileRoute('/_bombom/_main/my/challenges')({
  component: ChallengesPage,
});

function ChallengesPage() {
  useEffect(() => {
    trackEvent({
      category: 'MyPage',
      action: '나의 챌린지 탭 진입',
    });
  }, []);

  return (
    <Suspense fallback={<MyChallengeSectionSkeleton />}>
      <MyChallengeSection />
    </Suspense>
  );
}
