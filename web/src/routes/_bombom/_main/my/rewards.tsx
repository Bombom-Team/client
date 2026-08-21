import { createFileRoute } from '@tanstack/react-router';
import RewardsSection from '@/pages/my-page/components/RewardsSection';

export const Route = createFileRoute('/_bombom/_main/my/rewards')({
  component: RewardsPage,
});

function RewardsPage() {
  return <RewardsSection />;
}
