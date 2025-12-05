import styled from '@emotion/styled';
import { createPortal } from 'react-dom';
import NewsletterSubscribeGuide from './NewsletterSubscribeGuide';
import Modal from '@/components/Modal/Modal';
import { useUnsubscribe } from '@/pages/MyPage/hooks/useUnsubscribe';
import NewsletterUnsubscribeConfirmation from '@/pages/MyPage/NewsletterUnsubscribeConfirmation';

interface DetailTabProps {
  newsletterDescription: string;
  newsletterId: number;
  isSubscribed: boolean | undefined;
  isMobile: boolean;
}

const DetailTab = ({
  newsletterDescription,
  newsletterId,
  isSubscribed,
  isMobile,
}: DetailTabProps) => {
  const {
    unsubscribeConfirmModalRef,
    isOpen,
    closeUnsubscribeConfirmModal,
    handleOpenConfirmModal,
    confirmUnsubscribe,
  } = useUnsubscribe();

  return (
    <>
      <Container isMobile={isMobile}>
        {isSubscribed && (
          <UnsubscribeButton
            onClick={() => handleOpenConfirmModal(newsletterId)}
          >
            구독 해지
          </UnsubscribeButton>
        )}
        <Description isMobile={isMobile}>{newsletterDescription}</Description>

        {!isMobile && <NewsletterSubscribeGuide />}
      </Container>
      {createPortal(
        <Modal
          modalRef={unsubscribeConfirmModalRef}
          closeModal={closeUnsubscribeConfirmModal}
          isOpen={isOpen}
          showCloseButton={false}
        >
          <NewsletterUnsubscribeConfirmation
            onUnsubscribe={confirmUnsubscribe}
            onClose={closeUnsubscribeConfirmModal}
          />
        </Modal>,
        document.body,
      )}
    </>
  );
};

export default DetailTab;

const Container = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '16px' : '24px')};
  flex-direction: column;
`;

const UnsubscribeButton = styled.button`
  align-self: flex-start;

  color: ${({ theme }) => theme.colors.dividers};
  font: ${({ theme }) => theme.fonts.caption};

  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Description = styled.p<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ isMobile, theme }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
`;
