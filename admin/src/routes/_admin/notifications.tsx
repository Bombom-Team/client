import { createFileRoute } from '@tanstack/react-router';
import { Layout } from '@/components/Layout';
import NotificationsPage from '@/pages/notifications/NotificationsPage';

export const Route = createFileRoute('/_admin/notifications')({
  component: NotificationsRoutePage,
});

function NotificationsRoutePage() {
  return (
    <Layout title="알림 현황">
      <NotificationsPage />
    </Layout>
  );
}
