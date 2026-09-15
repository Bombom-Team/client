import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/support/inquiry')({
  component: Outlet,
});
