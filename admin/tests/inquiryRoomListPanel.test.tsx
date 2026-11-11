import { ThemeProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { screen, waitFor } from '@testing-library/dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
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

const renderPanel = ({
  onSelectRoom = () => {},
}: { onSelectRoom?: (room: InquiryRoom) => void } = {}) => {
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
            onSelectRoom={onSelectRoom}
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

  it('잘리는 이름과 담당자는 마우스를 올려 전체를 볼 수 있다', async () => {
    mockRooms([
      room({
        inquirerNickname: '아주아주긴닉네임을가진회원',
        assigneeNickname: 'dummy_nick_1',
      }),
    ]);

    renderPanel();

    expect(
      (await screen.findByText('아주아주긴닉네임을가진회원')).getAttribute(
        'title',
      ),
    ).toBe('아주아주긴닉네임을가진회원');
    expect(screen.getByText('dummy_nick_1').getAttribute('title')).toBe(
      'dummy_nick_1',
    );
  });

  it('이메일을 누르면 클립보드에 전체 주소를 복사한다', async () => {
    const email = 'very.long.address.for.testing@bombom.news';
    const writeText = vi.fn().mockResolvedValue(undefined);
    // navigator 전체를 stub하면 뒤 테스트까지 번지므로 clipboard만 끼웠다 되돌린다.
    const originalClipboard = Object.getOwnPropertyDescriptor(
      navigator,
      'clipboard',
    );
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    try {
      mockRooms([room({ inquirerEmail: email })]);

      renderPanel();

      fireEvent.click(
        await screen.findByRole('button', { name: `${email} 복사하기` }),
      );

      expect(writeText).toHaveBeenCalledWith(email);
      expect(await screen.findByText('복사됨')).toBeTruthy();
    } finally {
      if (originalClipboard) {
        Object.defineProperty(navigator, 'clipboard', originalClipboard);
      } else {
        Reflect.deleteProperty(navigator, 'clipboard');
      }
    }
  });

  it('복사 버튼을 눌러도 방이 선택되지 않는다', async () => {
    const email = 'bom@bombom.news';
    const onSelectRoom = vi.fn();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });

    try {
      mockRooms([room({ inquirerEmail: email })]);

      renderPanel({ onSelectRoom });

      fireEvent.click(
        await screen.findByRole('button', { name: `${email} 복사하기` }),
      );

      expect(onSelectRoom).not.toHaveBeenCalled();
    } finally {
      Reflect.deleteProperty(navigator, 'clipboard');
    }
  });

  it('클립보드를 쓸 수 없으면 복사됨 표시를 띄우지 않는다', async () => {
    const email = 'bom@bombom.news';
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    // 보안 컨텍스트가 아니면 navigator.clipboard 자체가 없다.
    Reflect.deleteProperty(navigator, 'clipboard');

    mockRooms([room({ inquirerEmail: email })]);

    renderPanel();

    fireEvent.click(
      await screen.findByRole('button', { name: `${email} 복사하기` }),
    );

    await waitFor(() => expect(alertSpy).toHaveBeenCalledTimes(1));
    expect(screen.queryByText('복사됨')).toBeNull();
  });

  it('비회원은 잘려 보이는 게스트 ID 전체를 복사한다', async () => {
    const guestId = '4034bc92-0138-4633-a534-8569b7b4c138';
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    try {
      mockRooms([
        room({
          inquirerType: 'GUEST',
          inquirerNickname: null,
          inquirerEmail: null,
          guestId,
        }),
      ]);

      renderPanel();

      fireEvent.click(
        await screen.findByRole('button', { name: `${guestId} 복사하기` }),
      );

      // 화면에는 앞 8자만 보이지만 복사되는 값은 전체여야 한다.
      expect(screen.getByText('비회원 (4034bc92)')).toBeTruthy();
      expect(writeText).toHaveBeenCalledWith(guestId);
    } finally {
      Reflect.deleteProperty(navigator, 'clipboard');
    }
  });

  it('조건에 맞는 문의가 없으면 안내 문구를 보여준다', async () => {
    mockRooms([]);

    renderPanel();

    expect(await screen.findByText('해당 조건의 문의가 없습니다')).toBeTruthy();
  });
});
