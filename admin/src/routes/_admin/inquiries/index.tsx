import { createFileRoute, Link } from '@tanstack/react-router';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import { InquiryCategoryManager } from '@/pages/inquiries/InquiryCategoryManager';

export const Route = createFileRoute('/_admin/inquiries/')({
  component: InquiryCategoriesPage,
});

function InquiryCategoriesPage() {
  return (
    <Layout
      title="문의 카테고리 관리"
      rightAction={
        <Link to="/inquiries/rooms">
          <Button variant="secondary">채팅방 목록</Button>
        </Link>
      }
    >
      <ErrorBoundary fallback={<div>에러가 발생했습니다.</div>}>
        <Suspense fallback={<div>로딩 중...</div>}>
          <InquiryCategoryManager />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}
