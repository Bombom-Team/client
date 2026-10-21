import { render, screen } from '@testing-library/react';
import LoginButton from './LoginButton';
import { useAuth } from '@/contexts/AuthContext';
import type { PropsWithChildren } from 'react';

jest.mock('@bombom/shared/ui-web', () => ({
  Button: ({ children }: PropsWithChildren) => (
    <button type="button">{children}</button>
  ),
}));
jest.mock('@/components/Button/Button', () => ({
  __esModule: true,
  default: ({ children }: PropsWithChildren) => (
    <button type="button">{children}</button>
  ),
}));
jest.mock('@tanstack/react-router', () => ({
  useNavigate: () => jest.fn(),
}));
jest.mock('@/contexts/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('@/libs/googleAnalytics/gaEvents', () => ({ trackEvent: jest.fn() }));

describe('로그인 버튼', () => {
  it('프로필 조회와 재시도가 진행 중이면 비로그인 표시를 보류한다', () => {
    jest.mocked(useAuth).mockReturnValue({
      isLoading: true,
      isLoggedIn: false,
      userProfile: undefined,
    });

    render(<LoginButton />);

    expect(screen.queryByRole('button', { name: '로그인' })).toBeNull();
  });

  it('프로필 조회가 끝나면 로그인 버튼을 표시한다', () => {
    jest.mocked(useAuth).mockReturnValue({
      isLoading: false,
      isLoggedIn: false,
      userProfile: undefined,
    });

    render(<LoginButton />);

    expect(screen.queryByRole('button', { name: '로그인' })).not.toBeNull();
  });
});
