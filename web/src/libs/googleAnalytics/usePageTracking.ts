import { useLocation } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';

interface UsePageTrackingParams {
  enabled: boolean;
  userId?: number;
}

const ALLOWED_CAMPAIGN_PARAMS = new Set([
  'utm_campaign',
  'utm_content',
  'utm_id',
  'utm_medium',
  'utm_source',
  'utm_term',
]);

const sanitizeAnalyticsUrl = (rawUrl: string) => {
  if (!rawUrl) return '';

  const url = new URL(rawUrl, window.location.origin);
  const campaignParams = new URLSearchParams();

  url.searchParams.forEach((value, key) => {
    if (ALLOWED_CAMPAIGN_PARAMS.has(key)) {
      campaignParams.append(key, value);
    }
  });

  url.search = campaignParams.toString();
  url.hash = '';

  return url.toString();
};

export const usePageTracking = ({ enabled, userId }: UsePageTrackingParams) => {
  const location = useLocation();
  const prevPathRef = useRef<string | null>(null);
  const prevPageLocationRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || typeof window.gtag !== 'function') return;

    window.gtag('set', {
      user_id: userId === undefined ? null : String(userId),
    });
  }, [enabled, userId]);

  useEffect(() => {
    if (!enabled || typeof window.gtag !== 'function') return;

    const currentPath = location.pathname;
    const currentPageLocation = sanitizeAnalyticsUrl(window.location.href);

    window.gtag('event', 'page_view', {
      page_path: currentPath,
      page_title: document.title,
      page_location: currentPageLocation,
      page_referrer:
        prevPageLocationRef.current ?? sanitizeAnalyticsUrl(document.referrer),
      previous_path: prevPathRef.current,
    });

    prevPathRef.current = currentPath;
    prevPageLocationRef.current = currentPageLocation;
  }, [enabled, location.pathname]);
};

export default usePageTracking;
