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
        <Description isMobile={isMobile}>{newsletterDescription}</Description>
        {isSubscribed && (
          <ButtonWrapper>
            <UnsubscribeButton
              onClick={() => handleOpenConfirmModal(newsletterId)}
            >
              구독 해지
            </UnsubscribeButton>
          </ButtonWrapper>
        )}

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

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const UnsubscribeButton = styled.button`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.caption};

  &:hover {
    text-decoration: underline;
  }
`;

const Description = styled.p<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ isMobile, theme }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
`;
