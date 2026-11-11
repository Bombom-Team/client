import { theme } from '@bombom/shared/theme';
import { useDevice } from '@bombom/shared/ui-web';
import { ThemeProvider } from '@emotion/react';
import { useQuery } from '@tanstack/react-query';
import { useMatchRoute } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import InquiryFloatingButton from './InquiryFloatingButton';

jest.mock('@bombom/shared/env', () => ({
  ENV: { baseUrl: 'https://api.example.com' },
}));
jest.mock('@bombom/shared/ui-web', () => ({
  useDevice: jest.fn(),
}));
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
}));
jest.mock('@tanstack/react-router', () => ({
  useMatchRoute: jest.fn(),
  Link: ({ children, ...props }: { children: React.ReactNode; to: string }) => (
    <a {...props}>{children}</a>
  ),
}));

const BUTTON_LABEL = '1:1 채팅 문의';

/**
 * `$param` 자리를 실제 경로 조각으로 바꿔 비교해, 라우터의 경로 매칭을 흉내낸다.
 * fuzzy는 접두사 일치, 그 외에는 전체 일치로 다룬다.
 */
const mockRouteMatch = (currentPath: string) => {
  const matchRoute = ({ to, fuzzy }: { to: string; fuzzy?: boolean }) => {
    const pattern = to.replace(/\$[^/]+/g, '[^/]+');
    const matcher = new RegExp(`^${pattern}${fuzzy ? '(/|$)' : '$'}`);

    return matcher.test(currentPath) ? {} : false;
  };

  jest.mocked(useMatchRoute).mockReturnValue(matchRoute as never);
};

const renderButton = ({
  device = 'pc',
  path = '/',
}: {
  device?: string;
  path?: string;
} = {}) => {
  jest.mocked(useDevice).mockReturnValue(device as never);
  jest
    .mocked(useQuery)
    .mockReturnValue({ data: { hasUnread: false } } as never);
  mockRouteMatch(path);

  return render(
    <ThemeProvider theme={theme}>
      <InquiryFloatingButton />
    </ThemeProvider>,
  );
};

describe('InquiryFloatingButton', () => {
  it('PC의 일반 화면에서는 문의 버튼을 노출한다.', () => {
    renderButton({ path: '/challenge' });

    expect(screen.queryByLabelText(BUTTON_LABEL)).not.toBeNull();
  });

  it('모바일에서는 문의 버튼을 노출하지 않는다.', () => {
    renderButton({ device: 'mobile', path: '/challenge' });

    expect(screen.queryByLabelText(BUTTON_LABEL)).toBeNull();
  });

  it('고객센터 화면에서는 진입점이 이미 있어 문의 버튼을 노출하지 않는다.', () => {
    renderButton({ path: '/support/inquiry' });

    expect(screen.queryByLabelText(BUTTON_LABEL)).toBeNull();
  });

  it('아티클 상세에서는 읽기 노트 패널과 겹쳐 문의 버튼을 노출하지 않는다.', () => {
    renderButton({ path: '/articles/123' });

    expect(screen.queryByLabelText(BUTTON_LABEL)).toBeNull();
  });

  it('가이드 상세에서는 읽기 노트 패널과 겹쳐 문의 버튼을 노출하지 않는다.', () => {
    renderButton({ path: '/articles/guide/5' });

    expect(screen.queryByLabelText(BUTTON_LABEL)).toBeNull();
  });
});
