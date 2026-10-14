import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_bombom/_main/my/')({
  beforeLoad: () => {
    throw redirect({ to: '/my/profile', replace: true });
  },
});
