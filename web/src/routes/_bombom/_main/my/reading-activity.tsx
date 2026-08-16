import { createFileRoute } from '@tanstack/react-router';
import ReadingActivitySection from '@/pages/my-page/components/ReadingActivitySection';

export const Route = createFileRoute('/_bombom/_main/my/reading-activity')({
  component: ReadingActivityPage,
});

function ReadingActivityPage() {
  return <ReadingActivitySection />;
}
