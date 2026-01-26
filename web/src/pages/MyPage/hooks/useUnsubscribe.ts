import { useState } from 'react';
import { useUnsubscribeNewsletterMutation } from '@/pages/MyPage/hooks/useUnsubscribeNewsletterMutation';

export const useUnsubscribe = () => {
  const [selectedNewsletterId, setSelectedNewsletterId] = useState<
    number | null
  >(null);
  const { mutateAsync: unsubscribeNewsletter } =
    useUnsubscribeNewsletterMutation();

  const selectNewsletter = (id: number | null) => {
    setSelectedNewsletterId(id);
  };

  const confirmUnsubscribe = async () => {
    if (!selectedNewsletterId) return;

    await unsubscribeNewsletter({
      subscriptionId: selectedNewsletterId,
    });
  };

  return {
    selectNewsletter,
    confirmUnsubscribe,
  };
};
