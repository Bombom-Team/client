import { useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import InquiryRoomListPanel from '@/pages/support/inquiry/components/InquiryRoomListPanel';

export const Route = createFileRoute('/_bombom/_main/support/inquiry/')({
  head: () => ({
    meta: [
      { title: '봄봄 | 1:1 채팅 문의' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: InquiryRoomListPage,
});

/**
 * PC에서는 상위 레이아웃이 목록을 상시 노출하므로 채팅방 선택 안내만 보여준다.
 */
function InquiryRoomListPage() {
  const device = useDevice();

  if (device === 'pc') {
    return <EmptyState>문의를 선택하면 대화 내용을 볼 수 있어요</EmptyState>;
  }

  return <InquiryRoomListPanel />;
}

const EmptyState = styled.p`
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t6Regular};
`;
