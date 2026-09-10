import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Layout } from '@/components/Layout';
import { InquiryRoomListPanel } from '@/pages/inquiries/InquiryRoomListPanel';

export const Route = createFileRoute('/_admin/inquiries/rooms')({
  component: InquiryRoomsPage,
});

function InquiryRoomsPage() {
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  return (
    <Layout title="문의 채팅방">
      <ErrorBoundary fallback={<div>에러가 발생했습니다.</div>}>
        <Suspense fallback={<div>로딩 중...</div>}>
          <SplitContainer>
            <InquiryRoomListPanel
              selectedRoomId={selectedRoomId}
              onSelectRoom={setSelectedRoomId}
            />
            <DetailPlaceholder>
              {selectedRoomId
                ? `선택된 방: ${selectedRoomId}`
                : '왼쪽에서 문의를 선택하세요.'}
            </DetailPlaceholder>
          </SplitContainer>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

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
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.gray500};
`;
