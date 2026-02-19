import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import useNotificationSettingsMutation from './hooks/useNotificationSettingsMutation';
import { queries } from '@/apis/queries';
import ChevronIcon from '@/components/icons/ChevronIcon';
import { useAuth } from '@/contexts/AuthContext';
import { useWebViewDeviceUuid } from '@/libs/webview/useWebViewDeviceUuid';
import { useWebViewNotificationPermission } from '@/libs/webview/useWebViewNotificationPermission';
import { sendMessageToRN } from '@/libs/webview/webview.utils';
import InfoIcon from '#/assets/svg/info-circle.svg';

const NotificationSettingsSection = () => {
  const { userProfile } = useAuth();
  const deviceUuid = useWebViewDeviceUuid();
  const memberId = userProfile?.id ?? 0;
  const { hasPermission } = useWebViewNotificationPermission();

  const { data: notificationStatus } = useQuery(
    queries.notificationSettings({
      memberId,
      deviceUuid,
    }),
  );

  const { mutate: updateNotificationSettings } =
    useNotificationSettingsMutation({
      memberId,
      deviceUuid,
    });

  const handleToggleNotificationClick = () => {
    updateNotificationSettings(!notificationStatus);
  };

  const openSystemSettings = () => {
    sendMessageToRN({ type: 'SHOW_NOTIFICATION_PERMISSION_SETTING' });
  };

  return (
    <Container>
      {hasPermission === false && (
        <GoToDeviceSettingSection onClick={openSystemSettings}>
          <InfoText>
            <InfoIcon width={24} height={24} />
            알림을 수신하려면 앱 설정에서 알림 권한을 허용해 주세요.
          </InfoText>

          <SubInfoText>
            앱 설정 열기
            <ChevronIcon
              direction="right"
              width={20}
              height={20}
              fill={theme.colors.black}
            />
          </SubInfoText>
        </GoToDeviceSettingSection>
      )}
      <SettingOption>
        <SettingLabel>새로운 아티클 알림 받기</SettingLabel>
        <ToggleButton
          type="button"
          onClick={handleToggleNotificationClick}
          disabled={!hasPermission}
        >
          <ToggleTrack enabled={notificationStatus ?? false}>
            <ToggleThumb enabled={notificationStatus ?? false} />
          </ToggleTrack>
        </ToggleButton>
      </SettingOption>
    </Container>
  );
};

export default NotificationSettingsSection;

const Container = styled.div`
  width: 100%;

  display: flex;
  gap: 24px;
  flex-direction: column;
`;

const SettingOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: ${({ theme }) => theme.colors.white};
`;

const SettingLabel = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body1};
`;

const ToggleButton = styled.button<{ disabled?: boolean }>`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: opacity 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.8;
  }

  &:active:not(:disabled) {
    opacity: 0.6;
  }
`;

const ToggleTrack = styled.div<{ enabled: boolean }>`
  position: relative;
  width: 51px;
  height: 31px;
  border-radius: 16px;

  background-color: ${({ theme, enabled }) =>
    enabled ? theme.colors.primary : theme.colors.disabledText};

  transition: background-color 0.3s;
`;

const ToggleThumb = styled.div<{ enabled: boolean }>`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%);

  background-color: ${({ theme }) => theme.colors.white};

  transform: translateX(${({ enabled }) => (enabled ? '20px' : '0')});
  transition: transform 0.3s;
`;

const GoToDeviceSettingSection = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.primaryInfo};
  border-radius: 8px;

  display: flex;
  gap: 4px;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
`;

const InfoText = styled.p`
  display: flex;
  gap: 4px;

  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body1};
  text-align: left;
`;

const SubInfoText = styled.span`
  display: flex;
  align-items: center;
  align-self: flex-end;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body1};
`;
