import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { noticesQueries } from '@/apis/notices/notices.query';
import { NoticeEditor } from '@/pages/notices/NoticeEditor';
import type { PageableResponse } from '@/apis/types/PageableResponse';
import type { Notice } from '@/types/notice';

export const Route = createFileRoute('/_admin/notices/$noticeId/edit')({
  component: NoticeEditPage,
});

function NoticeEditPage() {
  const { noticeId } = Route.useParams();
  const id = Number(noticeId);
  const { data: notice } = useSuspenseQuery(noticesQueries.detail(id));
  const queryClient = useQueryClient();

  // 상세 응답엔 visibility가 없어, 이미 조회한 목록 캐시에서 공개 상태를 보강
  // (목록 응답 GetNoticeResponse에는 visibility가 포함됨). 캐시에 없으면 공개로 간주
  const listedVisibility = queryClient
    .getQueriesData<PageableResponse<Notice>>({ queryKey: ['notices'] })
    .flatMap(([, page]) => page?.content ?? [])
    .find((item) => item.id === id)?.visibility;

  return (
    <NoticeEditor
      noticeId={id}
      initialTitle={notice.title}
      initialContent={notice.content}
      initialCategory={notice.noticeCategory}
      initialVisibility={listedVisibility ?? 'PUBLIC'}
    />
  );
}
