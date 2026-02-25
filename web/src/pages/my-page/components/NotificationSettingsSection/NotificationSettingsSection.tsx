import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useQueries } from '@tanstack/react-query';
import SettingCardList from './SettingCardList';
import { CATEGORY } from '../../constants/notification';
import useCategoryNotificationMutation from '../../hooks/useCategoryNotificationMutation';
import { queries } from '@/apis/queries';
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

  const notifications = useQueries({
    queries: Object.values(CATEGORY).map((category) => ({
      ...queries.notificationSettings.category({ memberId, category }),
      enabled: !!hasPermission,
    })),
  });

  const { mutate: updateCategoryNotification } =
    useCategoryNotificationMutation({
      memberId,
    });

  const openSystemSettings = () => {
    sendMessageToRN({ type: 'SHOW_NOTIFICATION_PERMISSION_SETTING' });
  };

  const toggleNotification = (category: string) => {
    if (hasPermission) {
      const currentEnabled = notifications.find(
        (notification) => notification.data?.category === category,
      )?.data?.enabled;

      updateCategoryNotification({
        enabled: !currentEnabled,
        category,
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

        <SettingCardList
          hasPermission={!!hasPermission}
          notifications={notifications}
          onToggle={toggleNotification}
        />
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
