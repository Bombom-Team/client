import { ENV } from '@/apis/env';
import type { OAuthProvider } from '@bombom/shared/types';

interface NavigateToOAuthLoginOptions {
  provider: OAuthProvider;
  redirectPath?: string;
}

const isAbsoluteUrl = (value: string) =>
  value.startsWith('http://') || value.startsWith('https://');

export const navigateToOAuthLogin = ({
  provider,
  redirectPath,
}: NavigateToOAuthLoginOptions): void => {
  const fullUrl =
    redirectPath && isAbsoluteUrl(redirectPath)
      ? redirectPath
      : `${window.location.origin}${redirectPath ?? ''}`;

  const query = `?redirectUrl=${encodeURIComponent(fullUrl)}`;
  window.location.href = `${ENV.baseUrl}/auth/login/${provider}${query}`;
};

export const getRedirectPathFromSearch = (search: string) => {
  const redirectPath = new URLSearchParams(search).get('redirect');

  return redirectPath ?? undefined;
};
