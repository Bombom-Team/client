import styled from '@emotion/styled';
import { useEffect } from 'react';
import QueueStatus from './QueueStatus/QueueStatus';
import { QUEUE_STATUS_TYPE } from '../constants/constants';
import Button from '@/components/Button/Button';
import type { QueueEntry } from '@/apis/event/event.api';

interface EventModalProps {
  queueEntry: QueueEntry | undefined;
  cancelQueueEntry: () => void;
  closeModal: () => void;
}

const EventModal = ({
  queueEntry,
  cancelQueueEntry,
  closeModal,
}: EventModalProps) => {
  const handleCloseModal = () => {
    cancelQueueEntry();
    closeModal();
  };

  useEffect(() => {
    return () => {
      if (
        queueEntry?.status === QUEUE_STATUS_TYPE.waiting ||
        queueEntry?.status === QUEUE_STATUS_TYPE.ready
      ) {
        cancelQueueEntry();
      }
    };
  }, [queueEntry?.status, cancelQueueEntry]);

  return (
    <Container>
      <ContentWrapper>
        {queueEntry && (
          <QueueStatus queueEntry={queueEntry} onClose={closeModal} />
        )}

        {queueEntry?.status !== QUEUE_STATUS_TYPE.issued && (
          <ConfirmButton onClick={handleCloseModal}>닫기</ConfirmButton>
        )}
      </ContentWrapper>
    </Container>
  );
};

export default EventModal;

const Container = styled.div`
  width: 100%;

  display: flex;
  gap: 12px;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  min-width: 264px;
  padding: 0 8px;

  display: flex;
  gap: 24px;
  flex-direction: column;
  align-items: center;
`;

const ConfirmButton = styled(Button)`
  width: 100%;
  max-width: 200px;

  font: ${({ theme }) => theme.fonts.body1};
`;
