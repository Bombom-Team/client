import styled from '@emotion/styled';
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { inquiryCategoriesQueries } from '@/apis/inquiries/inquiryCategories.query';
import { inquiryRoomsQueries } from '@/apis/inquiries/inquiryRooms.query';
import { membersQueries } from '@/apis/members/members.query';
import { formatRelativeTime } from '@/lib/formatRelativeTime';
import {
  getLastMessagePreviewLabel,
  getRequesterLabel,
} from '@/lib/inquiryDisplay';
import {
  INQUIRY_STATUS_COLORS,
  INQUIRY_STATUS_LABELS,
  type InquiryRoom,
  type InquiryStatus,
} from '@/types/inquiry';

const STATUS_TABS: (InquiryStatus | undefined)[] = [
  undefined,
  'UNCONFIRMED',
  'IN_PROGRESS',
  'DONE',
  'ON_HOLD',
];

const STATUS_TAB_LABELS: Record<'ALL' | InquiryStatus, string> = {
  ALL: '전체',
  ...INQUIRY_STATUS_LABELS,
};

interface InquiryRoomListPanelProps {
  selectedRoomId: number | null;
  onSelectRoom: (room: InquiryRoom) => void;
}

export function InquiryRoomListPanel({
  selectedRoomId,
  onSelectRoom,
}: InquiryRoomListPanelProps) {
  const [status, setStatus] = useState<InquiryStatus | undefined>(undefined);
  const [assigneeId, setAssigneeId] = useState<number | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

  const {
    data: roomPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(
    inquiryRoomsQueries.infiniteList({ status, assigneeId, categoryId }),
  );
  const { data: categories } = useSuspenseQuery(
    inquiryCategoriesQueries.list(),
  );
  const { data: admins } = useSuspenseQuery(
    membersQueries.list({ role: 'ADMIN', size: 100 }),
  );

  const rooms = roomPages.pages.flatMap((page) => page.content);
  const totalCount = roomPages.pages[0]?.totalElements ?? 0;

  const bottomSentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = bottomSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleStatusChange = (nextStatus: InquiryStatus | undefined) => {
    setStatus(nextStatus);
  };

  return (
    <Panel>
      <StatusTabs>
        {STATUS_TABS.map((tab) => (
          <StatusTab
            key={tab ?? 'ALL'}
            type="button"
            $active={status === tab}
            $color={tab ? INQUIRY_STATUS_COLORS[tab] : undefined}
            onClick={() => handleStatusChange(tab)}
          >
            {STATUS_TAB_LABELS[tab ?? 'ALL']}
          </StatusTab>
        ))}
      </StatusTabs>

      <FilterRow>
        <FilterSelect
          value={assigneeId ?? ''}
          onChange={(e) => {
            setAssigneeId(e.target.value ? Number(e.target.value) : undefined);
          }}
        >
          <option value="">담당자 전체</option>
          {admins.content.map((admin) => (
            <option key={admin.id} value={admin.id}>
              {admin.nickname}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          value={categoryId ?? ''}
          onChange={(e) => {
            setCategoryId(e.target.value ? Number(e.target.value) : undefined);
          }}
        >
          <option value="">카테고리 전체</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </FilterSelect>
      </FilterRow>

      <RoomCount>총 {totalCount.toLocaleString()}건</RoomCount>

      <RoomList>
        {rooms.length === 0 && (
          <EmptyState>해당 조건의 문의가 없습니다.</EmptyState>
        )}
        {rooms.map((room) => {
          const category = categories.find((c) => c.id === room.categoryId);
          return (
            <RoomItem
              key={room.id}
              $selected={room.id === selectedRoomId}
              onClick={() => onSelectRoom(room)}
            >
              <RoomItemTop>
                <StatusBadge color={INQUIRY_STATUS_COLORS[room.status]}>
                  {INQUIRY_STATUS_LABELS[room.status]}
                </StatusBadge>
                <RoomTime>
                  {formatRelativeTime(
                    room.lastMessage?.createdAt ?? room.createdAt,
                  )}
                </RoomTime>
              </RoomItemTop>
              <RoomRequester>{getRequesterLabel(room)}</RoomRequester>
              <RoomLastMessagePreview>
                {getLastMessagePreviewLabel(room)}
              </RoomLastMessagePreview>
              <RoomItemBottom>
                <RoomCategoryName>
                  {category?.name ?? '카테고리 없음'}
                </RoomCategoryName>
                <RoomAssignee $unassigned={!room.assigneeNickname}>
                  {room.assigneeNickname ??
                    (room.assigneeId ? '탈퇴한 담당자' : '담당자 미지정')}
                </RoomAssignee>
              </RoomItemBottom>
            </RoomItem>
          );
        })}
        <div ref={bottomSentinelRef} />
        {isFetchingNextPage && (
          <LoadingMore>다음 목록 불러오는 중...</LoadingMore>
        )}
      </RoomList>
    </Panel>
  );
}

const Panel = styled.div`
  width: 320px;
  min-width: 320px;
  height: 100%;
  border-right: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};
`;

const StatusTabs = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StatusTab = styled('button', {
  shouldForwardProp: (prop) => prop !== '$active' && prop !== '$color',
})<{ $active: boolean; $color?: string }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.full};

  background-color: ${({ $active, $color, theme }) =>
    $active ? ($color ?? theme.colors.primary) : theme.colors.gray100};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.white : theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.xs};

  cursor: pointer;
`;

const FilterRow = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.xs};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  flex: 1;
  min-width: 0;

  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const RoomCount = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const RoomList = styled.div`
  overflow-y: auto;

  flex: 1;
`;

const LoadingMore = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
  text-align: center;
`;

const RoomItem = styled('div', {
  shouldForwardProp: (prop) => prop !== '$selected',
})<{ $selected: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.md}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};

  display: flex;
  flex-direction: column;
  gap: 4px;

  background-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.gray50 : theme.colors.white};

  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }
`;

const RoomItemTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatusBadge = styled.span<{ color: string }>`
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};

  background-color: ${({ color }) => color};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const RoomTime = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const RoomRequester = styled.div`
  overflow: hidden;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.sm};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const RoomLastMessagePreview = styled.div`
  overflow: hidden;

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const RoomItemBottom = styled.div`
  margin-top: 2px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const RoomCategoryName = styled.div`
  overflow: hidden;

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const RoomAssignee = styled('span', {
  shouldForwardProp: (prop) => prop !== '$unassigned',
})<{ $unassigned: boolean }>`
  flex-shrink: 0;

  color: ${({ $unassigned, theme }) =>
    $unassigned ? theme.colors.gray400 : theme.colors.primary};
  font-weight: ${({ $unassigned, theme }) =>
    $unassigned ? theme.fontWeight.normal : theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;
`;
