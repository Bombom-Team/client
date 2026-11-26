import { ThemeProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { screen, within } from '@testing-library/dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getNotificationStats } from '../src/apis/notificationStats/notificationStats.api';
import { Route } from '../src/routes/_admin/notifications';
import { theme } from '../src/styles/theme';
import type {
  GetNotificationStatsResponse,
  NotificationCategoryStats,
} from '../src/apis/notificationStats/notificationStats.api';
import type { ReactNode } from 'react';

// 인증/메뉴 shell은 범위 밖이며, 실제 페이지와 QueryClient의 상태 전이를 검증한다.
vi.mock('../src/components/Layout', () => ({
  Layout: ({ children }: { children: ReactNode }) => <main>{children}</main>,
}));
vi.mock('../src/apis/notificationStats/notificationStats.api', () => ({
  getNotificationStats: vi.fn(),
}));

const memberCategory = (
  overrides: Partial<NotificationCategoryStats>,
): NotificationCategoryStats => ({
  category: 'ARTICLE',
  deliveryMode: 'MEMBER',
  statusCounts: { PENDING: 0, SENT: 1200, FAILED: 3, DEAD: 9, SKIPPED: 300 },
  failureReasons: [{ reason: 'FCM 토큰 없음', count: 9 }],
  deviceSends: { success: 1530, failure: 22 },
  opens: { linked: 210, uniqueLinked: 180, unlinked: 14 },
  openRate: 0.15,
  medianSecondsToOpen: 540,
  consentingMembers: 4100,
  ...overrides,
});

const stats: GetNotificationStatsResponse = {
  aggregatedAt: '2026-11-26T12:00:00Z',
  from: '2026-11-20',
  to: '2026-11-26',
  categories: [
    memberCategory({}),
    {
      category: 'EVENT',
      deliveryMode: 'TOPIC',
      statusCounts: null,
      failureReasons: [],
      deviceSends: null,
      opens: { linked: 95, uniqueLinked: 80, unlinked: 2 },
      openRate: 0.02,
      medianSecondsToOpen: null,
      consentingMembers: 3900,
    },
    memberCategory({
      category: 'CHALLENGE_START',
      statusCounts: { PENDING: 0, SENT: 0, FAILED: 0, DEAD: 0, SKIPPED: 0 },
      failureReasons: [],
      opens: { linked: 0, uniqueLinked: 0, unlinked: 0 },
      openRate: null,
      medianSecondsToOpen: null,
    }),
  ],
  reach: {
    membersWithToken: 5200,
    devicesWithToken: 6100,
    devicesOsPermissionGranted: 4300,
    devicesOsPermissionDenied: 600,
    devicesOsPermissionUnknown: 1200,
  },
  opensByPlatform: [
    { platform: 'IOS', count: 160 },
    { platform: 'ANDROID', count: 161 },
  ],
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
};

const getCategoryRow = (name: string) =>
  screen.getByRole('rowheader', { name: new RegExp(name) }).closest('tr')!;

beforeEach(() => {
  vi.mocked(getNotificationStats).mockReset();
});
afterEach(() => {
  cleanup();
  clients.splice(0).forEach((client) => client.clear());
});

describe('알림 현황', () => {
  it('회원별 발송 카테고리는 열림률과 발송 결과를 표시한다', async () => {
    vi.mocked(getNotificationStats).mockResolvedValue(stats);
    renderPage();
    await screen.findByRole('table');
    const row = within(getCategoryRow('아티클 도착'));
    expect(row.getByText('15%')).toBeTruthy();
    expect(row.getByText('1,200')).toBeTruthy();
    expect(row.getByText('9분')).toBeTruthy();
    expect(row.getByText('1,530 / 22')).toBeTruthy();
  });

  it('토픽 발송 카테고리는 근사 열림률로 표시하고 회원별 발송 결과를 0으로 채우지 않는다', async () => {
    vi.mocked(getNotificationStats).mockResolvedValue(stats);
    renderPage();
    await screen.findByRole('table');
    const row = within(getCategoryRow('이벤트'));
    expect(row.getByText('토픽 발송')).toBeTruthy();
    expect(row.getByText('≈ 2%')).toBeTruthy();
    expect(
      row.getByText('토픽 1회 발송이라 회원별 결과가 없어요'),
    ).toBeTruthy();
  });

  it('수신 거부 기록이 없는 카테고리의 스킵은 0건으로 표시하지 않는다', async () => {
    vi.mocked(getNotificationStats).mockResolvedValue({
      ...stats,
      categories: [
        memberCategory({
          statusCounts: {
            PENDING: 0,
            SENT: 1200,
            FAILED: 3,
            DEAD: 9,
            SKIPPED: 0,
          },
        }),
      ],
    });
    renderPage();
    await screen.findByRole('table');
    const row = within(getCategoryRow('아티클 도착'));
    expect(row.getByText('집계 안 됨')).toBeTruthy();
  });

  it('열림률을 계산할 수 없으면 0%로 표시하지 않는다', async () => {
    vi.mocked(getNotificationStats).mockResolvedValue(stats);
    renderPage();
    await screen.findByRole('table');
    const row = within(getCategoryRow('챌린지 시작'));
    expect(row.getByText('계산 불가')).toBeTruthy();
    expect(row.queryByText('0%')).toBeNull();
  });

  it('기간을 30일로 바꾸면 서울 날짜 기준 30일 범위로 다시 조회한다', async () => {
    vi.mocked(getNotificationStats).mockResolvedValue(stats);
    renderPage();
    await screen.findByRole('table');
    fireEvent.click(screen.getByRole('button', { name: '30일' }));
    await vi.waitFor(() =>
      expect(getNotificationStats).toHaveBeenCalledTimes(2),
    );
    const [first, second] = vi
      .mocked(getNotificationStats)
      .mock.calls.map(([params]) => params);
    expect(second.to).toBe(first.to);
    expect((Date.parse(second.to) - Date.parse(second.from)) / 86_400_000).toBe(
      29,
    );
    expect((Date.parse(first.to) - Date.parse(first.from)) / 86_400_000).toBe(
      6,
    );
  });

  it('기기 OS 알림 권한을 미보고 기기까지 나눠 표시한다', async () => {
    vi.mocked(getNotificationStats).mockResolvedValue(stats);
    renderPage();
    const reach = await screen.findByRole('region', {
      name: '도달 모수와 기기',
    });
    expect(
      within(reach).getByRole('img', { name: /기기 OS 알림 권한/ }),
    ).toBeTruthy();
    expect(within(reach).getByText('미보고(구버전 앱)')).toBeTruthy();
    expect(within(reach).getByText('1,200대 · 20%')).toBeTruthy();
  });

  it('최초 조회에 실패하면 설정 확인 안내와 다시 시도 버튼을 표시한다', async () => {
    vi.mocked(getNotificationStats)
      .mockRejectedValueOnce(new Error('401'))
      .mockResolvedValueOnce(stats);
    renderPage();
    expect((await screen.findByRole('alert')).textContent).toContain(
      '어드민 키',
    );
    fireEvent.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(await screen.findByRole('table')).toBeTruthy();
  });
});
