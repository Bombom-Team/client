import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { inquiryCategoriesQueries } from '@/apis/inquiries/inquiryCategories.query';
import { inquiryRoomsQueries } from '@/apis/inquiries/inquiryRooms.query';
import { membersQueries } from '@/apis/members/members.query';
import Pagination from '@/components/Pagination';
import { formatRelativeTime } from '@/lib/formatRelativeTime';
import {
  INQUIRY_STATUS_COLORS,
  INQUIRY_STATUS_LABELS,
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
  onSelectRoom: (roomId: number) => void;
}

export function InquiryRoomListPanel({
  selectedRoomId,
  onSelectRoom,
}: InquiryRoomListPanelProps) {
  const [status, setStatus] = useState<InquiryStatus | undefined>(undefined);
  const [assigneeId, setAssigneeId] = useState<number | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(0);

  const { data: rooms } = useSuspenseQuery(
    inquiryRoomsQueries.list({
      status,
      assigneeId,
      categoryId,
      page,
      size: 20,
    }),
  );
  const { data: categories } = useSuspenseQuery(
    inquiryCategoriesQueries.list(),
  );
  const { data: admins } = useSuspenseQuery(
    membersQueries.list({ role: 'ADMIN', size: 100 }),
  );

  const handleStatusChange = (nextStatus: InquiryStatus | undefined) => {
    setStatus(nextStatus);
    setPage(0);
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
            setPage(0);
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
            setPage(0);
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

      <RoomList>
        {rooms.content.length === 0 && (
          <EmptyState>해당 조건의 문의가 없습니다.</EmptyState>
        )}
        {rooms.content.map((room) => {
          const category = categories.find((c) => c.id === room.categoryId);
          const assignee = admins.content.find(
            (admin) => admin.id === room.assigneeId,
          );
          return (
            <RoomItem
              key={room.id}
              $selected={room.id === selectedRoomId}
              onClick={() => onSelectRoom(room.id)}
            >
              <RoomItemTop>
                <StatusBadge color={INQUIRY_STATUS_COLORS[room.status]}>
                  {INQUIRY_STATUS_LABELS[room.status]}
                </StatusBadge>
                <RoomTime>{formatRelativeTime(room.createdAt)}</RoomTime>
              </RoomItemTop>
              <RoomItemBottom>
                <RoomCategoryName>
                  {category?.name ?? '카테고리 없음'}
                </RoomCategoryName>
                <RoomAssignee $unassigned={!assignee}>
                  {assignee ? assignee.nickname : '담당자 미지정'}
                </RoomAssignee>
              </RoomItemBottom>
            </RoomItem>
          );
        })}
      </RoomList>

      {rooms.totalElements > 0 && (
        <Pagination
          totalCount={rooms.totalElements}
          totalPages={rooms.totalPages}
          currentPage={rooms.number}
          onPageChange={setPage}
          countUnitLabel="건"
        />
      )}
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

const RoomList = styled.div`
  overflow-y: auto;

  flex: 1;
`;

const RoomItem = styled('div', {
  shouldForwardProp: (prop) => prop !== '$selected',
})<{ $selected: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};

  background-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.gray50 : theme.colors.white};

  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }
`;

const RoomItemTop = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xs};

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

const RoomItemBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const RoomCategoryName = styled.div`
  overflow: hidden;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const RoomAssignee = styled('span', {
  shouldForwardProp: (prop) => prop !== '$unassigned',
})<{ $unassigned: boolean }>`
  flex-shrink: 0;

  color: ${({ $unassigned, theme }) =>
    $unassigned ? theme.colors.gray400 : theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;
`;
