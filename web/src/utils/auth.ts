import { ENV } from '@/apis/env';

type OAuthProvider = 'google' | 'apple';

interface NavigateToOAuthLoginOptions {
  provider: OAuthProvider;
  redirectPath?: string;
}

export const navigateToOAuthLogin = ({
  provider,
  redirectPath,
}: NavigateToOAuthLoginOptions): void => {
  const currentOrigin = window.location.origin;
  const fullUrl = `${currentOrigin}${redirectPath ? redirectPath : ''}`;

  const query = `?redirectUrl=${encodeURIComponent(fullUrl)}`;
  window.location.href = `${ENV.baseUrl}/auth/login/${provider}${query}`;
};
