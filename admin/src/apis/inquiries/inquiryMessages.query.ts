import { infiniteQueryOptions, useMutation } from '@tanstack/react-query';
import {
  deleteInquiryMessage,
  getInquiryMessages,
  sendInquiryMessage,
  updateInquiryMessage,
} from './inquiryMessages.api';

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
  return useMutation({
    mutationFn: sendInquiryMessage,
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
