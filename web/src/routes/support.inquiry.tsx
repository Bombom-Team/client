import styled from '@emotion/styled';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { queries } from '@/apis/queries';
import { createInquiryRoom } from '@/apis/inquiry/inquiry.api';
import Button from '@/components/Button/Button';
import BomBomFooter from '@/components/Footer/BomBomFooter';
import MobileMainHeader from '@/components/Header/MobileMainHeader';
import PCHeader from '@/components/Header/PCHeader';
import useModal from '@/components/Modal/useModal';
import { toast } from '@/components/Toast/utils/toastActions';
import { useDevice } from '@/hooks/useDevice';
import { useWebViewRegisterToken } from '@/libs/webview/useWebViewRegisterToken';
import InquiryCategoryModal from '@/pages/support/inquiry/components/InquiryCategoryModal';
import InquiryRoomListItem from '@/pages/support/inquiry/components/InquiryRoomListItem';

export const Route = createFileRoute('/support/inquiry')({
  head: () => ({
    meta: [
      { title: '봄봄 | 1:1 문의하기' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: InquiryRoomListPage,
});

function InquiryRoomListPage() {
  useWebViewRegisterToken();
  const device = useDevice();
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
    <>
      {device === 'pc' ? <PCHeader activeNav={null} /> : <MobileMainHeader />}

      <Container>
        <Header>
          <Title>1:1 문의하기</Title>
          <Button onClick={openModal}>새 문의</Button>
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
      </Container>

      <BomBomFooter />
    </>
  );
}

const Container = styled.main`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 16px;

  display: flex;
  gap: 24px;
  flex-direction: column;

  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  font: ${({ theme }) => theme.fonts.t11Bold};
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
