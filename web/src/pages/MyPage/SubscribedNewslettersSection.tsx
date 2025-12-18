import styled from '@emotion/styled';
import { createPortal } from 'react-dom';
import { useUnsubscribe } from './hooks/useUnsubscribe';
import Button from '@/components/Button/Button';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import NewsletterUnsubscribeModal from '@/pages/MyPage/NewsletterUnsubscribeModal';
import type { GetMySubscriptionsResponse } from '@/apis/members';
import type { Device } from '@/hooks/useDevice';

interface SubscribedNewslettersSectionProps {
  newsletters: GetMySubscriptionsResponse;
  device: Device;
}

const SubscribedNewslettersSection = ({
  newsletters,
  device,
}: SubscribedNewslettersSectionProps) => {
  const { selectNewsletter, confirmUnsubscribe } = useUnsubscribe();
  const { modalRef, openModal, closeModal, isOpen } = useModal({
    onClose: () => {
      selectNewsletter(null);
    },
  });

  const openUnsubscribeModal = (newsletterId: number) => {
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
              <NewsletterCard key={newsletter.newsletterId} device={device}>
                <NewsletterContent>
                  <NewsletterImage
                    src={newsletter.imageUrl ?? ''}
                    alt={newsletter.name}
                    width={60}
                    height={60}
                  />
                  <NewsletterInfo>
                    <NewsletterName>{newsletter.name}</NewsletterName>
                    <NewsletterDescription>
                      {newsletter.description}
                    </NewsletterDescription>
                  </NewsletterInfo>
                </NewsletterContent>
                {newsletter.hasUnsubscribeUrl ? (
                  <UnsubscribeButton
                    variant="outlined"
                    onClick={() =>
                      openUnsubscribeModal(newsletter.newsletterId)
                    }
                  >
                    구독 해지
                  </UnsubscribeButton>
                ) : (
                  <UnsubscribeInfoText>
                    아직 구독 해지를 지원하지 않아요.
                  </UnsubscribeInfoText>
                )}
              </NewsletterCard>
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

const NewsletterCard = styled.div<{ device: Device }>`
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 12px;

  display: flex;
  gap: 12px;
  flex-direction: column;

  background: ${({ theme }) => theme.colors.white};

  transition: all 0.2s ease-in-out;
`;

const NewsletterContent = styled.div`
  height: 72px;

  display: flex;
  gap: 12px;
  justify-content: center;
`;

const NewsletterImage = styled(ImageWithFallback)`
  width: 60px;
  height: 60px;
  border-radius: 8px;

  flex-shrink: 0;

  object-fit: cover;
`;

const NewsletterInfo = styled.div`
  overflow: hidden;

  display: flex;
  gap: 4px;
  flex: 1;
  flex-direction: column;
`;

const NewsletterName = styled.h3`
  overflow: hidden;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body1};
  font-weight: 600;
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const NewsletterDescription = styled.p`
  overflow: hidden;

  display: -webkit-box;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

const EmptyMessage = styled.p`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body2};
  text-align: center;
`;

const UnsubscribeButton = styled(Button)`
  border-radius: 8px;
  align-self: flex-end;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;

const UnsubscribeInfoText = styled.p`
  align-self: flex-end;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body3};
`;
