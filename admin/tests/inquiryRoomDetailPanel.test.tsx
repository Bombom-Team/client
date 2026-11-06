import { ThemeProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { screen, waitFor } from '@testing-library/dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { Suspense } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getInquiryCategories } from '../src/apis/inquiries/inquiryCategories.api';
import {
  getInquiryMessages,
  sendInquiryMessage,
} from '../src/apis/inquiries/inquiryMessages.api';
import {
  getInquiryRoomDetail,
  getInquiryRooms,
} from '../src/apis/inquiries/inquiryRooms.api';
import { getMembers } from '../src/apis/members/members.api';
import { InquiryRoomDetailPanel } from '../src/pages/inquiries/InquiryRoomDetailPanel';
import { theme } from '../src/styles/theme';
import type { InquiryRoomDetail } from '../src/types/inquiry';

vi.mock('../src/apis/inquiries/inquiryRooms.api', () => ({
  getInquiryRoomDetail: vi.fn(),
  getInquiryRooms: vi.fn(),
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

const ROOM_ID = 7;
const ADMIN_ID = 42;

// 아직 아무도 담당하지 않은 미확인 방. 어드민이 첫 답변을 보내면 서버가
// 담당자 배정과 상태 전환을 함께 수행한다.
const unassignedRoom: InquiryRoomDetail = {
  id: ROOM_ID,
  memberId: 1004,
  guestId: null,
  categoryId: 1,
  status: 'UNCONFIRMED',
  assigneeId: null,
  createdAt: '2026-11-01T09:00:00Z',
  closedAt: null,
};

const assignedRoom: InquiryRoomDetail = {
  ...unassignedRoom,
  status: 'IN_PROGRESS',
  assigneeId: ADMIN_ID,
};

const clients: QueryClient[] = [];

// jsdom에는 IntersectionObserver가 없다. 과거 메시지 무한스크롤은 이 테스트의
// 관심사가 아니므로 관찰만 받아넘기는 스텁으로 대체한다.
class NoopIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
vi.stubGlobal('IntersectionObserver', NoopIntersectionObserver);

const renderPanel = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  clients.push(client);
  render(
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={client}>
        <Suspense fallback={<div>로딩 중</div>}>
          <InquiryRoomDetailPanel roomId={ROOM_ID} />
        </Suspense>
      </QueryClientProvider>
    </ThemeProvider>,
  );
  return client;
};

const getSelectByValue = (value: string) =>
  screen
    .getAllByRole('combobox')
    .find((node) => (node as HTMLSelectElement).value === value) as
    | HTMLSelectElement
    | undefined;

beforeEach(() => {
  vi.mocked(getInquiryRoomDetail).mockReset();
  vi.mocked(getInquiryRooms).mockReset();
  vi.mocked(getInquiryMessages).mockReset();
  vi.mocked(sendInquiryMessage).mockReset();
  vi.mocked(getInquiryCategories).mockReset();
  vi.mocked(getMembers).mockReset();

  vi.mocked(getInquiryCategories).mockResolvedValue([
    { id: 1, name: '일반 문의' },
  ]);
  vi.mocked(getMembers).mockResolvedValue({
    content: [{ id: ADMIN_ID, nickname: '담당자몽' }],
    number: 0,
    totalPages: 1,
    totalElements: 1,
    size: 100,
    first: true,
    last: true,
  } as Awaited<ReturnType<typeof getMembers>>);
  vi.mocked(getInquiryMessages).mockResolvedValue({
    messages: [],
    hasNext: false,
  });
  vi.mocked(sendInquiryMessage).mockResolvedValue({
    id: 900,
    roomId: ROOM_ID,
    senderType: 'ADMIN',
    adminId: ADMIN_ID,
    content: '안녕하세요, 확인했습니다.',
    imageUrls: [],
    createdAt: '2026-11-03T10:00:00Z',
  } as Awaited<ReturnType<typeof sendInquiryMessage>>);
});

afterEach(() => {
  cleanup();
  clients.splice(0).forEach((client) => client.clear());
});

describe('문의 상세 패널', () => {
  it('답변을 보내면 서버가 자동 배정한 담당자와 상태를 다시 조회해 표시한다', async () => {
    // 서버는 첫 답변 시 담당자를 배정하고 상태를 진행중으로 바꾼다.
    vi.mocked(getInquiryRoomDetail)
      .mockResolvedValueOnce(unassignedRoom)
      .mockResolvedValue(assignedRoom);

    renderPanel();

    await waitFor(() =>
      expect(getSelectByValue('')?.value).toBe(''),
    );
    expect(getSelectByValue('UNCONFIRMED')).toBeTruthy();

    fireEvent.change(screen.getByPlaceholderText('메시지를 입력하세요'), {
      target: { value: '안녕하세요, 확인했습니다.' },
    });
    // 첨부/전송 모두 아이콘 버튼이라 접근 가능한 이름이 없다. 전송 버튼이 마지막이다.
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);

    await waitFor(() => expect(sendInquiryMessage).toHaveBeenCalledTimes(1));

    // 담당자 미지정/미확인이 아니라 배정된 담당자와 진행중이 보여야 한다.
    await waitFor(() => {
      expect(getSelectByValue(String(ADMIN_ID))).toBeTruthy();
      expect(getSelectByValue('IN_PROGRESS')).toBeTruthy();
    });
  });
});
