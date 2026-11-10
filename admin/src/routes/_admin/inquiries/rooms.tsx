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
  const [selectedRoom, setSelectedRoom] = useState<InquiryRoom | null>(null);

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
              selectedRoomId={selectedRoom?.id ?? null}
              onSelectRoom={setSelectedRoom}
            />
            {selectedRoom ? (
              <InquiryRoomDetailPanel
                key={selectedRoom.id}
                roomId={selectedRoom.id}
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
function RoomsSkeleton() {
  return (
    <SplitContainer role="status" aria-label="문의 목록 불러오는 중">
      <SkeletonListPanel>
        {Array.from({ length: 5 }, (_, index) => (
          <SkeletonRoomItem key={index}>
            <SkeletonCircle />
            <SkeletonLines>
              <SkeletonLine $width="60%" />
              <SkeletonLine $width="85%" />
            </SkeletonLines>
          </SkeletonRoomItem>
        ))}
      </SkeletonListPanel>
      <SkeletonDetailPanel />
    </SplitContainer>
  );
}

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
  flex: 1;
  gap: ${({ theme }) => theme.spacing.sm};
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

const SkeletonLine = styled(SkeletonBlock)<{ $width: string }>`
  width: ${({ $width }) => $width};
  height: 10px;
`;

const SkeletonDetailPanel = styled.div`
  flex: 1;

  background-color: ${({ theme }) => theme.colors.gray50};
`;

const SplitContainer = styled.div`
  height: calc(100vh - 64px - ${({ theme }) => theme.spacing.xl} * 2);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  display: flex;
  overflow: hidden;

  background-color: ${({ theme }) => theme.colors.white};
`;

const DetailPlaceholder = styled.div`
  display: flex;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.md};
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
