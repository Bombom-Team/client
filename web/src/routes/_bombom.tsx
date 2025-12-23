import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { queries } from '@/apis/queries';
import AppInstallPromptModal from '@/components/AppInstallPromptModal/AppInstallPromptModal';
import BomBomPageLayout from '@/components/PageLayout/BomBomPageLayout';
import { useAppInstallPrompt } from '@/hooks/useAppInstallPrompt';
import { useWebViewNotificationActive } from '@/libs/webview/useWebViewNotificationActive';
import { useWebViewRegisterToken } from '@/libs/webview/useWebViewRegisterToken';
import { LANDING_VISITED_KEY } from '@/pages/landing/constants/localStorage';

let isFirstVisit = true;

export const Route = createFileRoute('/_bombom')({
  component: RouteComponent,
  beforeLoad: async ({
    context,
    location,
  }): Promise<void | ReturnType<typeof redirect>> => {
    const hasVisitedLanding = localStorage.getItem(LANDING_VISITED_KEY);
    if (!hasVisitedLanding) {
      return redirect({ to: '/landing' });
    }

    if (!isFirstVisit) return;

    const { queryClient } = context;

    try {
      const user = await queryClient.fetchQuery(queries.userProfile());
      if (user) {
        window.gtag?.('set', { user_id: user.id });
      }
    } catch {
      if (isFirstVisit && location.pathname !== '/')
        return redirect({ to: '/' });
    } finally {
      isFirstVisit = false;
    }
  },
});

function RouteComponent() {
  const {
    showModal,
    handleInstallClick,
    handleLaterClick,
    handleCloseModal,
    modalRef,
  } = useAppInstallPrompt();

  useWebViewRegisterToken();
  useWebViewNotificationActive();

  return (
    <BomBomPageLayout>
      <Outlet />
      <AppInstallPromptModal
        modalRef={modalRef}
        isOpen={showModal}
        closeModal={handleCloseModal}
        onInstallClick={handleInstallClick}
        onLaterClick={handleLaterClick}
      />
    </BomBomPageLayout>
  );
}
