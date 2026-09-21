import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import MaeilMailSubscriptionCard from './MaeilMailSubscriptionCard';
import MySubscriptionCard from './MySubscriptionCard';
import NewsletterUnsubscribeModal from './NewsletterUnsubscribeModal';
import { useUnsubscribe } from '../../hooks/useUnsubscribe';
import { queries } from '@/apis/queries';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import type { Device } from '@/hooks/useDevice';
import InfoIcon from '#/assets/svg/info-circle.svg';

const NATIVE_NEWSLETTER_SOURCE = 'MAEIL_MAIL' as const;

interface SubscribedNewslettersSectionProps {
  device: Device;
}

const SubscribedNewslettersSection = ({
  device,
}: SubscribedNewslettersSectionProps) => {
  const countRef = useRef(0);
  const [actionType, setActionType] = useState<'UNSUBSCRIBE' | 'REMOVE'>(
    'UNSUBSCRIBE',
  );

  const { data: newsletters = [] } = useQuery({
    ...queries.mySubscriptions(),
    refetchInterval: () => {
      if (countRef.current >= 60) return false;
      countRef.current += 1;
      return 5 * 1000;
    },
  });

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
        <NoticeBox as="aside" aria-label="구독 뉴스레터 안내">
          <NoticeIcon aria-hidden="true" />
          <NoticeText>
            첫 번째 뉴스레터(또는 웰컴 메일)가 수신되는 시점부터 구독 목록에
            자동으로 반영됩니다.
          </NoticeText>
        </NoticeBox>

        {newsletters.length > 0 ? (
          <NewsletterGrid device={device}>
            {newsletters.map((newsletter) =>
              newsletter.newsletterSource === NATIVE_NEWSLETTER_SOURCE ? (
                <MaeilMailSubscriptionCard
                  key={newsletter.newsletterId}
                  newsletter={newsletter}
                />
              ) : (
                <MySubscriptionCard
                  key={newsletter.newsletterId}
                  newsletter={newsletter}
                  onUnsubscribeRequest={handleUnsubscribeRequest}
                  onRemoveRequest={handleRemoveRequest}
                />
              ),
            )}
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

const NoticeBox = styled.div`
  width: 100%;
  padding: 12px 16px;
  border-left: 4px solid ${({ theme }) => theme.colors.primaryBomBom};
  border-radius: 8px;

  display: flex;
  gap: 8px;
  align-items: flex-start;

  background-color: ${({ theme }) => theme.colors.primaryInfo};

  box-sizing: border-box;
`;

const NoticeIcon = styled(InfoIcon)`
  width: 20px;
  height: 20px;

  flex-shrink: 0;

  fill: ${({ theme }) => theme.colors.primaryBomBom};
`;

const NoticeText = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t5Regular};
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
