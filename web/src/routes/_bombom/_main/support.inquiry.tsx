import { useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import InquiryRoomListPanel from '@/pages/support/inquiry/components/InquiryRoomListPanel';

export const Route = createFileRoute('/_bombom/_main/support/inquiry')({
  component: InquiryLayout,
});

/**
 * PC에서는 문의 목록과 채팅방을 한 화면에 함께 보여주고,
 * 모바일에서는 라우트에 따라 목록과 채팅방 중 하나만 보여준다.
 */
function InquiryLayout() {
  const device = useDevice();

  if (device !== 'pc') {
    return <Outlet />;
  }

  return (
    <SplitContainer>
      <ListPane>
        <InquiryRoomListPanel />
      </ListPane>
      <DetailPane>
        <Outlet />
      </DetailPane>
    </SplitContainer>
  );
}

const SplitContainer = styled.div`
  height: 70vh;
  min-height: 520px;
  border: 1px solid ${({ theme }) => theme.colors.dividers};
  border-radius: 16px;

  display: grid;
  grid-template-columns: minmax(280px, 360px) 1fr;

  background-color: ${({ theme }) => theme.colors.white};

  overflow: hidden;
`;

const ListPane = styled.div`
  overflow: hidden;
  border-right: 1px solid ${({ theme }) => theme.colors.dividers};

  display: flex;
  flex-direction: column;
`;

const DetailPane = styled.div`
  overflow: hidden;

  display: flex;
  flex-direction: column;
`;
