import { createFileRoute } from '@tanstack/react-router';
import MaintenanceCard from '@/pages/system/components/MaintenanceCard';

export const Route = createFileRoute('/maintenance')({
  head: () => ({
    meta: [
      {
        name: 'robots',
        content: 'noindex, nofollow',
      },
      {
        title: '봄봄 | 회원가입',
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <MaintenanceCard />;
}
