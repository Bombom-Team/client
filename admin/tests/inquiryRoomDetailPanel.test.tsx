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
import type {
  InquiryRoom,
  InquiryRoomDetail,
} from '../src/types/inquiry';

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

const renderPanel = (listRoom?: InquiryRoom) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  clients.push(client);
  render(
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={client}>
        <Suspense fallback={<div>로딩 중</div>}>
          <InquiryRoomDetailPanel roomId={ROOM_ID} listRoom={listRoom} />
        </Suspense>
      </QueryClientProvider>
    </ThemeProvider>,
  );
  return client;
};

const memberListRoom: InquiryRoom = {
  id: ROOM_ID,
  categoryId: 1,
  status: 'IN_PROGRESS',
  assigneeId: ADMIN_ID,
  assigneeNickname: '담당자몽',
  inquirerType: 'MEMBER',
  guestId: null,
  inquirerNickname: '봄봄이',
  inquirerEmail: 'bom@bombom.news',
  lastMessage: null,
  createdAt: '2026-11-01T09:00:00Z',
  closedAt: null,
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

    fireEvent.change(screen.getByPlaceholderText(/메시지를 입력하세요/), {
      target: { value: '안녕하세요, 확인했습니다.' },
    });
    fireEvent.click(screen.getByRole('button', { name: '전송' }));

    await waitFor(() => expect(sendInquiryMessage).toHaveBeenCalledTimes(1));

    // 담당자 미지정/미확인이 아니라 배정된 담당자와 진행중이 보여야 한다.
    await waitFor(() => {
      expect(getSelectByValue(String(ADMIN_ID))).toBeTruthy();
      expect(getSelectByValue('IN_PROGRESS')).toBeTruthy();
    });
  });

  it('회원 메시지에는 아바타를 붙이고 관리자 메시지에는 붙이지 않는다', async () => {
    vi.mocked(getInquiryRoomDetail).mockResolvedValue(assignedRoom);
    vi.mocked(getInquiryMessages).mockResolvedValue({
      messages: [
        {
          id: 2,
          roomId: ROOM_ID,
          senderType: 'ADMIN',
          adminId: ADMIN_ID,
          content: '확인 후 안내드리겠습니다.',
          imageUrls: [],
          createdAt: '2026-11-03T10:05:00Z',
        },
        {
          id: 1,
          roomId: ROOM_ID,
          senderType: 'USER',
          adminId: null,
          content: '메일이 안 와요.',
          imageUrls: [],
          createdAt: '2026-11-03T10:00:00Z',
        },
      ],
      hasNext: false,
    });

    renderPanel(memberListRoom);

    await screen.findByText('메일이 안 와요.');

    // 회원 메시지에는 작성자 이름과 아바타(이니셜 '봄')가 붙는다.
    expect(screen.getAllByText('봄봄이').length).toBeGreaterThan(0);
    expect(screen.getAllByText('봄').length).toBeGreaterThan(0);

    // 관리자 메시지에는 작성자 표시를 두지 않는다. 담당자 셀렉트의 option을 빼면
    // '담당자몽'은 화면에 없고, 관리자 이니셜도 없다.
    const adminNameNodes = screen
      .getAllByText('담당자몽')
      .filter((node) => node.tagName !== 'OPTION');
    expect(adminNameNodes).toHaveLength(0);
    expect(screen.queryByText('담')).toBeNull();
  });

  it('관리자 메시지를 수정하면 원래 내용이 입력창에 채워진다', async () => {
    vi.mocked(getInquiryRoomDetail).mockResolvedValue(assignedRoom);
    const longContent = 'd'.repeat(300);
    vi.mocked(getInquiryMessages).mockResolvedValue({
      messages: [
        {
          id: 1,
          roomId: ROOM_ID,
          senderType: 'ADMIN',
          adminId: ADMIN_ID,
          content: longContent,
          imageUrls: [],
          createdAt: '2026-11-03T10:00:00Z',
        },
      ],
      hasNext: false,
    });

    renderPanel(memberListRoom);

    await screen.findByText(longContent);

    // 관리자 메시지에만 수정/삭제 버튼이 뜬다. 수정 버튼은 아이콘뿐이라 순서로 찾는다.
    const iconButtons = screen
      .getAllByRole('button')
      .filter((button) => button.textContent === '');
    fireEvent.click(iconButtons[0]);

    // 하단 메시지 입력창과 구분하기 위해 값으로 찾는다.
    const editTextarea = screen
      .getAllByRole('textbox')
      .find((node) => (node as HTMLTextAreaElement).value === longContent);
    expect(editTextarea).toBeTruthy();
    expect(screen.getByRole('button', { name: '저장' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '취소' })).toBeTruthy();
  });

  it('비회원 메시지에도 이름과 아바타를 보여준다', async () => {
    vi.mocked(getInquiryRoomDetail).mockResolvedValue(assignedRoom);
    vi.mocked(getInquiryMessages).mockResolvedValue({
      messages: [
        {
          id: 1,
          roomId: ROOM_ID,
          senderType: 'USER',
          adminId: null,
          content: '메일이 안 와요.',
          imageUrls: [],
          createdAt: '2026-11-03T10:00:00Z',
        },
      ],
      hasNext: false,
    });

    renderPanel({
      ...memberListRoom,
      inquirerType: 'GUEST',
      inquirerNickname: null,
      inquirerEmail: null,
      guestId: '4034bc92-0138-4633-a534-8569b7b4c138',
    });

    await screen.findByText('메일이 안 와요.');

    // 이름은 메시지 작성자 줄과 헤더 두 곳에 나온다.
    expect(
      screen.getAllByText('비회원 (4034bc92)').length,
    ).toBeGreaterThanOrEqual(2);
    // 비회원도 아바타(이니셜 '비')를 붙인다.
    expect(screen.getAllByText('비').length).toBeGreaterThan(0);
  });
});
