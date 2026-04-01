import { createFileRoute } from '@tanstack/react-router';
import { BlogList } from '@/pages/blog/BlogList';

export const Route = createFileRoute('/_admin/blog/')({
  component: BlogList,
});
