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

  const getNoticeTitle = () => {
    if (noticeType === EVENT_STATUS_TYPE.notStarted) {
      return '이벤트 기간이 아니에요.';
    }

    return noticeType === EVENT_STATUS_TYPE.ended
      ? '이벤트가 종료되었어요.'
      : '이벤트를 신청할 수 없습니다.';
  };

  return (
    <Container>
      <ContentWrapper>
        <Title device={device}>{getNoticeTitle()}</Title>

        {noticeType === EVENT_STATUS_TYPE.unknownError ? (
          <Description>
            자세한 내용은 이벤트 페이지를 참고해주세요.{' '}
          </Description>
        ) : (
          <Description>
            <HighLight>2월 23일 오후 2시</HighLight>에 이벤트가 시작돼요!{' '}
          </Description>
        )}

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
    theme.fonts.heading4};
  text-align: center;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.heading5};
  font-weight: 400;
  text-align: center;
`;

const ConfirmButton = styled(Button)`
  width: 100%;
  max-width: 200px;

  font: ${({ theme }) => theme.fonts.body1};
`;

const HighLight = styled.strong`
  color: ${({ theme }) => theme.colors.primary};
`;
