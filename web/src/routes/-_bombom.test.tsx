import { useNavigate, useRouterState } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import { Route } from './_bombom';
import { useAuth } from '@/contexts/AuthContext';
import type { PropsWithChildren } from 'react';

jest.mock('@tanstack/react-router', () => ({
  ...jest.requireActual('@tanstack/react-router'),
  Outlet: () => <p>페이지 본문</p>,
  useNavigate: jest.fn(),
  useRouterState: jest.fn(),
}));
jest.mock('@/contexts/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('@/libs/webview/useWebViewRegisterToken', () => ({
  useWebViewRegisterToken: jest.fn(),
}));
jest.mock('@/components/PageLayout/BomBomPageLayout', () => ({
  __esModule: true,
  default: ({ children }: PropsWithChildren) => (
    <>
      공통 레이아웃
      {children}
    </>
  ),
}));
jest.mock('@/components/ChallengeStartModal/ChallengeStartModal', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@/components/AppInstallPromptModal/AppInstallPromptModal', () => ({
  __esModule: true,
  default: () => null,
}));

const NAVIGATE = jest.fn();
const ROUTER_STATE = useRouterState as jest.Mock;
const Component = Route.options.component;
if (!Component) throw new Error('라우트 컴포넌트가 없습니다.');

describe('봄봄 첫 화면', () => {
  beforeEach(() => {
    NAVIGATE.mockReset();
    jest.mocked(useNavigate).mockReturnValue(NAVIGATE);
    ROUTER_STATE.mockReturnValue('/');
    jest.mocked(useAuth).mockReturnValue({
      isLoading: true,
      isLoggedIn: false,
      userProfile: undefined,
    });
  });

  it('홈에서 프로필 조회 중이면 레이아웃과 본문을 먼저 표시한다', () => {
    render(<Component />);

    expect(
      screen.queryByText('공통 레이아웃', { exact: false }),
    ).not.toBeNull();
    expect(screen.queryByText('페이지 본문')).not.toBeNull();
    expect(NAVIGATE).not.toHaveBeenCalled();
    expect(Route.options.beforeLoad).toBeUndefined();
  });

  it('고객센터에서 프로필 조회 중이면 본문을 먼저 표시한다', () => {
    ROUTER_STATE.mockReturnValue('/support');
    render(<Component />);

    expect(screen.queryByText('페이지 본문')).not.toBeNull();
    expect(NAVIGATE).not.toHaveBeenCalled();
  });

  it('로그인 확인이 필요한 경로에서는 레이아웃을 먼저 표시하고 인증 결과를 기다린다', () => {
    ROUTER_STATE.mockReturnValue('/storage');
    const { rerender } = render(<Component />);

    expect(
      screen.queryByText('공통 레이아웃', { exact: false }),
    ).not.toBeNull();
    expect(screen.queryByText('페이지 본문')).toBeNull();
    expect(NAVIGATE).not.toHaveBeenCalled();

    jest.mocked(useAuth).mockReturnValue({
      isLoading: false,
      isLoggedIn: true,
      userProfile: { id: 1, nickname: '봄봄', email: 'test@example.com' },
    });
    rerender(<Component />);

    expect(screen.queryByText('페이지 본문')).not.toBeNull();
    expect(NAVIGATE).not.toHaveBeenCalled();
  });

  it('첫 로그인 확인이 실패하면 보호된 본문을 표시하지 않고 홈으로 이동한다', () => {
    ROUTER_STATE.mockReturnValue('/storage');
    const { rerender } = render(<Component />);
    jest.mocked(useAuth).mockReturnValue({
      isLoading: false,
      isLoggedIn: false,
      userProfile: undefined,
    });
    rerender(<Component />);

    expect(screen.queryByText('페이지 본문')).toBeNull();
    expect(NAVIGATE).toHaveBeenCalledWith({ to: '/', replace: true });
  });
});
