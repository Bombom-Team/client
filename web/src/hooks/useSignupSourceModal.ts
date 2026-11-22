import { useModal } from '@bombom/shared/ui-web';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { queries } from '@/apis/queries';
import { useAuth } from '@/contexts/AuthContext';
import { trackSignupSourceEvent } from '@/utils/trackSignupSourceEvent';

export const useSignupSourceModal = () => {
  const { isLoggedIn } = useAuth();
  const { data: status, isPending } = useQuery({
    ...queries.signupSourceStatus(),
    enabled: isLoggedIn,
  });
  // 가입 경로는 꼭 받아야 하므로 바깥 클릭이나 Esc로 닫히지 않게 한다.
  const { modalRef, isOpen, openModal, closeModal } = useModal({
    closeOnBackdropClick: false,
  });
  const hasOpenedRef = useRef(false);

  // 경로를 저장하기 전에 나가면 다음 접속(레이아웃 마운트) 때 다시 연다.
  useEffect(() => {
    if (!status?.needsSignupSource || hasOpenedRef.current) return;

    hasOpenedRef.current = true;
    openModal();
    trackSignupSourceEvent({ action: '가입 경로 모달 노출' });
  }, [status, openModal]);

  // 로그인했는데 아직 질문 여부를 모르면, 다른 모달이 먼저 뜨지 않게 기다린다.
  const isChecking = isLoggedIn && isPending;

  return { modalRef, isOpen, closeModal, isChecking };
};
