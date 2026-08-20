import { useLocation } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';

export const usePageTracking = () => {
  const location = useLocation();
  const prevPathRef = useRef<string | null>(null);
  const prevPageLocationRef = useRef<string | null>(null);

  useEffect(() => {
    const currentPath = location.pathname;
    const currentPageLocation = window.location.href;
    const title = document.title;

    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'page_view', {
      page_path: currentPath,
      page_title: title,
      previous_path: prevPathRef.current,
      page_location: currentPageLocation,
      page_referrer: prevPageLocationRef.current ?? document.referrer,
    });

    prevPathRef.current = currentPath;
    prevPageLocationRef.current = currentPageLocation;
  }, [location.pathname]);
};

export default usePageTracking;
