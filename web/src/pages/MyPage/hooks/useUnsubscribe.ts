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
  const { modalRef, openModal, closeModal, isOpen } = useModal({
    onClose: () => {
      setSelectedNewsletterId(null);
    },
  });

  const openUnsubscribeModal = (newsletterId: number) => {
    setSelectedNewsletterId(newsletterId);
    openModal();
  };

  const confirmUnsubscribe = async () => {
    if (!selectedNewsletterId) return;

    const data = await unsubscribeNewsletter({
      subscriptionId: selectedNewsletterId,
    });

    if (data?.unsubscribeUrl) {
      openExternalLink(data?.unsubscribeUrl);
    }
  };

  return {
    modalRef,
    openUnsubscribeModal,
    closeModal,
    isOpen,
    confirmUnsubscribe,
  };
};
