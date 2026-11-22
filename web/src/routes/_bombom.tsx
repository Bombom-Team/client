import {
  createFileRoute,
  Outlet,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import AppInstallPromptModal from '@/components/AppInstallPromptModal/AppInstallPromptModal';
import ChallengeStartModal from '@/components/ChallengeStartModal/ChallengeStartModal';
import InquiryFloatingButton from '@/components/InquiryFloatingButton/InquiryFloatingButton';
import BomBomPageLayout from '@/components/PageLayout/BomBomPageLayout';
import SignupSourceModal from '@/components/SignupSourceModal/SignupSourceModal';
import { useAuth } from '@/contexts/AuthContext';
import { useSignupSourceModal } from '@/hooks/useSignupSourceModal';
import { useWebViewRegisterToken } from '@/libs/webview/useWebViewRegisterToken';

export const Route = createFileRoute('/_bombom')({
  component: RouteComponent,
});

function RouteComponent() {
  useWebViewRegisterToken();
  const { isLoading, isLoggedIn } = useAuth();
  const signupSourceModal = useSignupSourceModal();
  // 가입 경로 모달이 떠 있거나 띄울지 확인하는 동안에는 다른 모달을 띄우지 않는다.
  const shouldHoldOtherModals =
    isLoading || signupSourceModal.isChecking || signupSourceModal.isOpen;
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
      <SignupSourceModal
        modalRef={signupSourceModal.modalRef}
        isOpen={signupSourceModal.isOpen}
        closeModal={signupSourceModal.closeModal}
      />
      {!shouldHoldOtherModals && <ChallengeStartModal />}
      {!shouldHoldOtherModals && <AppInstallPromptModal />}

      <InquiryFloatingButton />
    </BomBomPageLayout>
  );
}
