import { useEffect, useState } from 'react';
import useModal from '@/components/Modal/useModal';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';

const CHALLENGE_GUIDE_DISMISSED_KEY = 'challenge-guide-modal-dismissed';

interface ChallengeGuideModalParams {
  challengeId: number;
}

export function useChallengeGuideModal({
  challengeId,
}: ChallengeGuideModalParams) {
  const [isDismissed, setIsDismissed] = useLocalStorageState<boolean>(
    `${CHALLENGE_GUIDE_DISMISSED_KEY}-${challengeId}`,
    false,
  );
  const { modalRef, isOpen, openModal, closeModal } = useModal({
    closeOnBackdropClick: false,
  });
  const [isAgreed, setIsAgreed] = useState(false);

  const handleConfirm = () => {
    setIsDismissed(true);
    closeModal();
  };

  const handleCloseModal = () => {
    closeModal();
  };

  const handleGoToIntro = () => {
    // TODO: 소개 페이지 라우팅 구현
    window.open('/challenge/intro', '_blank');
    closeModal();
  };

  const handleToggleAgreement = () => {
    setIsAgreed((prev) => !prev);
  };

  useEffect(() => {
    if (isDismissed) return;

    openModal();
  }, [isDismissed, openModal]);

  return {
    modalRef,
    isOpen,
    isAgreed,
    handleConfirm,
    handleGoToIntro,
    handleCloseModal,
    handleToggleAgreement,
  };
}
