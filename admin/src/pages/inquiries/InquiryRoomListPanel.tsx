import styled from '@emotion/styled';
import {
  useQueries,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { FiInbox } from 'react-icons/fi';
import { inquiryCategoriesQueries } from '@/apis/inquiries/inquiryCategories.query';
import { inquiryRoomsQueries } from '@/apis/inquiries/inquiryRooms.query';
import { membersQueries } from '@/apis/members/members.query';
import { formatRelativeTime } from '@/lib/formatRelativeTime';
import {
  getLastMessagePreviewLabel,
  getRequesterIdentity,
} from '@/lib/inquiryDisplay';
import { CopyableText } from '@/pages/inquiries/CopyableText';
import { InquiryAvatar } from '@/pages/inquiries/InquiryAvatar';
import {
  INQUIRY_STATUS_LABELS,
  type InquiryRoom,
  type InquiryStatus,
} from '@/types/inquiry';

const STATUS_OPTIONS: InquiryStatus[] = [
  'UNCONFIRMED',
  'IN_PROGRESS',
  'DONE',
  'ON_HOLD',
];

const STATUS_TABS: (InquiryStatus | undefined)[] = [
  undefined,
  ...STATUS_OPTIONS,
];

const STATUS_TAB_LABELS: Record<'ALL' | InquiryStatus, string> = {
  ALL: '전체',
  ...INQUIRY_STATUS_LABELS,
};

interface InquiryRoomListPanelProps {
  selectedRoomId: number | null;
  onSelectRoom: (room: InquiryRoom) => void;
  // 목록이 갱신되면 선택된 방의 최신 정보를 알린다. 상세 패널이 들고 있는 복제본이
  // 낡아 목록과 다른 담당자·상태를 보여주는 것을 막는다.
  onSelectedRoomChange: (room: InquiryRoom | undefined) => void;
}

export function InquiryRoomListPanel({
  selectedRoomId,
  onSelectRoom,
  onSelectedRoomChange,
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

  // 탭에 붙일 상태별 건수. 담당자·카테고리 필터는 함께 반영하고 상태만 각각 바꾼다.
  const statusCounts = useQueries({
    queries: STATUS_OPTIONS.map((tabStatus) =>
      inquiryRoomsQueries.statusCount(tabStatus, { assigneeId, categoryId }),
    ),
  });
  const countByStatus = new Map(
    STATUS_OPTIONS.map((tabStatus, index) => [
      tabStatus,
      statusCounts[index]?.data,
    ]),
  );

  const rooms = roomPages.pages.flatMap((page) => page.content);
  const totalCount = roomPages.pages[0]?.totalElements ?? 0;

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);

  // 목록이 다시 조회되면 선택된 방의 최신 값을 상세 패널로 올린다.
  // 필터를 바꿔 선택된 방이 목록에서 빠졌을 때는 알리지 않는다. undefined를 올리면
  // 열려 있는 상세 화면의 문의자 이름이 내부 ID 표기로 퇴화한다.
  useEffect(() => {
    if (!selectedRoom) return;
    onSelectedRoomChange(selectedRoom);
  }, [selectedRoom, onSelectedRoomChange]);

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
            onClick={() => handleStatusChange(tab)}
          >
            {STATUS_TAB_LABELS[tab ?? 'ALL']}
            {tab && countByStatus.get(tab) !== undefined && (
              <TabCount>{countByStatus.get(tab)}</TabCount>
            )}
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
          <EmptyState>
            <FiInbox size={32} aria-hidden="true" />
            해당 조건의 문의가 없습니다
          </EmptyState>
        )}
        {rooms.map((room) => {
          const category = categories.find((c) => c.id === room.categoryId);
          const requester = getRequesterIdentity(room);
          const lastMessagePreview = getLastMessagePreviewLabel(room);
          const assigneeLabel =
            room.assigneeNickname ??
            (room.assigneeId ? '탈퇴한 운영자' : '담당자 미지정');
          return (
            <RoomItem
              key={room.id}
              $selected={room.id === selectedRoomId}
              onClick={() => onSelectRoom(room)}
            >
              <InquiryAvatar name={requester.name} />
              <RoomItemBody>
                {/* 카드 폭이 좁아 말줄임되므로 전체 값을 title로 띄운다. */}
                <RoomItemTop>
                  <RoomRequester title={requester.name}>
                    {requester.name}
                  </RoomRequester>
                  <RoomTime>
                    {room.lastMessage
                      ? formatRelativeTime(room.lastMessage.createdAt)
                      : '없음'}
                  </RoomTime>
                </RoomItemTop>
                {/* 이메일은 복사해서 쓰는 일이 잦아 눌러서 바로 복사하게 한다. */}
                {requester.email && (
                  <RoomRequesterEmail value={requester.email} />
                )}
                <RoomLastMessagePreview title={lastMessagePreview}>
                  {lastMessagePreview}
                </RoomLastMessagePreview>
                <RoomItemBottom>
                  <RoomCategoryName title={category?.name ?? '카테고리 없음'}>
                    {category?.name ?? '카테고리 없음'}
                  </RoomCategoryName>
                  <RoomAssignee title={assigneeLabel}>
                    {assigneeLabel}
                  </RoomAssignee>
                </RoomItemBottom>
              </RoomItemBody>
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
  padding: 0 ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

// 선택 상태는 하단 보더와 글자 굵기로만 나타낸다. 보더 자리를 항상 차지하게 두어
// 탭을 오갈 때 글자가 밀리지 않는다.
const StatusTab = styled('button', {
  shouldForwardProp: (prop) => prop !== '$active',
})<{ $active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} 0`};
  border: none;
  border-bottom: 2px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};

  display: flex;
  gap: 4px;
  align-items: center;

  background-color: transparent;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.gray900 : theme.colors.gray500};
  font-weight: ${({ $active, theme }) =>
    $active ? theme.fontWeight.semibold : theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};

  cursor: pointer;

  transition: color 0.15s, border-color 0.15s;

  &:hover {
    color: ${({ theme }) => theme.colors.gray900};
  }
`;

const TabCount = styled.span`
  color: ${({ theme }) => theme.colors.gray400};
  font-weight: ${({ theme }) => theme.fontWeight.normal};
  font-size: ${({ theme }) => theme.fontSize.xs};
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

// 선택 표시는 좌측 primary 바로 한다. 선택되지 않은 항목도 같은 두께의 투명 보더를
// 두어 글자가 밀리지 않게 한다.
const RoomItem = styled('div', {
  shouldForwardProp: (prop) => prop !== '$selected',
})<{ $selected: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
  border-left: 3px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : 'transparent'};

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: flex-start;

  background-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.gray50 : theme.colors.white};

  cursor: pointer;

  transition: background-color 0.15s, border-color 0.15s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }
`;

const RoomItemBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const RoomItemTop = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: baseline;
  justify-content: space-between;
`;

const RoomRequesterEmail = styled(CopyableText)`
  color: ${({ theme }) => theme.colors.gray500};
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

// 긴 닉네임이 카테고리를 밀어내지 않도록 함께 줄어들게 둔다. 잘린 값은 title로 본다.
const RoomAssignee = styled.span`
  overflow: hidden;

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-direction: column;
  align-items: center;

  color: ${({ theme }) => theme.colors.gray400};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
