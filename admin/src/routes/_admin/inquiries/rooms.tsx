import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FiMessageSquare } from 'react-icons/fi';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import { InquiryRoomDetailPanel } from '@/pages/inquiries/InquiryRoomDetailPanel';
import { InquiryRoomListPanel } from '@/pages/inquiries/InquiryRoomListPanel';
import type { InquiryRoom } from '@/types/inquiry';

export const Route = createFileRoute('/_admin/inquiries/rooms')({
  component: InquiryRoomsPage,
});

function InquiryRoomsPage() {
  // 선택한 방의 id와 표시용 정보를 함께 들고 있는다. 목록이 다시 조회되면
  // onSelectedRoomChange로 최신 값이 올라와 담당자·상태가 바뀌어도 어긋나지 않는다.
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<InquiryRoom | undefined>();

  // id와 방 정보를 같은 시점에 바꾼다. id만 먼저 바꾸면 새 상세 패널의 첫 렌더에
  // 이전 방의 문의자 이름·이메일이 들어가, 그 순간 누르면 엉뚱한 주소가 복사된다.
  const handleSelectRoom = (room: InquiryRoom) => {
    setSelectedRoomId(room.id);
    setSelectedRoom(room);
  };

  return (
    <Layout
      title="문의 채팅방"
      rightAction={
        <Link to="/inquiries">
          <Button variant="secondary">카테고리 관리</Button>
        </Link>
      }
    >
      <ErrorBoundary fallback={<div>에러가 발생했습니다.</div>}>
        <Suspense fallback={<RoomsSkeleton />}>
          <SplitContainer>
            <InquiryRoomListPanel
              selectedRoomId={selectedRoomId}
              onSelectRoom={handleSelectRoom}
              onSelectedRoomChange={setSelectedRoom}
            />
            {selectedRoomId !== null ? (
              <InquiryRoomDetailPanel
                key={selectedRoomId}
                roomId={selectedRoomId}
                listRoom={selectedRoom}
              />
            ) : (
              <DetailPlaceholder>
                <FiMessageSquare size={40} aria-hidden="true" />
                <PlaceholderText>왼쪽에서 문의를 선택하세요</PlaceholderText>
              </DetailPlaceholder>
            )}
          </SplitContainer>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

// 실제 화면과 같은 2단 골격을 유지해, 로딩이 끝나도 레이아웃이 튀지 않는다.
const RoomsSkeleton = () => {
  return (
    <SplitContainer role="status" aria-label="문의 목록 불러오는 중">
      <SkeletonListPanel>
        {Array.from({ length: 5 }, (_, index) => (
          <SkeletonRoomItem key={index}>
            <SkeletonCircle />
            <SkeletonLines>
              <SkeletonLine width="60%" />
              <SkeletonLine width="85%" />
            </SkeletonLines>
          </SkeletonRoomItem>
        ))}
      </SkeletonListPanel>
      <SkeletonDetailPanel />
    </SplitContainer>
  );
};

const shimmer = keyframes`
  from { opacity: 0.55; }
  to { opacity: 1; }
`;

const SkeletonListPanel = styled.div`
  width: 320px;
  min-width: 320px;
  border-right: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const SkeletonRoomItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: flex-start;
`;

const SkeletonLines = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
  flex-direction: column;
`;

const SkeletonBlock = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  background-color: ${({ theme }) => theme.colors.gray100};

  animation: ${shimmer} 0.9s ease-in-out infinite alternate;
`;

const SkeletonCircle = styled(SkeletonBlock)`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.full};

  flex-shrink: 0;
`;

const SkeletonLine = styled(SkeletonBlock)<{ width: string }>`
  width: ${({ width }) => width};
  height: 8px;
`;

const SkeletonDetailPanel = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.gray50};
`;

const SplitContainer = styled.div`
  overflow: hidden;

  /* 안쪽 헤더나 메시지가 길어도 이 상자를 넓히지 못하게 묶는다. 묶지 않으면
     상위 레이아웃까지 밀려 사이드바 옆 영역 전체가 오른쪽으로 흐른다. */
  width: 100%;
  height: calc(100vh - 64px - ${({ theme }) => theme.spacing.xl} * 2);
  max-width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  display: flex;

  background-color: ${({ theme }) => theme.colors.white};
`;

const DetailPlaceholder = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.gray50};
  color: ${({ theme }) => theme.colors.gray400};
`;

const PlaceholderText = styled.p`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
