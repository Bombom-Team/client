import styled from '@emotion/styled';
import { EVENT_STATUS_TYPE } from '../constants/constants';
import Button from '@/components/Button/Button';
import { useDevice, type Device } from '@/hooks/useDevice';
import type { EventErrorStatus } from '../types/event';

interface NoticeModalProps {
  noticeType: EventErrorStatus;
  closeModal: () => void;
}

const NoticeModal = ({ noticeType, closeModal }: NoticeModalProps) => {
  const device = useDevice();

  return (
    <Container>
      <ContentWrapper>
        <Title device={device}>
          {noticeType === EVENT_STATUS_TYPE.notStarted
            ? '이벤트 기간이 아니에요.'
            : '다음 이벤트를 기대해주세요!'}
        </Title>
        <Description>자세한 내용은 이벤트 페이지를 참고해주세요.</Description>

        <ConfirmButton onClick={closeModal}>닫기</ConfirmButton>
      </ContentWrapper>
    </Container>
  );
};

export default NoticeModal;

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
