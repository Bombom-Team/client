import { useQuery } from '@tanstack/react-query';
import { queries } from '@/apis/queries';
import { useAuth } from '@/contexts/AuthContext';
import useNotificationSettingMutation from '@/pages/MyPage/hooks/useNotificationSettingMutation';

const useEventNotification = () => {
  const { userProfile } = useAuth();
  const memberId = userProfile?.id ?? 0;

  const { data: notificationEnabled, isLoading } = useQuery({
    ...queries.notificationSettings.category({
      memberId,
      category: 'event',
    }),
  });

  const { mutate: updateNotificationSetting, isPending } =
    useNotificationSettingMutation({
      memberId,
    });

  const enableEventNotification = () => {
    updateNotificationSetting({ enabled: true, category: 'event' });
  };

  return {
    notificationEnabled,
    isLoading,
    isPending,
    enableEventNotification,
  };
};

export default useEventNotification;
