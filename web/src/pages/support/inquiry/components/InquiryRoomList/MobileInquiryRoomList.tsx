import styled from '@emotion/styled';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';
import InquiryRoomListContent from './InquiryRoomListContent';
import { queries } from '@/apis/queries';
import { useIntersectionTrigger } from '@/hooks/useIntersectionTrigger';
import type { InquiryCategory } from '@/types/inquiry';

interface MobileInquiryRoomListProps {
  categories?: InquiryCategory[];
}

const MobileInquiryRoomList = ({ categories }: MobileInquiryRoomListProps) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const {
    data: roomPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(queries.infiniteInquiryRooms());
  const rooms = useMemo(
    () => roomPages?.pages.flatMap((page) => page.content ?? []) ?? [],
    [roomPages],
  );

  useIntersectionTrigger({
    targetRef: loadMoreRef,
    enabled: Boolean(hasNextPage) && !isFetchingNextPage,
    onIntersect: fetchNextPage,
  });

  return (
    <>
      <InquiryRoomListContent categories={categories} rooms={rooms} />
      <LoadMoreTrigger ref={loadMoreRef} />
      {isFetchingNextPage && <LoadingMessage>로딩 중...</LoadingMessage>}
    </>
  );
};

export default MobileInquiryRoomList;

const LoadMoreTrigger = styled.div`
  width: 100%;
  height: 20px;
`;

const LoadingMessage = styled.div`
  padding: 20px;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  text-align: center;
`;
