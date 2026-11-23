import { Button, toast, useDevice, useModal } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import InquiryRoomList from './InquiryRoomList/InquiryRoomList';
import InquiryStartModal from './InquiryStartModal';
import { useInquiryRoomCreateMutation } from '../hooks/useInquiryRoomCreateMutation';
import { queries } from '@/apis/queries';
import type { SendInquiryMessageBody } from '@/apis/inquiry/inquiry.api';
import PlusIcon from '#/assets/svg/plus.svg';

const DEFAULT_CATEGORY_NAME = '기타';

const InquiryRoomListPanel = () => {
  const navigate = useNavigate();
  const device = useDevice();
  const isMobile = device !== 'pc';
  const { data: categories, isPending: isCategoriesPending } = useQuery(
    queries.inquiryCategories(),
  );

  // 작성 중인 첫 메시지를 잃지 않도록 바깥 클릭이나 Esc로는 닫히지 않게 한다.
  const { modalRef, isOpen, openModal, closeModal } = useModal({
    closeOnBackdropClick: false,
  });

  const defaultCategory =
    categories?.find((category) => category.name === DEFAULT_CATEGORY_NAME) ??
    categories?.[0];

  const { mutateAsync: mutateCreateRoom, isPending } =
    useInquiryRoomCreateMutation({
      onSuccess: (room) => {
        closeModal();
        navigate({
          to: '/support/inquiry/$roomId',
          params: { roomId: String(room.id) },
        });
      },
    });

  /**
   * 문의 시작 단계를 줄이기 위해 카테고리를 묻지 않고 기본 카테고리로 생성한다.
   * 서버에서 기본 카테고리 이름이 바뀌어도 문의를 아예 시작할 수 없게 되지 않도록 첫 카테고리로 대체한다.
   */
  const handleNewInquiryClick = () => {
    if (defaultCategory?.id === undefined) {
      toast.error('문의를 시작할 수 없습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    openModal();
  };

  /**
   * 빈 채팅방이 생기지 않도록 첫 메시지와 함께 채팅방을 만든다.
   * 실패하면 입력 내용을 유지하도록 InquiryMessageInput에 오류를 그대로 전달한다.
   */
  const handleStartInquiry = (body: SendInquiryMessageBody) => {
    if (defaultCategory?.id === undefined) {
      return Promise.reject(new Error('기본 문의 카테고리가 없습니다.'));
    }

    return mutateCreateRoom({ categoryId: defaultCategory.id, ...body });
  };

  return (
    <Container>
      <Header isMobile={isMobile}>
        <PanelTitle>내 문의</PanelTitle>
        <NewInquiryButton
          disabled={isCategoriesPending}
          onClick={handleNewInquiryClick}
        >
          <PlusIcon width={20} height={20} />새 문의
        </NewInquiryButton>
      </Header>

      <ListArea>
        <InquiryRoomList />
      </ListArea>

      <InquiryStartModal
        modalRef={modalRef}
        isOpen={isOpen}
        closeModal={closeModal}
        isSubmitting={isPending}
        onSubmit={handleStartInquiry}
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
