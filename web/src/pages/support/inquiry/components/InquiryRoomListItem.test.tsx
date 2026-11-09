import { theme } from '@bombom/shared/theme';
import { ThemeProvider } from '@emotion/react';
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import InquiryRoomListItem from './InquiryRoomListItem';
import type { InquiryRoom } from '@/types/inquiry';

jest.mock('@bombom/shared/env', () => ({
  ENV: { baseUrl: 'https://api.example.com' },
}));

const renderRoomListItem = async (room: Partial<InquiryRoom>) => {
  const rootRoute = createRootRoute();
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => (
      <ThemeProvider theme={theme}>
        <InquiryRoomListItem
          room={{
            id: 1,
            status: 'IN_PROGRESS',
            createdAt: '2026-11-01T09:00:00',
            ...room,
          }}
          categoryName="서비스 이용"
        />
      </ThemeProvider>
    ),
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  });

  render(<RouterProvider router={router} />);
  await screen.findByText('서비스 이용');
};

describe('InquiryRoomListItem', () => {
  it('마지막_메시지_내용을_표시한다', async () => {
    await renderRoomListItem({
      lastMessage: {
        content: '답변 감사합니다',
        senderType: 'USER',
        createdAt: '2026-11-03T12:00:00',
      },
    });

    expect(screen.queryByText('답변 감사합니다')).not.toBeNull();
  });

  it('내용이_없는_이미지_메시지는_대체_문구를_표시한다', async () => {
    await renderRoomListItem({
      lastMessage: {
        content: '',
        senderType: 'USER',
        createdAt: '2026-11-03T12:00:00',
      },
    });

    expect(screen.queryByText('사진을 보냈습니다.')).not.toBeNull();
  });

  it('마지막_메시지가_있으면_메시지_시각을_표시한다', async () => {
    await renderRoomListItem({
      createdAt: '2026-11-01T09:00:00',
      lastMessage: {
        content: '답변드립니다',
        senderType: 'ADMIN',
        adminNickname: '상담원',
        createdAt: '2026-11-03T12:00:00',
      },
    });

    expect(screen.queryByText('2026.11.03')).not.toBeNull();
  });

  it('마지막_메시지가_없으면_방_생성일을_표시한다', async () => {
    await renderRoomListItem({ createdAt: '2026-11-01T09:00:00' });

    expect(screen.queryByText('2026.11.01')).not.toBeNull();
  });
});
