import { ThemeProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { screen } from '@testing-library/dom';
import { cleanup, render } from '@testing-library/react';
import { Suspense } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getInquiryCategories } from '../src/apis/inquiries/inquiryCategories.api';
import { getInquiryRooms } from '../src/apis/inquiries/inquiryRooms.api';
import { getMembers } from '../src/apis/members/members.api';
import { InquiryRoomListPanel } from '../src/pages/inquiries/InquiryRoomListPanel';
import { theme } from '../src/styles/theme';
import type { InquiryRoom } from '../src/types/inquiry';

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

class NoopIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
vi.stubGlobal('IntersectionObserver', NoopIntersectionObserver);

const room = (overrides: Partial<InquiryRoom> = {}): InquiryRoom => ({
  id: 1,
  categoryId: 1,
  status: 'UNCONFIRMED',
  assigneeId: null,
  assigneeNickname: null,
  inquirerType: 'MEMBER',
  guestId: null,
  inquirerNickname: '봄봄이',
  inquirerEmail: 'bom@bombom.news',
  lastMessage: null,
  createdAt: '2026-11-01T09:00:00Z',
  closedAt: null,
  ...overrides,
});

const clients: QueryClient[] = [];

const renderPanel = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  clients.push(client);
  render(
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={client}>
        <Suspense fallback={<div>로딩 중</div>}>
          <InquiryRoomListPanel
            selectedRoomId={null}
            onSelectRoom={() => {}}
            onSelectedRoomChange={() => {}}
          />
        </Suspense>
      </QueryClientProvider>
    </ThemeProvider>,
  );
};

beforeEach(() => {
  vi.mocked(getInquiryRooms).mockReset();
  vi.mocked(getInquiryCategories).mockReset();
  vi.mocked(getMembers).mockReset();

  vi.mocked(getInquiryCategories).mockResolvedValue([
    { id: 1, name: '일반 문의' },
  ]);
  vi.mocked(getMembers).mockResolvedValue({
    content: [],
    number: 0,
    totalPages: 1,
    totalElements: 0,
    size: 100,
    first: true,
    last: true,
  } as Awaited<ReturnType<typeof getMembers>>);
});

afterEach(() => {
  cleanup();
  clients.splice(0).forEach((client) => client.clear());
});

const mockRooms = (rooms: InquiryRoom[]) => {
  vi.mocked(getInquiryRooms).mockResolvedValue({
    content: rooms,
    number: 0,
    totalPages: 1,
    totalElements: rooms.length,
    size: 20,
    first: true,
    last: true,
  } as Awaited<ReturnType<typeof getInquiryRooms>>);
};

describe('문의 목록', () => {
  it('회원과 비회원 모두 문의자 아바타를 붙인다', async () => {
    mockRooms([
      room({ id: 1, inquirerNickname: '봄봄이' }),
      room({
        id: 2,
        inquirerType: 'GUEST',
        inquirerNickname: null,
        inquirerEmail: null,
        guestId: '4034bc92-0138-4633-a534-8569b7b4c138',
      }),
    ]);

    renderPanel();

    expect(await screen.findByText('봄')).toBeTruthy();
    expect(screen.getByText('비')).toBeTruthy();
    expect(screen.getByText('비회원 (4034bc92)')).toBeTruthy();
  });

  it('조건에 맞는 문의가 없으면 안내 문구를 보여준다', async () => {
    mockRooms([]);

    renderPanel();

    expect(
      await screen.findByText('해당 조건의 문의가 없습니다'),
    ).toBeTruthy();
  });
});
