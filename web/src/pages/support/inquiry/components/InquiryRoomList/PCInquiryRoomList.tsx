import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import InquiryRoomListContent from './InquiryRoomListContent';
import { queries } from '@/apis/queries';
import Pagination from '@/components/Pagination/Pagination';
import type { InquiryCategory } from '@/types/inquiry';

interface PCInquiryRoomListProps {
  categories?: InquiryCategory[];
}

const PCInquiryRoomList = ({ categories }: PCInquiryRoomListProps) => {
  const [page, setPage] = useState(1);
  const { data: roomsPage } = useQuery(
    queries.inquiryRooms({ page: page - 1 }),
  );
  const rooms = roomsPage?.content ?? [];

  return (
    <>
      <InquiryRoomListContent categories={categories} rooms={rooms} />
      <Pagination
        currentPage={page}
        totalPages={roomsPage?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </>
  );
};

export default PCInquiryRoomList;
