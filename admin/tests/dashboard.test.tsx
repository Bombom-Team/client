import { ThemeProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { screen, waitFor, within } from '@testing-library/dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import entryHtml from '../index.html?raw';
import { getDashboardStats } from '../src/apis/dashboard/dashboard.api';
import { Route } from '../src/routes/_admin/index';
import { theme } from '../src/styles/theme';
import type { ReactNode } from 'react';

// 인증/메뉴 shell은 범위 밖이며, 실제 페이지와 QueryClient의 상태 전이를 검증한다.
vi.mock('../src/components/Layout', () => ({
  Layout: ({ children }: { children: ReactNode }) => <main>{children}</main>,
}));
vi.mock('../src/apis/dashboard/dashboard.api', () => ({
  getDashboardStats: vi.fn(),
}));

const stats = {
  totalMembers: 4218,
  totalNotices: 6,
  dailyJoinedMembers: 12,
  weeklyJoinedMembers: 78,
  monthlyJoinedMembers: 187,
  yearlyJoinedMembers: 1486,
  withdrawnMembersThisMonth: 9,
  todayActiveMembers: 136,
};
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
  return client;
};

beforeEach(() => {
  vi.mocked(getDashboardStats).mockReset();
});
afterEach(() => {
  cleanup();
  clients.splice(0).forEach((client) => client.clear());
});

describe('회원 대시보드', () => {
  it('SEED 기본 CSS가 다른 관리 화면을 시스템 다크 모드로 바꾸지 않는다', () => {
    const entry = new DOMParser().parseFromString(entryHtml, 'text/html');
    expect(entry.documentElement.getAttribute('data-seed-color-mode')).toBe(
      'light-only',
    );
  });

  it('최초 조회 중에는 회원 수를 0으로 표시하지 않는다', () => {
    vi.mocked(getDashboardStats).mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByRole('status').textContent).toContain('불러오는 중');
    expect(screen.queryByText('0')).toBeNull();
  });

  it('조회 실패 후 재시도하면 실제 집계 값이 표시된다', async () => {
    vi.mocked(getDashboardStats)
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(stats);
    renderPage();
    expect((await screen.findByRole('alert')).textContent).toContain(
      '불러오지 못했어요',
    );
    expect(screen.queryByText('0')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(await screen.findByText('4,218')).toBeTruthy();
  });

  it('최근 7일 가입 합계와 하루 평균을 기간에 맞게 표시한다', async () => {
    vi.mocked(getDashboardStats).mockResolvedValue(stats);
    renderPage();
    const summary = await screen.findByRole('region', { name: '가입 현황' });
    expect(within(summary).getByText('최근 7일 가입')).toBeTruthy();
    expect(within(summary).getByText('78')).toBeTruthy();
    expect(within(summary).getByText('11.1')).toBeTruthy();
    expect(screen.queryByText('이번 주 신규 회원')).toBeNull();
  });

  it('0건과 응답에서 빠진 지표를 구분한다', async () => {
    vi.mocked(getDashboardStats).mockResolvedValue({
      ...stats,
      totalMembers: undefined,
      dailyJoinedMembers: 0,
    });
    renderPage();
    expect(await screen.findByText('집계 없음')).toBeTruthy();
    expect(screen.getByText('0')).toBeTruthy();
  });

  it('수동 갱신 실패 시 이전 값과 마지막 조회 시각을 보존한다', async () => {
    vi.mocked(getDashboardStats)
      .mockResolvedValueOnce(stats)
      .mockRejectedValueOnce(new Error('offline'));
    renderPage();
    await screen.findByText('4,218');
    const timestamp = screen.getByRole('time').getAttribute('datetime');
    fireEvent.click(screen.getByRole('button', { name: '새로고침' }));
    expect((await screen.findByRole('alert')).textContent).toContain(
      '이전 조회 결과',
    );
    expect(screen.getByText('4,218')).toBeTruthy();
    expect(screen.getByRole('time').getAttribute('datetime')).toBe(timestamp);
  });

  it('갱신 중 중복 클릭을 막고 요청을 한 번만 보낸다', async () => {
    vi.mocked(getDashboardStats)
      .mockResolvedValueOnce(stats)
      .mockReturnValueOnce(new Promise(() => {}));
    renderPage();
    await screen.findByText('4,218');
    fireEvent.click(screen.getByRole('button', { name: '새로고침' }));
    const button = await screen.findByRole('button', { name: '갱신 중' });
    await waitFor(() =>
      expect((button as HTMLButtonElement).disabled).toBe(true),
    );
    fireEvent.click(button);
    expect(getDashboardStats).toHaveBeenCalledTimes(2);
  });
});
