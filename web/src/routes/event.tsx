import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { COUPON_NAME } from '@/apis/event/constants';
import { queries } from '@/apis/queries';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import { useDevice } from '@/hooks/useDevice';
import EventFooter from '@/pages/event/components/EventFooter';
import EventGuide from '@/pages/event/components/EventGuide';
import EventHero from '@/pages/event/components/EventHero';
import EventNoticeModal from '@/pages/event/components/EventNoticeModal';
import EventPrize from '@/pages/event/components/EventPrize';
import { useAddQueueEntryMutation } from '@/pages/event/hooks/useAddQueueEntryMutation';
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
  const { modalRef, openModal, closeModal, isOpen } = useModal();
  const { mutate: addQueueEntry } = useAddQueueEntryMutation({
    couponName: COUPON_NAME,
  });
  const { data: queueEntry } = useQuery(queries.queueEntry(COUPON_NAME));

  const handleApply = () => {
    addQueueEntry();
    openModal();
  };

  return (
    <Container device={device}>
      <LandingHeader />
      <EventHero onApply={handleApply} />
      <EventPrize />
      <EventGuide />
      <EventFooter />
      <Modal
        modalRef={modalRef}
        closeModal={closeModal}
        isOpen={isOpen}
        showCloseButton={false}
      >
        <EventNoticeModal queueEntry={queueEntry} closeModal={closeModal} />
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
