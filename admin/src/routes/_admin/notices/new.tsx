import { createFileRoute } from '@tanstack/react-router';
import { NoticeEditor } from '@/pages/notices/NoticeEditor';

export const Route = createFileRoute('/_admin/notices/new')({
  component: NoticeEditor,
});
