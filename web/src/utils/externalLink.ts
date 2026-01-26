import { isWebView } from './device';
import { isAppVersionSupported } from './version';
import { sendMessageToRN } from '@/libs/webview/webview.utils';

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
