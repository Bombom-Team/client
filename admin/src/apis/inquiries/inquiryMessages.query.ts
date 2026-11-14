import {
  infiniteQueryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  deleteInquiryMessage,
  getInquiryMessages,
  sendInquiryMessage,
  updateInquiryMessage,
} from './inquiryMessages.api';
import { inquiryRoomsQueries } from './inquiryRooms.query';

const INQUIRY_MESSAGES_PAGE_SIZE = 20;

export const inquiryMessagesQueries = {
  all: (roomId: number) => ['inquiryMessages', roomId] as const,

  infiniteList: (roomId: number) =>
    infiniteQueryOptions({
      queryKey: ['inquiryMessages', roomId] as const,
      queryFn: ({ pageParam }) =>
        getInquiryMessages({
          roomId,
          cursor: pageParam,
          size: INQUIRY_MESSAGES_PAGE_SIZE,
        }),
      initialPageParam: undefined as number | undefined,
      getNextPageParam: (lastPage) => {
        if (!lastPage.hasNext || lastPage.messages.length === 0) {
          return undefined;
        }
        return lastPage.messages[lastPage.messages.length - 1].id;
      },
    }),
};

export const useSendInquiryMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendInquiryMessage,
    // 첫 답변을 보내면 서버가 담당자를 자동 배정하고 상태를 진행중으로 바꾸므로,
    // 메시지뿐 아니라 방 정보도 다시 조회해야 화면이 실제 값과 어긋나지 않는다.
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({
        queryKey: inquiryMessagesQueries.all(roomId),
      });
      queryClient.invalidateQueries({ queryKey: inquiryRoomsQueries.all });
    },
  });
};

export const useUpdateInquiryMessageMutation = () => {
  return useMutation({
    mutationFn: updateInquiryMessage,
  });
};

export const useDeleteInquiryMessageMutation = () => {
  return useMutation({
    mutationFn: deleteInquiryMessage,
  });
};
