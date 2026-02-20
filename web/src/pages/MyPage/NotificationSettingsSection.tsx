import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import useNotificationSettingMutation from './hooks/useNotificationSettingMutation';
import { queries } from '@/apis/queries';
import Divider from '@/components/Divider/Divider';
import ChevronIcon from '@/components/icons/ChevronIcon';
import Text from '@/components/Text';
import { useAuth } from '@/contexts/AuthContext';
import { useWebViewNotificationPermission } from '@/libs/webview/useWebViewNotificationPermission';
import { sendMessageToRN } from '@/libs/webview/webview.utils';
import InfoIcon from '#/assets/svg/info-circle.svg';

const NotificationSettingsSection = () => {
  const { userProfile } = useAuth();
  const memberId = userProfile?.id ?? 0;
  const { hasPermission } = useWebViewNotificationPermission();

  const { data: articleNotification } = useQuery({
    ...queries.notificationSettings.category({
      memberId,
      category: 'article',
    }),
    enabled: !!hasPermission,
  });

  const { data: eventNotification } = useQuery({
    ...queries.notificationSettings.category({
      memberId,
      category: 'event',
    }),
    enabled: !!hasPermission,
  });

  const { mutate: updateNotificationSetting } = useNotificationSettingMutation({
    memberId,
  });

  const openSystemSettings = () => {
    sendMessageToRN({ type: 'SHOW_NOTIFICATION_PERMISSION_SETTING' });
  };

  const toggleArticleNotification = () => {
    if (hasPermission) {
      updateNotificationSetting({
        enabled: !articleNotification?.enabled,
        category: 'article',
      });
    } else {
      openSystemSettings();
    }
  };

  const toggleEventNotification = () => {
    if (hasPermission) {
      updateNotificationSetting({
        enabled: !eventNotification?.enabled,
        category: 'event',
      });
    } else {
      openSystemSettings();
    }
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

      <SettingSection>
        <SectionHeader>
          <Text font="body2" color="textSecondary">
            * 알림 설정은 계정과 연동돼요.
          </Text>
        </SectionHeader>

        <SettingCard hasPermission={!!hasPermission}>
          <SettingRow>
            <SettingInfo>
              <SettingLabel>아티클 알림</SettingLabel>
              <SettingHint>새로운 아티클 도착 시 알림</SettingHint>
            </SettingInfo>
            <ToggleButton type="button" onClick={toggleArticleNotification}>
              <ToggleTrack enabled={articleNotification?.enabled ?? false}>
                <ToggleThumb enabled={articleNotification?.enabled ?? false} />
              </ToggleTrack>
            </ToggleButton>
          </SettingRow>

          <Divider />

          <SettingRow>
            <SettingInfo>
              <SettingLabel>이벤트 알림</SettingLabel>
              <SettingHint>이벤트 및 프로모션 알림</SettingHint>
            </SettingInfo>
            <ToggleButton type="button" onClick={toggleEventNotification}>
              <ToggleTrack enabled={eventNotification?.enabled ?? false}>
                <ToggleThumb enabled={eventNotification?.enabled ?? false} />
              </ToggleTrack>
            </ToggleButton>
          </SettingRow>
        </SettingCard>
      </SettingSection>
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

const SettingSection = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const SectionHeader = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const SettingCard = styled.div<{ hasPermission: boolean }>`
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 4%);

  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};

  opacity: ${({ hasPermission }) => (hasPermission ? 1 : 0.6)};
`;

const SettingRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
`;

const SettingInfo = styled.div`
  display: flex;
  gap: 4px;
  flex: 1;
  flex-direction: column;
`;

const SettingLabel = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body1};
`;

const SettingHint = styled.p`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body3};
`;

const ToggleButton = styled.button<{ disabled?: boolean }>`
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: opacity 0.2s;
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
