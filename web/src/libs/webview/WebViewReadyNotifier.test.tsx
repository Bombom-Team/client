import { isWebView, sendMessageToRN } from '@bombom/shared/ui-web';
import { render } from '@testing-library/react';
import WebViewReadyNotifier from './WebViewReadyNotifier';
import { useAuth } from '@/contexts/AuthContext';

jest.mock('@bombom/shared/ui-web', () => ({
  isWebView: jest.fn(),
  sendMessageToRN: jest.fn(),
}));
jest.mock('@/contexts/AuthContext', () => ({ useAuth: jest.fn() }));

const mockAuth = (isLoading: boolean) => {
  jest.mocked(useAuth).mockReturnValue({
    isLoading,
    isLoggedIn: false,
    userProfile: undefined,
  });
};

describe('웹 준비 신호', () => {
  beforeEach(() => {
    jest.mocked(sendMessageToRN).mockReset();
    jest.mocked(isWebView).mockReturnValue(true);
  });

  it('프로필을 조회하는 중이면 준비 신호를 보내지 않는다', () => {
    mockAuth(true);

    render(<WebViewReadyNotifier />);

    expect(sendMessageToRN).not.toHaveBeenCalled();
  });

  it('프로필 조회가 끝나면 준비 신호를 한 번 보낸다', () => {
    mockAuth(true);
    const { rerender } = render(<WebViewReadyNotifier />);

    mockAuth(false);
    rerender(<WebViewReadyNotifier />);

    expect(sendMessageToRN).toHaveBeenCalledTimes(1);
    expect(sendMessageToRN).toHaveBeenCalledWith({ type: 'WEB_READY' });
  });

  it('WebView 밖에서 열리면 준비 신호를 보내지 않는다', () => {
    jest.mocked(isWebView).mockReturnValue(false);
    mockAuth(false);

    render(<WebViewReadyNotifier />);

    expect(sendMessageToRN).not.toHaveBeenCalled();
  });
});
