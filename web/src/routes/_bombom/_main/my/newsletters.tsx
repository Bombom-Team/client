import { createFileRoute } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
import SubscribedNewslettersSection from '@/pages/my-page/components/SubscribedNewslettersSection/SubscribedNewslettersSection';

export const Route = createFileRoute('/_bombom/_main/my/newsletters')({
  component: NewslettersPage,
});

function NewslettersPage() {
  const device = useDevice();

  return <SubscribedNewslettersSection device={device} />;
}
