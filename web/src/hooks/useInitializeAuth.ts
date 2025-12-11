import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { queries } from '@/apis/queries';
import { useAuth } from '@/contexts/AuthContext';

export const useInitializeAuth = () => {
  const { updateAuthState } = useAuth();
  const { data: userInfo } = useQuery(queries.userProfile());

  useEffect(() => {
    updateAuthState(userInfo ?? null);
  }, [userInfo, updateAuthState]);
};
