import { useState } from 'react';
import { useUnsubscribeNewsletterMutation } from '@/pages/MyPage/hooks/useUnsubscribeNewsletterMutation';
import { openExternalLink } from '@/utils/externalLink';

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

    const data = await unsubscribeNewsletter({
      subscriptionId: selectedNewsletterId,
    });

    if (data?.unsubscribeUrl) {
      openExternalLink(data?.unsubscribeUrl);
    }
  };

  return {
    selectNewsletter,
    confirmUnsubscribe,
  };
};
