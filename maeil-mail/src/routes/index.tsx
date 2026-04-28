import { createFileRoute } from '@tanstack/react-router';
import LandingPage from '@/pages/landing/components/LandingPage';

export const Route = createFileRoute('/')({
  component: LandingPage,
});
