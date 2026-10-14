import { useEffect } from 'react';
import NotFoundCard from './NotFoundCard';
import { captureNotFound } from '@/libs/sentry/sentryUtils';

const NotFound = () => {
  useEffect(() => {
    captureNotFound({ path: window.location.pathname });
  }, []);

  return <NotFoundCard />;
};

export default NotFound;
