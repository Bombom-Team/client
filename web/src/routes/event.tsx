import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import { useDevice } from '@/hooks/useDevice';
import EventFooter from '@/pages/event/components/EventFooter';
import EventGuide from '@/pages/event/components/EventGuide';
import EventHero from '@/pages/event/components/EventHero';
import EventModal from '@/pages/event/components/EventModal';
import EventPrize from '@/pages/event/components/EventPrize';
import EventShareGuide from '@/pages/event/components/EventShareGuide';
import NoticeModal from '@/pages/event/components/NoticeModal';
import { COUPON_NAME } from '@/pages/event/constants/constants';
import { useQueueEntry } from '@/pages/event/hooks/useQueueEntry';
import LandingHeader from '@/pages/landing/components/LandingHeader';
import type { Device } from '@/hooks/useDevice';

export const Route = createFileRoute('/event')({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 선착순 커피 쿠폰 이벤트',
      },
    ],
  }),
  component: EventPage,
});

function EventPage() {
  const device = useDevice();
  const { modalRef, openModal, closeModal, isOpen } = useModal({
    closeOnBackdropClick: false,
  });
  const {
    queueEntry,
    addQueueEntry,
    cancelQueueEntry,
    eventStatus,
    resetEventStatus,
  } = useQueueEntry({
    couponName: COUPON_NAME,
  });

  const closeNoticeModal = () => {
    resetEventStatus();
    closeModal();
  };

  const applyEvent = () => {
    addQueueEntry();
    openModal();
  };

  return (
    <Container device={device}>
      <LandingHeader />
      <EventHero onApply={applyEvent} />
      <EventPrize />
      <EventGuide />
      <EventShareGuide />
      <EventFooter />
      <Modal
        modalRef={modalRef}
        closeModal={eventStatus ? closeNoticeModal : closeModal}
        isOpen={isOpen}
        showCloseButton={false}
      >
        {eventStatus ? (
          <NoticeModal noticeType={eventStatus} closeModal={closeNoticeModal} />
        ) : (
          <EventModal
            queueEntry={queueEntry}
            cancelQueueEntry={cancelQueueEntry}
            closeModal={closeModal}
          />
        )}
      </Modal>
    </Container>
  );
}

const Container = styled.main<{ device: Device }>`
  width: 100%;
  min-height: 100dvh;
  max-width: 1280px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  word-break: keep-all;
`;
