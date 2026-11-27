import { Button, useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import InquiryRoomList from './InquiryRoomList/InquiryRoomList';
import PlusIcon from '#/assets/svg/plus.svg';

const InquiryRoomListPanel = () => {
  const navigate = useNavigate();
  const device = useDevice();
  const isMobile = device !== 'pc';

  // 빈 채팅방이 생기지 않도록 방은 새 문의 화면에서 첫 메시지를 보낼 때 만든다.
  const handleNewInquiryClick = () => {
    navigate({ to: '/support/inquiry/new' });
  };

  return (
    <Container>
      <Header isMobile={isMobile}>
        <PanelTitle>내 문의</PanelTitle>
        <NewInquiryButton onClick={handleNewInquiryClick}>
          <PlusIcon width={20} height={20} />새 문의
        </NewInquiryButton>
      </Header>

      <ListArea>
        <InquiryRoomList />
      </ListArea>
    </Container>
  );
};

export default InquiryRoomListPanel;

const Container = styled.div`
  height: 100%;

  display: flex;
  flex-direction: column;
`;

const Header = styled.div<{ isMobile: boolean }>`
  padding: ${({ isMobile }) => (isMobile ? '0 0 12px' : '20px')};

  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
`;

const PanelTitle = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t8Bold};
`;

const NewInquiryButton = styled(Button)`
  border-radius: 8px;

  gap: 4px;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
  color: ${({ theme }) => theme.colors.primaryBomBom};
  font: ${({ theme }) => theme.fonts.t5Regular};
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight};
  }
`;

const ListArea = styled.div`
  padding: 0 0 20px;

  flex: 1;

  overflow-y: auto;
`;
