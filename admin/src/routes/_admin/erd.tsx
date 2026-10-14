import { createFileRoute } from '@tanstack/react-router';
import ErdPage from '@/pages/erd/ErdPage';

export const Route = createFileRoute('/_admin/erd')({
  component: ErdPage,
});
