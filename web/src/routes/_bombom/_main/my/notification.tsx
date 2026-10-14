import { createFileRoute, redirect } from '@tanstack/react-router';
import NotificationSettingsSection from '@/pages/my-page/components/NotificationSettingsSection/NotificationSettingsSection';
import { isWebView } from '@/utils/device';

export const Route = createFileRoute('/_bombom/_main/my/notification')({
  beforeLoad: () => {
    if (!isWebView()) {
      throw redirect({ to: '/my/profile', replace: true });
    }
  },
  component: NotificationPage,
});

function NotificationPage() {
  return <NotificationSettingsSection />;
}
