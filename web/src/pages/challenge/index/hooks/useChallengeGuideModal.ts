import { useEffect, useState } from 'react';
import useModal from '@/components/Modal/useModal';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { openExternalLink } from '@/utils/externalLink';

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

  const handleGoToIntro = () => {
    openExternalLink(
      'https://maroon-geranium-880.notion.site/2d103dcf205680dfa045d47385af3df9?source=copy_link',
    );
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
    closeModal,
    isAgreed,
    handleConfirm,
    handleGoToIntro,
    handleToggleAgreement,
  };
}
