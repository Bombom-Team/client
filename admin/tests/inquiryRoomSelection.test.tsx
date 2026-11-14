import { ThemeProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { screen, waitFor } from '@testing-library/dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getInquiryCategories } from '../src/apis/inquiries/inquiryCategories.api';
import { getInquiryRooms } from '../src/apis/inquiries/inquiryRooms.api';
import { getMembers } from '../src/apis/members/members.api';
import { Route } from '../src/routes/_admin/inquiries/rooms';
import { theme } from '../src/styles/theme';
import type { ReactNode } from 'react';
import type { InquiryRoom } from '../src/types/inquiry';

vi.mock('../src/components/Layout', () => ({
  Layout: ({ children }: { children: ReactNode }) => <main>{children}</main>,
}));

// 방을 바꾼 첫 렌더에 이전 방 정보가 넘어오는지는 DOM만으로 관찰하기 어렵다.
// 상세 패널을 대역으로 바꿔 매 렌더에서 받은 prop을 그대로 기록한다.
const detailProps: { roomId: number; listRoomId?: number }[] = [];
vi.mock('../src/pages/inquiries/InquiryRoomDetailPanel', () => ({
  InquiryRoomDetailPanel: ({
    roomId,
    listRoom,
  }: {
    roomId: number;
    listRoom?: InquiryRoom;
  }) => {
    detailProps.push({ roomId, listRoomId: listRoom?.id });
    return <div>상세 패널</div>;
  },
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

class NoopIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
vi.stubGlobal('IntersectionObserver', NoopIntersectionObserver);

const FIRST_ROOM_ID = 7;
const SECOND_ROOM_ID = 9;

const baseRoom: InquiryRoom = {
  id: FIRST_ROOM_ID,
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
};

const secondRoom: InquiryRoom = {
  ...baseRoom,
  id: SECOND_ROOM_ID,
  inquirerNickname: '메이',
  inquirerEmail: 'may@bombom.news',
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

beforeEach(() => {
  detailProps.length = 0;
  vi.mocked(getInquiryRooms).mockReset();
  vi.mocked(getInquiryCategories).mockReset();
  vi.mocked(getMembers).mockReset();

  vi.mocked(getInquiryRooms).mockResolvedValue({
    content: [baseRoom, secondRoom],
    number: 0,
    totalPages: 1,
    totalElements: 2,
    size: 20,
    first: true,
    last: true,
  } as Awaited<ReturnType<typeof getInquiryRooms>>);
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

describe('문의 방 선택', () => {
  it('다른 방을 열면 첫 렌더부터 그 방의 정보를 넘긴다', async () => {
    renderPage();

    fireEvent.click(await screen.findByText('봄봄이'));
    await waitFor(() => expect(detailProps.length).toBeGreaterThan(0));

    detailProps.length = 0;
    fireEvent.click(screen.getByText('메이'));

    // 새 방의 렌더에 이전 방 정보가 한 번이라도 섞이면 잘못된 이메일이 복사된다.
    const mismatched = detailProps.filter(
      (props) =>
        props.roomId === SECOND_ROOM_ID && props.listRoomId !== SECOND_ROOM_ID,
    );
    expect(mismatched).toHaveLength(0);
  });
});
