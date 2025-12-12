import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { queries } from '@/apis/queries';
import { useAuth } from '@/contexts/AuthContext';

export const useInitializeAuth = () => {
  const { updateAuthState } = useAuth();
  const queryClient = useQueryClient();
  const userProfile = queryClient.getQueryData(queries.userProfile().queryKey);

  useEffect(() => {
    updateAuthState(userProfile ?? null);
  }, [userProfile, updateAuthState]);
};
