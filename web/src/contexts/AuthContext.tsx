import { useQuery } from '@tanstack/react-query';
import { useRouterState } from '@tanstack/react-router';
import { createContext, useContext, useMemo } from 'react';
import { queries } from '@/apis/queries';
import type { UserProfile } from '@/types/me';
import type { PropsWithChildren } from 'react';

export interface AuthContextType {
  userProfile: UserProfile | undefined;
  isLoading: boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isSignupPage = pathname === '/signup';

  const { data: userProfile, isLoading } = useQuery({
    ...queries.userProfile(),
    enabled: !isSignupPage,
  });

  const isLoggedIn = useMemo(() => Boolean(userProfile), [userProfile]);

  return (
    <AuthContext.Provider
      value={{
        userProfile,
        isLoading,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
