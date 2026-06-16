import { createFileRoute } from '@tanstack/react-router';
import { FlywayViewer } from '@/pages/flyway/FlywayViewer';

export const Route = createFileRoute('/_admin/flyway')({
  component: FlywayViewer,
});
