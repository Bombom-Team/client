import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { queries } from '@/apis/queries';
import ProfileSection from '@/pages/my-page/components/ProfileSection';

export const Route = createFileRoute('/_bombom/_main/my/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const { data: userInfo } = useQuery(queries.me());

  if (!userInfo) return null;

  return <ProfileSection userInfo={userInfo} />;
}
