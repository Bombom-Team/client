import {
  createFileRoute,
  Outlet,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import AppInstallPromptModal from '@/components/AppInstallPromptModal/AppInstallPromptModal';
import ChallengeStartModal from '@/components/ChallengeStartModal/ChallengeStartModal';
import BomBomPageLayout from '@/components/PageLayout/BomBomPageLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useWebViewRegisterToken } from '@/libs/webview/useWebViewRegisterToken';

export const Route = createFileRoute('/_bombom')({
  component: RouteComponent,
});

function RouteComponent() {
  useWebViewRegisterToken();
  const { isLoading, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isFirstVisitRef = useRef(true);
  const isGuestAccessible = pathname === '/' || pathname.startsWith('/support');
  const isWaitingForAuth =
    isFirstVisitRef.current && !isGuestAccessible && !isLoggedIn;

  useEffect(() => {
    if (isLoading || !isFirstVisitRef.current) return;
    isFirstVisitRef.current = false;

    if (!isLoggedIn && !isGuestAccessible) {
      void navigate({ to: '/', replace: true });
    }
  }, [isLoading, isLoggedIn, isGuestAccessible, navigate]);

  return (
    <BomBomPageLayout>
      {!isWaitingForAuth && <Outlet />}
      <ChallengeStartModal />
      <AppInstallPromptModal />
    </BomBomPageLayout>
  );
}
