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
    modalRef: unsubscribeModalRef,
    openModal: openUnsubscribeModal,
    closeModal: closeUnsubscribeModal,
    isOpen,
  } = useModal();

  const handleOpenUnsubscribeModal = (newsletterId: number) => {
    setSelectedNewsletterId(newsletterId);
    openUnsubscribeModal();
  };

  const confirmUnsubscribe = async () => {
    if (!selectedNewsletterId) return;

    const data = await unsubscribeNewsletter({
      subscriptionId: selectedNewsletterId,
    });

    if (data?.unsubscribeUrl) {
      openExternalLink(data?.unsubscribeUrl);
    }

    closeUnsubscribeModal();
    setSelectedNewsletterId(null);
  };

  return {
    unsubscribeModalRef,
    handleOpenUnsubscribeModal,
    closeUnsubscribeModal,
    isOpen,
    confirmUnsubscribe,
  };
};
