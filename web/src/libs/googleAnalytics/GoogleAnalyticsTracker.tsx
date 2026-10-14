import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { trackPendingSignUp } from '@/libs/googleAnalytics/retentionEvents';
import usePageTracking from '@/libs/googleAnalytics/usePageTracking';

const GoogleAnalyticsTracker = () => {
  const { userProfile, isLoading } = useAuth();
  const userId = userProfile?.id;

  usePageTracking({
    enabled: !isLoading,
    userId,
  });

  useEffect(() => {
    if (isLoading || userId === undefined) return;

    trackPendingSignUp();
  }, [isLoading, userId]);

  return null;
};

export default GoogleAnalyticsTracker;
