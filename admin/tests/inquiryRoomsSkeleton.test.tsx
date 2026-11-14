import { ThemeProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { screen } from '@testing-library/dom';
import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getInquiryCategories } from '../src/apis/inquiries/inquiryCategories.api';
import { getInquiryRooms } from '../src/apis/inquiries/inquiryRooms.api';
import { getMembers } from '../src/apis/members/members.api';
import { Route } from '../src/routes/_admin/inquiries/rooms';
import { theme } from '../src/styles/theme';
import type { ReactNode } from 'react';

vi.mock('../src/components/Layout', () => ({
  Layout: ({ children }: { children: ReactNode }) => <main>{children}</main>,
}));
vi.mock('../src/apis/inquiries/inquiryRooms.api', () => ({
  getInquiryRooms: vi.fn(),
  getInquiryRoomDetail: vi.fn(),
  assignInquiryRoom: vi.fn(),
  updateInquiryRoomStatus: vi.fn(),
  updateInquiryRoomCategory: vi.fn(),
}));
vi.mock('../src/apis/inquiries/inquiryCategories.api', () => ({
  getInquiryCategories: vi.fn(),
}));
vi.mock('../src/apis/members/members.api', () => ({
  getMembers: vi.fn(),
}));

const clients: QueryClient[] = [];

const renderPage = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  clients.push(client);
  const Page = Route.options.component!;
  render(
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={client}>
        <Page />
      </QueryClientProvider>
    </ThemeProvider>,
  );
};

beforeEach(() => {
  vi.mocked(getInquiryRooms).mockReset();
  vi.mocked(getInquiryCategories).mockReset();
  vi.mocked(getMembers).mockReset();
});

afterEach(() => {
  cleanup();
  clients.splice(0).forEach((client) => client.clear());
});

describe('문의 채팅방 화면', () => {
  it('목록을 불러오는 동안 골격 화면을 보여준다', () => {
    // 응답이 오지 않는 상태로 두어 Suspense fallback이 유지되게 한다.
    vi.mocked(getInquiryRooms).mockReturnValue(new Promise(() => {}));
    vi.mocked(getInquiryCategories).mockReturnValue(new Promise(() => {}));
    vi.mocked(getMembers).mockReturnValue(new Promise(() => {}));

    renderPage();

    expect(
      screen.getByRole('status', { name: '문의 목록 불러오는 중' }),
    ).toBeTruthy();
    expect(screen.queryByText('로딩 중...')).toBeNull();
  });
});
