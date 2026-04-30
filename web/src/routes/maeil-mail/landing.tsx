import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

const MAEIL_MAIL_URL = 'https://maeilmail.bombom.news';

export const Route = createFileRoute('/maeil-mail/landing')({
  component: MaeilMailLandingRedirect,
});

function MaeilMailLandingRedirect() {
  useEffect(() => {
    window.location.replace(MAEIL_MAIL_URL);
  }, []);

  return null;
}
