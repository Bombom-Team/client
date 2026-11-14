import { Button, toast, useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import InquiryRoomList from './InquiryRoomList/InquiryRoomList';
import { useInquiryRoomCreateMutation } from '../hooks/useInquiryRoomCreateMutation';
import { queries } from '@/apis/queries';
import PlusIcon from '#/assets/svg/plus.svg';

const DEFAULT_CATEGORY_NAME = '기타';

const InquiryRoomListPanel = () => {
  const navigate = useNavigate();
  const device = useDevice();
  const isMobile = device !== 'pc';
  const { data: categories, isPending: isCategoriesPending } = useQuery(
    queries.inquiryCategories(),
  );

  const { mutate: mutateCreateRoom, isPending } = useInquiryRoomCreateMutation({
    onSuccess: (room) => {
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
  const handleCreateRoom = () => {
    const defaultCategory =
      categories?.find((category) => category.name === DEFAULT_CATEGORY_NAME) ??
      categories?.[0];

    if (defaultCategory?.id === undefined) {
      toast.error('문의를 시작할 수 없습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    mutateCreateRoom(defaultCategory.id);
  };

  return (
    <Container>
      <Header isMobile={isMobile}>
        <PanelTitle>내 문의</PanelTitle>
        <NewInquiryButton
          disabled={isPending || isCategoriesPending}
          onClick={handleCreateRoom}
        >
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
