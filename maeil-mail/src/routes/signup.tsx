import { createFileRoute, useSearch } from '@tanstack/react-router';
import { useEffect } from 'react';
import { WEB_URL } from '@/constants/urls';

export const Route = createFileRoute('/signup')({
  head: () => ({
    meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  }),
  component: RouteComponent,
  validateSearch: (search: { email?: string; name?: string }) => ({
    email: search.email,
    name: search.name,
  }),
});

function RouteComponent() {
  const { email, name } = useSearch({ from: '/signup' });

  useEffect(() => {
    const params = new URLSearchParams();
    if (email) params.set('email', email);
    if (name) params.set('name', name);
    window.location.replace(`${WEB_URL}/signup?${params.toString()}`);
  }, [email, name]);

  return null;
}
