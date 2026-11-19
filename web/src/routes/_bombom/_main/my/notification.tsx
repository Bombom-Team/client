import { isWebView } from '@bombom/shared/ui-web';
import { createFileRoute, redirect } from '@tanstack/react-router';
import NotificationSettingsSection from '@/pages/my-page/components/NotificationSettingsSection/NotificationSettingsSection';

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
