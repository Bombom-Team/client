import styled from '@emotion/styled';
import useEventNotification from '../hooks/useEventNotification';
import { formatEventDateTime } from '../utils/date';
import useModal from '@/components/Modal/useModal';
import { useAuth } from '@/contexts/AuthContext';
import { useDevice } from '@/hooks/useDevice';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import { sendMessageToRN } from '@/libs/webview/webview.utils';
import QRCodeModal from '@/pages/recommend/components/QRCodeModal/QRCodeModal';
import { isWebView } from '@/utils/device';
import { downloadApp } from '@/utils/downloadApp';
import type { Device } from '@/hooks/useDevice';

const EventNotificationButton = () => {
  const { modalRef, closeModal, isOpen, openModal } = useModal();
  const { isLoggedIn } = useAuth();
  const device = useDevice();

  const {
    notificationEnabled,
    isNotificationUpdating,
    enableEventNotification,
  } = useEventNotification();

  const isAppEnvironment = isWebView();

  const enableNotificationInApp = () => {
    if (!isLoggedIn) {
      sendMessageToRN({
        type: 'SHOW_LOGIN_SCREEN',
      });
    } else {
      enableEventNotification();
    }
  };

  const enableNotificationInWeb = () => {
    if (device === 'pc') {
      openModal();
    } else {
      downloadApp();
    }
  };

  const handleNotificationButtonClick = () => {
    if (isAppEnvironment) {
      enableNotificationInApp();
    } else {
      enableNotificationInWeb();
    }

    trackEvent({
      category: 'Event',
      action: '이벤트 알림 받기 버튼 클릭',
      label: `${formatEventDateTime(new Date())} ${isAppEnvironment ? 'App' : 'Web'}`,
    });
  };

  const getButtonText = () => {
    if (isNotificationUpdating) return '로딩 중...';
    if (notificationEnabled) return '🔔 알림 설정 완료';
    if (!isAppEnvironment) return '🔔 앱 설치하고 알림 받기';

    return isLoggedIn ? '🔔 이벤트 알림 받기' : '🔔 로그인하고 알림 받기';
  };

  return (
    <>
      <Container
        type="button"
        device={device}
        onClick={handleNotificationButtonClick}
        disabled={!!notificationEnabled}
      >
        {getButtonText()}
      </Container>

      <QRCodeModal
        modalRef={modalRef}
        isOpen={isOpen}
        onClose={closeModal}
        storeType="all"
      />
    </>
  );
};

export default EventNotificationButton;

const Container = styled.button<{
  device: Device;
}>`
  padding: ${({ device }) =>
    device === 'mobile' ? '0.5rem 1rem' : '0.75rem 1.25rem'};
  border: 0.25rem solid ${({ theme }) => theme.colors.black};
  border-radius: 1.5rem;
  box-shadow: 0.25rem 0.25rem 0 0 ${({ theme }) => theme.colors.black};

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body1 : theme.fonts.bodyLarge};
  font-weight: 600;

  &:disabled {
    background-color: ${({ theme }) => theme.colors.white};
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    box-shadow: 0.375rem 0.375rem 0 0 ${({ theme }) => theme.colors.black};
    transform: translateY(-0.125rem);
  }
`;
