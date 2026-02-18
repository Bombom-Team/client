import styled from '@emotion/styled';
import { useEffect, useRef } from 'react';
import QueueStatus from './QueueStatus/QueueStatus';
import { QUEUE_STATUS_TYPE } from '../constants/constants';
import Button from '@/components/Button/Button';
import type { QueueEntry } from '@/apis/event/event.api';

interface EventModalProps {
  queueEntry: QueueEntry | undefined;
  refetchQueueEntry: () => void;
  cancelQueueEntry: () => void;
  closeModal: () => void;
}

const EventModal = ({
  queueEntry,
  refetchQueueEntry,
  cancelQueueEntry,
  closeModal,
}: EventModalProps) => {
  const statusRef = useRef(queueEntry?.status);
  statusRef.current = queueEntry?.status;

  const handleCloseModal = () => {
    cancelQueueEntry();
    closeModal();
  };

  useEffect(() => {
    return () => {
      if (
        statusRef.current === QUEUE_STATUS_TYPE.waiting ||
        statusRef.current === QUEUE_STATUS_TYPE.ready
      ) {
        cancelQueueEntry();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <ContentWrapper>
        {queueEntry && (
          <QueueStatus
            queueEntry={queueEntry}
            refetchQueueEntry={refetchQueueEntry}
            onClose={handleCloseModal}
          />
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
