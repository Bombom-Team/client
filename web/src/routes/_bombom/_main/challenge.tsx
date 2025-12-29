import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_bombom/_main/challenge')({
  component: () => <Outlet />,
});
