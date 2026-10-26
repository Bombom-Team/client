import {
  isWebView,
  isAppVersionSupported,
  sendMessageToRN,
} from '@bombom/shared/ui-web';

export const openExternalLink = (link: string) => {
  const url = link.startsWith('http') ? link : `https://${link}`;
  const inAppBrowserUpdated = isAppVersionSupported('1.0.2');

  if (isWebView() && inAppBrowserUpdated) {
    sendMessageToRN({
      type: 'OPEN_BROWSER',
      payload: { url },
    });
  } else window.open(url, '_blank', 'noopener,noreferrer');
};
