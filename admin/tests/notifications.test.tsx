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
    expect(row.getByText('12')).toBeTruthy();
    expect(screen.queryByText('기기 전송 성공')).toBeNull();
    fireEvent.click(row.getByRole('button', { name: '아티클 도착 상세 보기' }));
    const detail = within(
      document.getElementById('notification-detail-ARTICLE')!,
    );
    expect(detail.getByText('9분')).toBeTruthy();
    expect(detail.getByText('1,530건')).toBeTruthy();
    expect(detail.getByText('22건')).toBeTruthy();
    expect(detail.getByText('FCM 토큰 없음 · 9건')).toBeTruthy();
    expect(row.getByRole('button').getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(row.getByRole('button', { name: '아티클 도착 상세 접기' }));
    expect(screen.queryByText('기기 전송 성공')).toBeNull();
    expect(row.getByRole('button').getAttribute('aria-expanded')).toBe('false');
  });

  it('토픽 발송 카테고리는 근사 열림률로 표시하고 회원별 발송 결과를 0으로 채우지 않는다', async () => {
    vi.mocked(getNotificationStats).mockResolvedValue(stats);
    renderPage();
    await screen.findByRole('table');
    const row = within(getCategoryRow('이벤트'));
    expect(row.getByText('토픽 발송')).toBeTruthy();
    expect(row.getByText('≈ 2%')).toBeTruthy();
    expect(row.getAllByText('—')).toHaveLength(2);
    fireEvent.click(row.getByRole('button', { name: '이벤트 상세 보기' }));
    expect(
      screen.getByText(
        '토픽 발송은 회원별 발송·기기 전송 결과를 집계하지 않아요.',
      ),
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
    fireEvent.click(row.getByRole('button', { name: '아티클 도착 상세 보기' }));
    const detail = within(
      document.getElementById('notification-detail-ARTICLE')!,
    );
    expect(detail.getByText('미집계')).toBeTruthy();
  });

  it('열림이 기록되지 않는 카테고리는 0%로 표시하지 않는다', async () => {
    vi.mocked(getNotificationStats).mockResolvedValue(stats);
    renderPage();
    await screen.findByRole('table');
    const row = within(getCategoryRow('챌린지 시작'));
    expect(row.getByText('열림 미수집')).toBeTruthy();
    expect(row.queryByText('0%')).toBeNull();
  });

  it('요약 열림률은 열림이 기록되지 않는 카테고리의 발송을 분모에서 뺀다', async () => {
    vi.mocked(getNotificationStats).mockResolvedValue({
      ...stats,
      categories: [
        memberCategory({}),
        memberCategory({
          category: 'CHALLENGE_TODO_REMINDER',
          statusCounts: {
            PENDING: 0,
            SENT: 800,
            FAILED: 0,
            DEAD: 0,
            SKIPPED: 0,
          },
          opens: { linked: 0, uniqueLinked: 0, unlinked: 0 },
          openRate: 0,
        }),
      ],
    });
    renderPage();
    const summary = await screen.findByLabelText('기간 요약');
    expect(within(summary).getByText('15%')).toBeTruthy();
    expect(within(summary).getByText('1,200')).toBeTruthy();
    expect(within(summary).getByText('180')).toBeTruthy();
    expect(within(summary).getByText('2,000건')).toBeTruthy();
  });

  it('열림률 차트는 측정된 카테고리를 열림률 순으로 놓고 근사치를 구분한다', async () => {
    vi.mocked(getNotificationStats).mockResolvedValue({
      ...stats,
      categories: [
        stats.categories[1],
        memberCategory({}),
        memberCategory({
          category: 'INQUIRY_MESSAGE_ARRIVAL',
          openRate: 0.7,
        }),
      ],
    });
    renderPage();
    const chart = await screen.findByRole('region', {
      name: '카테고리별 열림률',
    });
    const names = within(
      within(chart).getByRole('list', { name: '회원별 알림 열림률' }),
    )
      .getAllByRole('listitem')
      .map((item) => item.textContent ?? '');
    expect(names[0]).toContain('문의 답변 도착');
    expect(names[1]).toContain('아티클 도착');
    expect(names).toHaveLength(2);
    expect(within(chart).getByText('≈ 2%')).toBeTruthy();
    expect(within(chart).getByText(/수신 동의 3,900명/)).toBeTruthy();
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

  it('직접 선택한 날짜 범위로 다시 조회한다', async () => {
    vi.mocked(getNotificationStats).mockResolvedValue(stats);
    renderPage();
    await screen.findByRole('table');
    fireEvent.change(screen.getByLabelText('시작일'), {
      target: { value: '2026-10-01' },
    });
    fireEvent.change(screen.getByLabelText('종료일'), {
      target: { value: '2026-10-15' },
    });
    await vi.waitFor(() =>
      expect(getNotificationStats).toHaveBeenLastCalledWith({
        from: '2026-10-01',
        to: '2026-10-15',
      }),
    );
  });

  it('조회할 수 없는 날짜 범위는 이유를 알리고 요청하지 않는다', async () => {
    vi.mocked(getNotificationStats).mockResolvedValue(stats);
    renderPage();
    await screen.findByRole('table');
    fireEvent.change(screen.getByLabelText('시작일'), {
      target: { value: '2025-01-01' },
    });
    expect(screen.getByText('조회 기간은 최대 90일이에요.')).toBeTruthy();
    expect(getNotificationStats).toHaveBeenCalledTimes(1);
  });

  it('열림률 막대는 고유 열림과 발송을 표시하고 미열림을 추정하지 않는다', async () => {
    vi.mocked(getNotificationStats).mockResolvedValue(stats);
    renderPage();
    const chart = await screen.findByRole('region', {
      name: '카테고리별 열림률',
    });
    const article = within(
      within(chart).getByRole('list', { name: '회원별 알림 열림률' }),
    )
      .getAllByRole('listitem')
      .find((item) => item.textContent?.includes('아티클 도착'));
    expect(article?.textContent).toContain('180 / 1,200건');
    expect(within(chart).queryByText(/안 열림/)).toBeNull();
  });

  it('일별 추이는 기본으로 열림이 기록되는 회원 발송 카테고리를 합친다', async () => {
    vi.mocked(getNotificationStats).mockResolvedValue({
      ...stats,
      categories: [
        memberCategory({}),
        stats.categories[1],
        memberCategory({ category: 'INQUIRY_MESSAGE_ARRIVAL' }),
      ],
      daily: [
        { date: '2026-11-25', category: 'ARTICLE', sent: 100, opened: 10 },
        { date: '2026-11-25', category: 'EVENT', sent: null, opened: 7 },
        {
          date: '2026-11-25',
          category: 'INQUIRY_MESSAGE_ARRIVAL',
          sent: 4,
          opened: 3,
        },
      ],
    });
    renderPage();
    const trend = await screen.findByRole('region', { name: '일별 추이' });
    const row = within(trend).getByRole('rowheader', {
      name: '2026-11-25',
    }).parentElement!;
    expect(row.textContent).toContain('104');
    expect(row.textContent).toContain('13');
    expect(row.textContent).toContain('12.5%');
  });

  it('일별 추이에서 토픽·챌린지 카테고리를 고르면 열림률을 그리지 않는 이유를 알린다', async () => {
    vi.mocked(getNotificationStats).mockResolvedValue({
      ...stats,
      daily: [
        { date: '2026-11-25', category: 'ARTICLE', sent: 100, opened: 10 },
        { date: '2026-11-25', category: 'EVENT', sent: null, opened: 7 },
        { date: '2026-11-25', category: 'CHALLENGE_START', sent: 9, opened: 0 },
      ],
    });
    renderPage();
    const trend = await screen.findByRole('region', { name: '일별 추이' });
    const select = within(trend).getByLabelText('카테고리');
    fireEvent.change(select, { target: { value: 'EVENT' } });
    expect(
      within(trend).getByText(
        '토픽 발송이라 날짜별 발송 수가 없어 열림률을 계산하지 않아요.',
      ),
    ).toBeTruthy();
    fireEvent.change(select, { target: { value: 'CHALLENGE_START' } });
    expect(
      within(trend).getByText(
        '챌린지 알림은 열림이 기록되지 않아 열림률을 그리지 않아요.',
      ),
    ).toBeTruthy();
  });

  it('일별 데이터가 없는 응답이면 0으로 채우지 않고 안내한다', async () => {
    vi.mocked(getNotificationStats).mockResolvedValue(stats);
    renderPage();
    const trend = await screen.findByRole('region', { name: '일별 추이' });
    expect(
      within(trend).getByText(
        '일별 데이터를 아직 받지 못했어요. 알림 서버를 배포하면 표시돼요.',
      ),
    ).toBeTruthy();
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
