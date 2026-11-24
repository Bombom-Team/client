import { toast, useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { queries } from '@/apis/queries';
import { MOBILE_HORIZONTAL_PADDING } from '@/components/PageLayout/PageLayout.constants';
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
  // tablet은 footer가 함께 렌더되어 고정 입력창이 footer를 가리므로 휴대폰에서만 고정한다.
  const isInputFixed = device === 'mobile';
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
    <InquiryChatLayout>
      <EmptyMessageArea isMobile={isMobile} isInputFixed={isInputFixed}>
        <EmptyMessageText>
          궁금한 점이나 불편한 점을 남겨주세요.
          <br />
          메시지를 보내면 문의가 시작돼요.
        </EmptyMessageText>
      </EmptyMessageArea>

      <InputDock isInputFixed={isInputFixed}>
        <InquiryMessageInput
          disabled={isCategoriesPending}
          isSubmitting={isCreating}
          onSubmit={handleSubmit}
        />
      </InputDock>
    </InquiryChatLayout>
  );
}

const EmptyMessageArea = styled.div<{
  isMobile: boolean;
  isInputFixed: boolean;
}>`
  min-height: ${({ isMobile }) => (isMobile ? '240px' : '0')};

  /* 화면 아래에 고정한 입력창에 안내 문구가 가려지지 않도록 입력창 높이보다 여유 있게 비워둔다 */
  padding: ${({ isInputFixed }) => (isInputFixed ? '16px 16px 136px' : '16px')};

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

/**
 * 모바일은 페이지 전체가 스크롤되어 채팅 화면의 높이가 정해져 있지 않다.
 * 메시지가 없는 새 문의 화면에서도 입력창이 화면 아래에 있도록 하단 내비게이션 위에 고정한다.
 * 좌우 폭은 페이지 레이아웃 여백과 채팅 화면 최대 폭에 맞춰, 방이 생성된 뒤 채팅방 입력창과 폭이 같게 한다.
 */
const InputDock = styled.div<{ isInputFixed: boolean }>`
  ${({ isInputFixed, theme }) =>
    isInputFixed &&
    `
      position: fixed;
      right: 0;
      bottom: calc(${theme.heights.bottomNav} + ${theme.safeArea.bottom});
      left: 0;
      z-index: ${theme.zIndex.panel};
      max-width: calc(800px + ${MOBILE_HORIZONTAL_PADDING * 2}px);
      margin: 0 auto;
      padding: 0 ${MOBILE_HORIZONTAL_PADDING}px;

      background-color: ${theme.colors.white};
    `}
`;
