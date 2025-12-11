import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { queries } from '@/apis/queries';
import { useAuth } from '@/contexts/AuthContext';

export const useInitializeAuth = () => {
  const { updateAuthState } = useAuth();
  const queryClient = useQueryClient();
  const userInfo = queryClient.getQueryData(queries.userProfile().queryKey);

  useEffect(() => {
    updateAuthState(userInfo ?? null);
  }, [userInfo, updateAuthState]);
};
