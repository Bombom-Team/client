import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { queries } from '@/apis/queries';
import AppInstallPromptModal from '@/components/AppInstallPromptModal/AppInstallPromptModal';
import BomBomPageLayout from '@/components/PageLayout/BomBomPageLayout';
import { useWebViewRegisterToken } from '@/libs/webview/useWebViewRegisterToken';

let isFirstVisit = true;

export const Route = createFileRoute('/_bombom')({
  component: RouteComponent,
  beforeLoad: async ({
    context,
    location,
  }): Promise<void | ReturnType<typeof redirect>> => {
    if (!isFirstVisit) return;

    const { queryClient } = context;

    try {
      await queryClient.fetchQuery(queries.userProfile());
    } catch {
      const isGuestAccessible = location.pathname.startsWith('/support');
      if (isFirstVisit && location.pathname !== '/' && !isGuestAccessible)
        return redirect({ to: '/' });
    } finally {
      isFirstVisit = false;
    }
  },
});

function RouteComponent() {
  useWebViewRegisterToken();

  return (
    <BomBomPageLayout>
      <Outlet />
      <AppInstallPromptModal />
    </BomBomPageLayout>
  );
}
