import { ApiError } from '@bombom/shared/apis';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { membersQueries } from '@/apis/members/members.query';

export const Route = createFileRoute('/_admin')({
  component: RouteComponent,
  beforeLoad: async ({ context: { queryClient } }) => {
    try {
      await queryClient.fetchQuery(
        membersQueries.list({
          page: 0,
          size: 20,
        }),
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        return redirect({ to: '/403' });
      }
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
