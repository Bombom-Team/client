import styled from '@emotion/styled';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import NewsletterUnsubscribeModal from './NewsletterUnsubscribeModal';
import { useUnsubscribe } from '../hooks/useUnsubscribe';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import MySubscriptionCard from '@/pages/my-page/MySubscriptionCard';
import type { GetMySubscriptionsResponse } from '@/apis/members/members.api';
import type { Device } from '@/hooks/useDevice';

interface SubscribedNewslettersSectionProps {
  newsletters: GetMySubscriptionsResponse;
  device: Device;
}

const SubscribedNewslettersSection = ({
  newsletters,
  device,
}: SubscribedNewslettersSectionProps) => {
  const [actionType, setActionType] = useState<'UNSUBSCRIBE' | 'REMOVE'>(
    'UNSUBSCRIBE',
  );

  const { selectNewsletter, confirmUnsubscribe } = useUnsubscribe();
  const { modalRef, openModal, closeModal, isOpen } = useModal({
    onClose: () => {
      selectNewsletter(null);
    },
  });

  const handleUnsubscribeRequest = (newsletterId: number) => {
    setActionType('UNSUBSCRIBE');
    selectNewsletter(newsletterId);
    openModal();
  };

  const handleRemoveRequest = (newsletterId: number) => {
    setActionType('REMOVE');
    selectNewsletter(newsletterId);
    openModal();
  };

  const confirmUnsubscribeNewsletter = () => {
    confirmUnsubscribe();
    closeModal();
  };

  return (
    <>
      <Container>
        {newsletters && newsletters.length > 0 ? (
          <NewsletterGrid device={device}>
            {newsletters.map((newsletter) => (
              <MySubscriptionCard
                key={newsletter.newsletterId}
                newsletter={newsletter}
                onUnsubscribeRequest={handleUnsubscribeRequest}
                onRemoveRequest={handleRemoveRequest}
              />
            ))}
          </NewsletterGrid>
        ) : (
          <EmptyMessage>구독 중인 뉴스레터가 없습니다.</EmptyMessage>
        )}
      </Container>
      {createPortal(
        <Modal
          modalRef={modalRef}
          closeModal={closeModal}
          isOpen={isOpen}
          showCloseButton={false}
        >
          <NewsletterUnsubscribeModal
            onUnsubscribe={confirmUnsubscribeNewsletter}
            onClose={closeModal}
            type={actionType}
          />
        </Modal>,

        document.body,
      )}
    </>
  );
};

export default SubscribedNewslettersSection;

const Container = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const NewsletterGrid = styled.div<{ device: Device }>`
  display: grid;
  gap: 16px;

  grid-template-columns: ${({ device }) =>
    device === 'mobile' ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))'};
`;

const EmptyMessage = styled.p`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  text-align: center;
`;
