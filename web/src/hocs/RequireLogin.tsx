import PageLayout from '@/components/PageLayout/PageLayout';
import RequireLoginCard from '@/components/RequireLoginCard/RequireLoginCard';
import { useAuth } from '@/contexts/AuthContext';
import type { PropsWithChildren } from 'react';

const RequireLogin = ({ children }: PropsWithChildren) => {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return (
      <PageLayout>
        <RequireLoginCard />
      </PageLayout>
    );
  }

  return <>{children}</>;
};

export default RequireLogin;
