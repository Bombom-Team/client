import styled from '@emotion/styled';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useUnsubscribe } from './hooks/useUnsubscribe';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import MySubscriptionCard from '@/pages/MyPage/MySubscriptionCard';
import NewsletterUnsubscribeModal from '@/pages/MyPage/NewsletterUnsubscribeModal';
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

  const handleUnsubscribeClick = (newsletterId: number) => {
    setActionType('UNSUBSCRIBE');
    selectNewsletter(newsletterId);
    openModal();
  };

  const handleUnsubscribeConfirm = (newsletterId: number) => {
    setActionType('REMOVE');
    selectNewsletter(newsletterId);
    openModal();
  };

  const confirmUnsubscribeNewsletter = () => {
    confirmUnsubscribe();
    closeModal();
  };

  const getModalContent = () => {
    if (actionType === 'REMOVE') {
      return {
        title: '구독 해지를 완료하셨나요?',
        description: (
          <>
            해지하지 않고 목록에서 제거하면{'\n'}뉴스레터가 계속 올 수 있어요.
          </>
        ),
        confirmButtonText: '네, 해지했어요',
      };
    }
    return {};
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
                device={device}
                onUnsubscribeClick={handleUnsubscribeClick}
                onUnsubscribeConfirm={handleUnsubscribeConfirm}
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
            {...getModalContent()}
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
  font: ${({ theme }) => theme.fonts.body2};
  text-align: center;
`;
