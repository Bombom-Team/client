import { ThemeProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { screen, waitFor } from '@testing-library/dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getInquiryCategories } from '../src/apis/inquiries/inquiryCategories.api';
import { getInquiryMessages } from '../src/apis/inquiries/inquiryMessages.api';
import {
  getInquiryRoomDetail,
  getInquiryRooms,
} from '../src/apis/inquiries/inquiryRooms.api';
import { getMembers } from '../src/apis/members/members.api';
import { Route } from '../src/routes/_admin/inquiries/rooms';
import { theme } from '../src/styles/theme';
import type { ReactNode } from 'react';
import type { InquiryRoom, InquiryRoomDetail } from '../src/types/inquiry';

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
vi.mock('../src/apis/inquiries/inquiryMessages.api', () => ({
  getInquiryMessages: vi.fn(),
  sendInquiryMessage: vi.fn(),
  updateInquiryMessage: vi.fn(),
  deleteInquiryMessage: vi.fn(),
  uploadInquiryImages: vi.fn(),
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

const ROOM_ID = 7;

const listRoom: InquiryRoom = {
  id: ROOM_ID,
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

const roomDetail: InquiryRoomDetail = {
  id: ROOM_ID,
  memberId: 1004,
  guestId: null,
  categoryId: 1,
  status: 'UNCONFIRMED',
  assigneeId: null,
  createdAt: '2026-11-01T09:00:00Z',
  closedAt: null,
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
  vi.mocked(getInquiryRooms).mockReset();
  vi.mocked(getInquiryRoomDetail).mockReset();
  vi.mocked(getInquiryMessages).mockReset();
  vi.mocked(getInquiryCategories).mockReset();
  vi.mocked(getMembers).mockReset();

  vi.mocked(getInquiryRoomDetail).mockResolvedValue(roomDetail);
  vi.mocked(getInquiryMessages).mockResolvedValue({
    messages: [],
    hasNext: false,
  });
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

const mockRoomsByStatus = () => {
  vi.mocked(getInquiryRooms).mockImplementation(async (params = {}) => {
    // 선택한 방은 미확인 상태다. 완료 탭으로 바꾸면 목록에서 빠진다.
    const content =
      params.status && params.status !== 'UNCONFIRMED' ? [] : [listRoom];
    return {
      content,
      number: 0,
      totalPages: 1,
      totalElements: content.length,
      size: params.size ?? 20,
      first: true,
      last: true,
    } as Awaited<ReturnType<typeof getInquiryRooms>>;
  });
};

describe('문의 채팅방 화면', () => {
  it('선택한 방이 필터에서 빠져도 상세의 문의자 정보를 유지한다', async () => {
    mockRoomsByStatus();

    renderPage();

    // 목록에서 방을 연다. 이름이 목록과 상세 두 곳에 보인다.
    fireEvent.click(await screen.findByText('봄봄이'));
    await waitFor(() =>
      expect(screen.getAllByText('봄봄이').length).toBeGreaterThan(1),
    );

    // 그 방이 없는 탭으로 바꾼다.
    fireEvent.click(screen.getByRole('button', { name: /완료/ }));
    await screen.findByText('해당 조건의 문의가 없습니다');

    // 상세는 열린 채로 닉네임을 유지해야 한다. 내부 ID 표기로 바뀌면 안 된다.
    expect(screen.getAllByText('봄봄이').length).toBeGreaterThan(0);
    expect(screen.queryByText(`회원 #${roomDetail.memberId}`)).toBeNull();
    // 이메일 복사 버튼도 그대로 있어야 한다.
    expect(screen.getByRole('button', { name: /복사하기/ })).toBeTruthy();
  });
});
