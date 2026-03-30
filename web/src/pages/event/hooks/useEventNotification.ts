import { useQuery } from '@tanstack/react-query';
import { queries } from '@/apis/queries';
import { useAuth } from '@/contexts/AuthContext';
import useCategoryNotificationMutation from '@/pages/my-page/hooks/useCategoryNotificationMutation';

const useEventNotification = () => {
  const { userProfile } = useAuth();
  const memberId = userProfile?.id ?? 0;

  const { data: notificationEnabled } = useQuery({
    ...queries.notificationSettings.category({
      memberId,
      category: 'event',
    }),
  });

  const { mutate: updateNotificationSetting, isPending } =
    useCategoryNotificationMutation({
      memberId,
    });

  const enableEventNotification = () => {
    updateNotificationSetting({ enabled: true, category: 'event' });
  };

  return {
    notificationEnabled,
    isNotificationUpdating: isPending,
    enableEventNotification,
  };
};

export default useEventNotification;
