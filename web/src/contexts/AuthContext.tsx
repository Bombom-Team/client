import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { UserInfo } from '@/types/me';
import type { PropsWithChildren } from 'react';

export interface AuthContextType {
  userProfile: UserInfo | null;
  isLoggedIn: boolean;
  updateAuthState: (profile: UserInfo | null) => void;
  isLoading: boolean;
  updateAuthLoading: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [userProfile, setUserProfile] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = useMemo(() => Boolean(userProfile), [userProfile]);

  const updateAuthState = useCallback((profile: UserInfo | null) => {
    setUserProfile(profile);
  }, []);

  const updateAuthLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userProfile,
        isLoggedIn,
        updateAuthState,
        isLoading,
        updateAuthLoading,
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
