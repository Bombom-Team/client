import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useEffect } from 'react';
import { queries } from '@/apis/queries';
import AppInstallPromptModal from '@/components/AppInstallPromptModal/AppInstallPromptModal';
import PageLayout from '@/components/PageLayout/PageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppInstallPrompt } from '@/hooks/useAppInstallPrompt';
import { useWebViewNotificationActive } from '@/libs/webview/useWebViewNotificationActive';
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

    const data = queryClient.getQueryData(queries.userProfile().queryKey);
    if (data) {
      isFirstVisit = false;
      return;
    }

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
  const { updateAuthState } = useAuth();
  const { data: userInfo } = useQuery(queries.userProfile());

  const {
    showModal,
    handleInstallClick,
    handleLaterClick,
    handleCloseModal,
    modalRef,
  } = useAppInstallPrompt();

  useWebViewRegisterToken();
  useWebViewNotificationActive();

  useEffect(() => {
    updateAuthState(userInfo ?? null);
  }, [userInfo, updateAuthState]);

  return (
    <PageLayout>
      <Outlet />
      <AppInstallPromptModal
        modalRef={modalRef}
        isOpen={showModal}
        closeModal={handleCloseModal}
        onInstallClick={handleInstallClick}
        onLaterClick={handleLaterClick}
      />
    </PageLayout>
  );
}
