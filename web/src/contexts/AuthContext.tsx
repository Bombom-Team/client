import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import type { components } from '@/types/openapi';
import type { PropsWithChildren } from 'react';

type UserProfile = components['schemas']['MemberProfileResponse'];

export interface AuthContextType {
  userProfile: UserProfile | null;
  isLoggedIn: boolean;
  updateAuthState: (profile: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const isLoggedIn = useMemo(() => Boolean(userProfile), [userProfile]);

  const updateAuthState = useCallback((profile: UserProfile | null) => {
    setUserProfile(profile);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userProfile,
        isLoggedIn,
        updateAuthState,
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
