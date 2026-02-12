import styled from '@emotion/styled';
import QueueStatus from './QueueStatus/QueueStatus';
import Button from '@/components/Button/Button';
import { useDevice, type Device } from '@/hooks/useDevice';
import type { QueueEntry } from '@/apis/event/event.api';

interface EventNoticeModalProps {
  queueEntry: QueueEntry | undefined;
  closeModal: () => void;
}

const EventNoticeModal = ({
  queueEntry,
  closeModal,
}: EventNoticeModalProps) => {
  const device = useDevice();

  return (
    <Container>
      {queueEntry ? (
        <QueueStatus queueEntry={queueEntry} />
      ) : (
        <ContentWrapper>
          <Title device={device}>이벤트 기간이 아닙니다.</Title>
          <Description>자세한 내용은 이벤트 페이지를 참고해주세요.</Description>
        </ContentWrapper>
      )}

      <ConfirmButton onClick={closeModal}>확인</ConfirmButton>
    </Container>
  );
};

export default EventNoticeModal;

const Container = styled.div`
  width: 100%;

  display: flex;
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

const Title = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading5 : theme.fonts.heading4};
  text-align: center;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body1};
  text-align: center;
`;

const ConfirmButton = styled(Button)`
  width: 100%;
  max-width: 200px;

  font: ${({ theme }) => theme.fonts.body1};
`;
