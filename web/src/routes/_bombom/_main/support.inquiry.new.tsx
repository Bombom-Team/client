import { toast, useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { queries } from '@/apis/queries';
import InquiryChatLayout from '@/pages/support/inquiry/components/InquiryChatLayout';
import InquiryMessageInput from '@/pages/support/inquiry/components/InquiryMessageInput';
import { useInquiryRoomCreateMutation } from '@/pages/support/inquiry/hooks/useInquiryRoomCreateMutation';
import type { SendInquiryMessageBody } from '@/apis/inquiry/inquiry.api';

export const Route = createFileRoute('/_bombom/_main/support/inquiry/new')({
  head: () => ({
    meta: [
      { title: '봄봄 | 1:1 채팅 문의' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: InquiryNewPage,
});

const DEFAULT_CATEGORY_NAME = '기타';

/**
 * 아직 채팅방이 생성되기 전의 새 문의 화면이다.
 * 빈 채팅방이 생기지 않도록 첫 메시지를 보낼 때 방을 만들고, 만들어진 채팅방으로 이동한다.
 */
function InquiryNewPage() {
  const navigate = useNavigate();
  const device = useDevice();
  const isMobile = device !== 'pc';
  const isMountedRef = useRef(false);
  const { data: categories, isPending: isCategoriesPending } = useQuery(
    queries.inquiryCategories(),
  );
  const { mutateAsync: mutateCreateRoom, isPending: isCreating } =
    useInquiryRoomCreateMutation();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * 문의 시작 단계를 줄이기 위해 카테고리를 묻지 않고 기본 카테고리로 생성한다.
   * 서버에서 기본 카테고리 이름이 바뀌어도 문의를 아예 시작할 수 없게 되지 않도록 첫 카테고리로 대체한다.
   * 실패하면 입력 내용을 유지하도록 InquiryMessageInput에 오류를 그대로 전달한다.
   */
  const handleSubmit = async (body: SendInquiryMessageBody) => {
    const defaultCategory =
      categories?.find((category) => category.name === DEFAULT_CATEGORY_NAME) ??
      categories?.[0];

    if (defaultCategory?.id === undefined) {
      toast.error('문의를 시작할 수 없습니다. 잠시 후 다시 시도해주세요.');
      throw new Error('기본 문의 카테고리가 없습니다.');
    }

    const room = await mutateCreateRoom({
      categoryId: defaultCategory.id,
      ...body,
    });

    // 응답을 기다리는 동안 다른 화면으로 이동했다면 만들어진 채팅방으로 끌고 가지 않는다.
    if (!isMountedRef.current) return;

    navigate({
      to: '/support/inquiry/$roomId',
      params: { roomId: String(room.id) },
      replace: true,
    });
  };

  return (
    <InquiryChatLayout
      footer={
        <InquiryMessageInput
          disabled={isCategoriesPending}
          isSubmitting={isCreating}
          onSubmit={handleSubmit}
        />
      }
    >
      <EmptyMessageArea isMobile={isMobile}>
        <EmptyMessageText>
          궁금한 점이나 불편한 점을 남겨주세요.
          <br />
          메시지를 보내면 문의가 시작돼요.
        </EmptyMessageText>
      </EmptyMessageArea>
    </InquiryChatLayout>
  );
}

const EmptyMessageArea = styled.div<{ isMobile: boolean }>`
  min-height: ${({ isMobile }) => (isMobile ? '240px' : '0')};
  padding: 16px;

  display: flex;
  flex: ${({ isMobile }) => (isMobile ? 'none' : '1')};
  align-items: center;
  justify-content: center;
`;

const EmptyMessageText = styled.p`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  text-align: center;
`;
