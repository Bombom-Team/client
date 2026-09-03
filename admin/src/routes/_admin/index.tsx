import { createFileRoute } from '@tanstack/react-router';
import { Layout } from '@/components/Layout';
import DashboardPage from '@/pages/dashboard/DashboardPage';

export const Route = createFileRoute('/_admin/')({
  component: IndexPage,
});

function IndexPage() {
  return (
    <Layout title="대시보드">
      <DashboardPage />
    </Layout>
  );
}
