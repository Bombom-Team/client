import styled from '@emotion/styled';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { createInquiryRoom } from '@/apis/inquiry/inquiry.api';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
import useModal from '@/components/Modal/useModal';
import { toast } from '@/components/Toast/utils/toastActions';
import InquiryCategoryModal from '@/pages/support/inquiry/components/InquiryCategoryModal';
import InquiryRoomListItem from '@/pages/support/inquiry/components/InquiryRoomListItem';
import PlusIcon from '#/assets/svg/plus.svg';

export const Route = createFileRoute('/_bombom/_main/support/inquiry/')({
  head: () => ({
    meta: [
      { title: '봄봄 | 1:1 문의하기' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: InquiryRoomListPage,
});

function InquiryRoomListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: roomsPage } = useQuery(queries.inquiryRooms());
  const { modalRef, isOpen, openModal, closeModal } = useModal();

  const { mutate: mutateCreateRoom, isPending } = useMutation({
    mutationFn: createInquiryRoom,
    onSuccess: (room) => {
      closeModal();
      queryClient.invalidateQueries({
        queryKey: queries.inquiryRooms().queryKey,
      });
      navigate({
        to: '/support/inquiry/$roomId',
        params: { roomId: String(room.id) },
      });
    },
    onError: () => {
      toast.error('문의 생성에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const rooms = roomsPage?.content ?? [];

  return (
    <ContentWrapper>
      <Header>
        <NewInquiryButton variant="transparent" onClick={openModal}>
          <PlusIcon width={16} height={16} />새 문의
        </NewInquiryButton>
      </Header>

      {rooms.length === 0 ? (
        <EmptyState>아직 문의 내역이 없어요</EmptyState>
      ) : (
        <RoomList>
          {rooms.map((room) => (
            <InquiryRoomListItem key={room.id} room={room} />
          ))}
        </RoomList>
      )}

      <InquiryCategoryModal
        isOpen={isOpen}
        modalRef={modalRef}
        closeModal={closeModal}
        isSubmitting={isPending}
        onSelectCategory={mutateCreateRoom}
      />
    </ContentWrapper>
  );
}

const ContentWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const NewInquiryButton = styled(Button)`
  color: ${({ theme }) => theme.colors.primaryBomBom};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;

const RoomList = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const EmptyState = styled.p`
  padding: 48px 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t6Regular};
  text-align: center;
`;
