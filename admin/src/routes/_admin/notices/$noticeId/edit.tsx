import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { noticesQueries } from '@/apis/notices/notices.query';
import { NoticeEditor } from '@/pages/notices/NoticeEditor';

export const Route = createFileRoute('/_admin/notices/$noticeId/edit')({
  component: NoticeEditPage,
});

function NoticeEditPage() {
  const { noticeId } = Route.useParams();
  const id = Number(noticeId);
  const { data: notice } = useSuspenseQuery(noticesQueries.detail(id));

  return (
    <NoticeEditor
      noticeId={id}
      initialTitle={notice.title}
      initialContent={notice.content}
      initialCategory={notice.noticeCategory}
      // 기존 공지는 모두 공개 상태 — 백엔드에 visibility 생기면 notice.visibility로 교체
      initialVisibility="PUBLIC"
    />
  );
}
