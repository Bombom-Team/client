import { Button, useModal } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import InquiryCategoryModal from './InquiryCategoryModal';
import InquiryRoomList from './InquiryRoomList/InquiryRoomList';
import { queries } from '@/apis/queries';
import { useInquiryRoomCreateMutation } from '@/pages/support/inquiry/hooks/useInquiryRoomCreateMutation';
import PlusIcon from '#/assets/svg/plus.svg';

const InquiryRoomListPanel = () => {
  const navigate = useNavigate();
  const { data: categories } = useQuery(queries.inquiryCategories());
  const { modalRef, isOpen, openModal, closeModal } = useModal();

  const { mutate: mutateCreateRoom, isPending } = useInquiryRoomCreateMutation({
    onSuccess: (room) => {
      closeModal();
      navigate({
        to: '/support/inquiry/$roomId',
        params: { roomId: String(room.id) },
      });
    },
  });

  return (
    <Container>
      <Header>
        <PanelTitle>내 문의</PanelTitle>
        <NewInquiryButton onClick={openModal}>
          <PlusIcon width={16} height={16} />새 문의
        </NewInquiryButton>
      </Header>

      <ListArea>
        <InquiryRoomList categories={categories} />
      </ListArea>

      <InquiryCategoryModal
        isOpen={isOpen}
        modalRef={modalRef}
        closeModal={closeModal}
        isSubmitting={isPending}
        onSelectCategory={mutateCreateRoom}
      />
    </Container>
  );
};

export default InquiryRoomListPanel;

const Container = styled.div`
  height: 100%;

  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 20px;

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

  font: ${({ theme }) => theme.fonts.t5Regular};
  white-space: nowrap;
`;

const ListArea = styled.div`
  padding: 0 12px 20px;

  flex: 1;

  overflow-y: auto;
`;
