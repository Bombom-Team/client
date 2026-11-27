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
  updateInquiryMessage,
} from '../src/apis/inquiries/inquiryMessages.api';
import {
  deleteInquiryRoomAssignee,
  getInquiryRoomDetail,
  getInquiryRooms,
  patchInquiryRoomAssignee,
  updateInquiryRoomStatus,
} from '../src/apis/inquiries/inquiryRooms.api';
import { getMe, getMembers } from '../src/apis/members/members.api';
import { InquiryRoomDetailPanel } from '../src/pages/inquiries/InquiryRoomDetailPanel';
import { theme } from '../src/styles/theme';
import type { InquiryRoom, InquiryRoomDetail } from '../src/types/inquiry';

vi.mock('../src/apis/inquiries/inquiryRooms.api', () => ({
  getInquiryRoomDetail: vi.fn(),
  getInquiryRooms: vi.fn(),
  patchInquiryRoomAssignee: vi.fn(),
  deleteInquiryRoomAssignee: vi.fn(),
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
  getMe: vi.fn().mockResolvedValue({
    id: 99,
    email: 'me@bombom.news',
    nickname: '나',
  }),
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
  vi.mocked(updateInquiryRoomStatus).mockReset();
  vi.mocked(patchInquiryRoomAssignee).mockReset();
  vi.mocked(deleteInquiryRoomAssignee).mockReset();
  vi.mocked(updateInquiryRoomStatus).mockResolvedValue(
    undefined as Awaited<ReturnType<typeof updateInquiryRoomStatus>>,
  );
  vi.mocked(getInquiryMessages).mockReset();
  vi.mocked(sendInquiryMessage).mockReset();
  vi.mocked(updateInquiryMessage).mockReset();
  vi.mocked(updateInquiryMessage).mockResolvedValue(
    {} as Awaited<ReturnType<typeof updateInquiryMessage>>,
  );
  vi.mocked(getInquiryCategories).mockReset();
  vi.mocked(getMembers).mockReset();
  vi.mocked(getMe).mockReset();
  vi.mocked(getMe).mockResolvedValue({
    id: 99,
    email: 'me@bombom.news',
    nickname: '나',
  });

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
  vi.restoreAllMocks();
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

    await waitFor(() => expect(getSelectByValue('')?.value).toBe(''));
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

    fireEvent.click(screen.getByRole('button', { name: '메시지 수정' }));

    // 하단 메시지 입력창과 구분하기 위해 값으로 찾는다.
    const editTextarea = screen
      .getAllByRole('textbox')
      .find((node) => (node as HTMLTextAreaElement).value === longContent);
    expect(editTextarea).toBeTruthy();
    expect(screen.getByRole('button', { name: '저장' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '취소' })).toBeTruthy();
  });

  it('종료 버튼을 누르면 상태를 완료로 바꾼다', async () => {
    vi.mocked(getInquiryRoomDetail).mockResolvedValue(assignedRoom);

    renderPanel(memberListRoom);

    fireEvent.click(await screen.findByRole('button', { name: /종료/ }));

    // TanStack Query가 mutationFn에 context를 함께 넘기므로 첫 인자만 확인한다.
    await waitFor(() =>
      expect(vi.mocked(updateInquiryRoomStatus).mock.calls[0]?.[0]).toEqual({
        roomId: ROOM_ID,
        status: 'DONE',
      }),
    );
  });

  it('이미 종료된 문의에는 종료 버튼을 보여주지 않는다', async () => {
    vi.mocked(getInquiryRoomDetail).mockResolvedValue({
      ...assignedRoom,
      status: 'DONE',
    });

    renderPanel(memberListRoom);

    await screen.findByText(
      '종료된 문의입니다. 상태를 변경한 뒤 답변할 수 있습니다.',
    );
    expect(screen.queryByRole('button', { name: /종료/ })).toBeNull();
  });

  it('메시지를 수정하면 목록 미리보기가 쓰는 방 정보도 다시 조회한다', async () => {
    // 목록 카드가 마지막 메시지를 미리보기로 쓰므로, 메시지만 갱신하면 목록이
    // 수정 전 내용을 그대로 보여준다.
    vi.mocked(getInquiryRoomDetail).mockResolvedValue(assignedRoom);
    vi.mocked(getInquiryMessages).mockResolvedValue({
      messages: [
        {
          id: 1,
          roomId: ROOM_ID,
          senderType: 'ADMIN',
          adminId: ADMIN_ID,
          content: '고칠 내용',
          imageUrls: [],
          createdAt: '2026-11-03T10:00:00Z',
        },
      ],
      hasNext: false,
    });

    renderPanel(memberListRoom);

    await screen.findByText('고칠 내용');
    const detailCallsBefore = vi.mocked(getInquiryRoomDetail).mock.calls.length;

    fireEvent.click(screen.getByRole('button', { name: '메시지 수정' }));
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    await waitFor(() =>
      expect(vi.mocked(getInquiryRoomDetail).mock.calls.length).toBeGreaterThan(
        detailCallsBefore,
      ),
    );
  });

  it('메시지를 삭제하면 목록 미리보기가 쓰는 방 정보도 다시 조회한다', async () => {
    // 삭제로 마지막 메시지가 바뀌면 목록 카드의 미리보기도 함께 갱신되어야 한다.
    vi.mocked(getInquiryRoomDetail).mockResolvedValue(assignedRoom);
    vi.mocked(getInquiryMessages).mockResolvedValue({
      messages: [
        {
          id: 1,
          roomId: ROOM_ID,
          senderType: 'ADMIN',
          adminId: ADMIN_ID,
          content: '지울 내용',
          imageUrls: [],
          createdAt: '2026-11-03T10:00:00Z',
        },
      ],
      hasNext: false,
    });
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderPanel(memberListRoom);

    await screen.findByText('지울 내용');
    const detailCallsBefore = vi.mocked(getInquiryRoomDetail).mock.calls.length;

    fireEvent.click(screen.getByRole('button', { name: '메시지 삭제' }));

    await waitFor(() =>
      expect(vi.mocked(getInquiryRoomDetail).mock.calls.length).toBeGreaterThan(
        detailCallsBefore,
      ),
    );
  });

  it('담당자를 미지정으로 바꾸면 화면에서 본 담당자와 함께 해제 요청을 보낸다', async () => {
    vi.mocked(getInquiryRoomDetail).mockResolvedValue(assignedRoom);
    vi.mocked(deleteInquiryRoomAssignee).mockResolvedValue(undefined);

    renderPanel(memberListRoom);

    const assigneeSelect = await screen.findByRole('combobox', {
      name: '담당자',
    });
    fireEvent.change(assigneeSelect, { target: { value: '' } });

    await waitFor(() =>
      expect(vi.mocked(deleteInquiryRoomAssignee)).toHaveBeenCalledWith(
        { roomId: ROOM_ID, currentAssigneeId: ADMIN_ID },
        expect.anything(),
      ),
    );
    expect(vi.mocked(patchInquiryRoomAssignee)).not.toHaveBeenCalled();
  });

  it('담당자를 고르면 화면에서 본 담당자와 함께 지정 요청을 보낸다', async () => {
    vi.mocked(getInquiryRoomDetail).mockResolvedValue(unassignedRoom);
    vi.mocked(patchInquiryRoomAssignee).mockResolvedValue(undefined);

    renderPanel(memberListRoom);

    const assigneeSelect = await screen.findByRole('combobox', {
      name: '담당자',
    });
    fireEvent.change(assigneeSelect, { target: { value: String(ADMIN_ID) } });

    await waitFor(() =>
      expect(vi.mocked(patchInquiryRoomAssignee)).toHaveBeenCalledWith(
        { roomId: ROOM_ID, assigneeId: ADMIN_ID, currentAssigneeId: null },
        expect.anything(),
      ),
    );
    expect(vi.mocked(deleteInquiryRoomAssignee)).not.toHaveBeenCalled();
  });

  it('그 사이 다른 운영자가 담당자를 바꿔 실패하면 서버 문구를 알리고 실제 담당자로 다시 보여준다', async () => {
    // 화면에서는 미지정이었지만 서버에서는 이미 다른 운영자가 맡은 상태.
    vi.mocked(getInquiryRoomDetail)
      .mockResolvedValueOnce(unassignedRoom)
      .mockResolvedValue(assignedRoom);
    vi.mocked(patchInquiryRoomAssignee).mockRejectedValue(
      new Error(
        '다른 운영자가 담당자를 먼저 변경했습니다. 새로고침 후 다시 시도해 주세요.',
      ),
    );
    vi.mocked(getMembers).mockResolvedValue({
      content: [
        { id: ADMIN_ID, nickname: '담당자몽' },
        { id: 99, nickname: '나' },
      ],
    } as Awaited<ReturnType<typeof getMembers>>);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    renderPanel(memberListRoom);

    const assigneeSelect = await screen.findByRole<HTMLSelectElement>(
      'combobox',
      { name: '담당자' },
    );
    await screen.findByRole('option', { name: '나' });
    expect(assigneeSelect.value).toBe('');
    fireEvent.change(assigneeSelect, { target: { value: '99' } });

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith(
        '다른 운영자가 담당자를 먼저 변경했습니다. 새로고침 후 다시 시도해 주세요.',
      ),
    );
    await waitFor(() => expect(assigneeSelect.value).toBe(String(ADMIN_ID)));
  });

  it('담당자 변경 후 다시 조회가 끝날 때까지 담당자를 다시 바꿀 수 없다', async () => {
    // 요청은 바로 성공하지만, 변경 후 다시 조회한 응답은 직접 풀어줄 때까지 오지 않는다.
    let resolveRefetch: (room: InquiryRoomDetail) => void = () => {};
    vi.mocked(getInquiryRoomDetail)
      .mockResolvedValueOnce(unassignedRoom)
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveRefetch = resolve;
        }),
      )
      .mockResolvedValue(assignedRoom);
    vi.mocked(patchInquiryRoomAssignee).mockResolvedValue(undefined);

    renderPanel(memberListRoom);

    const assignButton = await screen.findByRole<HTMLButtonElement>('button', {
      name: '내가 담당하기',
    });
    fireEvent.click(assignButton);

    const assigneeSelect = screen.getByRole<HTMLSelectElement>('combobox', {
      name: '담당자',
    });
    await waitFor(() =>
      expect(vi.mocked(getInquiryRoomDetail)).toHaveBeenCalledTimes(2),
    );
    expect(assigneeSelect.disabled).toBe(true);
    expect(assignButton.disabled).toBe(true);

    resolveRefetch(assignedRoom);

    await waitFor(() => expect(assigneeSelect.disabled).toBe(false));
    expect(assigneeSelect.value).toBe(String(ADMIN_ID));
    expect(vi.mocked(patchInquiryRoomAssignee)).toHaveBeenCalledTimes(1);
  });

  it('담당자 변경 응답 전에 패널을 벗어나도 실패하면 알린다', async () => {
    vi.mocked(getInquiryRoomDetail).mockResolvedValue(unassignedRoom);
    let rejectAssign: (error: Error) => void = () => {};
    vi.mocked(patchInquiryRoomAssignee).mockReturnValue(
      new Promise((_, reject) => {
        rejectAssign = reject;
      }),
    );
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    renderPanel(memberListRoom);

    fireEvent.click(
      await screen.findByRole('button', { name: '내가 담당하기' }),
    );
    await waitFor(() =>
      expect(vi.mocked(patchInquiryRoomAssignee)).toHaveBeenCalled(),
    );

    // 다른 방을 열면 패널이 새로 마운트되므로, 기존 패널이 사라진 상황을 만든다.
    cleanup();
    rejectAssign(new Error('다른 운영자가 담당자를 먼저 변경했습니다.'));

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith(
        '다른 운영자가 담당자를 먼저 변경했습니다.',
      ),
    );
  });

  it('내가 담당하기를 누르면 로그인한 운영자를 담당자로 지정한다', async () => {
    vi.mocked(getInquiryRoomDetail).mockResolvedValue(unassignedRoom);
    vi.mocked(patchInquiryRoomAssignee).mockResolvedValue(undefined);

    renderPanel(memberListRoom);

    fireEvent.click(
      await screen.findByRole('button', { name: '내가 담당하기' }),
    );

    await waitFor(() =>
      expect(vi.mocked(patchInquiryRoomAssignee)).toHaveBeenCalledWith(
        { roomId: ROOM_ID, assigneeId: 99, currentAssigneeId: null },
        expect.anything(),
      ),
    );
  });

  it('이미 내가 담당자면 내가 담당하기 버튼을 숨긴다', async () => {
    vi.mocked(getMe).mockResolvedValue({
      id: ADMIN_ID,
      email: 'me@bombom.news',
      nickname: '담당자몽',
    });
    vi.mocked(getInquiryRoomDetail).mockResolvedValue(assignedRoom);

    renderPanel(memberListRoom);

    await screen.findByRole('combobox', { name: '담당자' });
    expect(screen.queryByRole('button', { name: '내가 담당하기' })).toBeNull();
  });

  it('내 정보 조회가 실패하면 상세는 그대로 보이고 내가 담당하기 버튼만 숨긴다', async () => {
    vi.mocked(getMe).mockRejectedValue(new Error('Not Found'));
    vi.mocked(getInquiryRoomDetail).mockResolvedValue(unassignedRoom);

    renderPanel(memberListRoom);

    expect(
      await screen.findByRole('combobox', { name: '담당자' }),
    ).toBeTruthy();
    await waitFor(() => expect(vi.mocked(getMe)).toHaveBeenCalled());
    expect(screen.queryByRole('button', { name: '내가 담당하기' })).toBeNull();
  });

  it('다른 운영자가 담당 중이면 내가 담당하기 버튼을 띄우지 않는다', async () => {
    // 기본 내 정보(id 99)와 다른 운영자(ADMIN_ID)가 맡은 방.
    vi.mocked(getInquiryRoomDetail).mockResolvedValue(assignedRoom);

    renderPanel(memberListRoom);

    await screen.findByRole('combobox', { name: '담당자' });
    await waitFor(() => expect(vi.mocked(getMe)).toHaveBeenCalled());
    expect(screen.queryByRole('button', { name: '내가 담당하기' })).toBeNull();
  });

  it('종료된 방이면 내가 담당하기 버튼을 띄우지 않는다', async () => {
    vi.mocked(getInquiryRoomDetail).mockResolvedValue({
      ...unassignedRoom,
      status: 'DONE',
    });

    renderPanel(memberListRoom);

    await screen.findByRole('combobox', { name: '담당자' });
    await waitFor(() => expect(vi.mocked(getMe)).toHaveBeenCalled());
    expect(screen.queryByRole('button', { name: '내가 담당하기' })).toBeNull();
  });

  it('헤더에서 잘리는 이메일과 담당자는 마우스를 올려 전체를 볼 수 있다', async () => {
    vi.mocked(getInquiryRoomDetail).mockResolvedValue(assignedRoom);

    renderPanel({
      ...memberListRoom,
      inquirerEmail: 'very.long.address.for.testing@bombom.news',
    });

    // 이메일은 복사 버튼으로 감싸져 있고, 접근 가능한 이름에 전체 주소가 들어간다.
    expect(
      await screen.findByRole('button', {
        name: 'very.long.address.for.testing@bombom.news 복사하기',
      }),
    ).toBeTruthy();

    // 담당자 셀렉트는 선택된 이름을 title로 보여준다.
    expect(
      screen.getByRole('combobox', { name: '담당자' }).getAttribute('title'),
    ).toBe('담당자몽');
  });

  it('목록 정보 없이 열어도 비회원 식별자를 복사할 수 있다', async () => {
    const guestId = '4034bc92-0138-4633-a534-8569b7b4c138';
    vi.mocked(getInquiryRoomDetail).mockResolvedValue({
      ...assignedRoom,
      memberId: null,
      guestId,
    });

    // listRoom 없이 연다. 상세 응답만으로 그려지는 경로다.
    renderPanel();

    expect(
      await screen.findByRole('button', { name: `${guestId} 복사하기` }),
    ).toBeTruthy();
    expect(screen.getAllByText('비회원 (4034bc92)').length).toBeGreaterThan(0);
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
