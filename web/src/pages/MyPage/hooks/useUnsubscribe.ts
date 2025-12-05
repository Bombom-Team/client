import { useState } from 'react';
import useModal from '@/components/Modal/useModal';
import { useUnsubscribeNewsletterMutation } from '@/pages/MyPage/hooks/useUnsubscribeNewsletterMutation';
import { openExternalLink } from '@/utils/externalLink';

export const useUnsubscribe = () => {
  const [selectedNewsletterId, setSelectedNewsletterId] = useState<
    number | null
  >(null);
  const { mutateAsync: unsubscribeNewsletter } =
    useUnsubscribeNewsletterMutation();
  const {
    modalRef: unsubscribeConfirmModalRef,
    openModal: openUnsubscribeConfirmModal,
    closeModal: closeUnsubscribeConfirmModal,
    isOpen,
  } = useModal();

  const handleOpenConfirmModal = (newsletterId: number) => {
    setSelectedNewsletterId(newsletterId);
    openUnsubscribeConfirmModal();
  };

  const confirmUnsubscribe = async () => {
    if (!selectedNewsletterId) return;

    const data = await unsubscribeNewsletter({
      subscriptionId: selectedNewsletterId,
    });

    if (data?.unsubscribeUrl) {
      openExternalLink(data?.unsubscribeUrl);
    }

    closeUnsubscribeConfirmModal();
    setSelectedNewsletterId(null);
  };

  return {
    unsubscribeConfirmModalRef,
    handleOpenConfirmModal,
    closeUnsubscribeConfirmModal,
    isOpen,
    confirmUnsubscribe,
  };
};
