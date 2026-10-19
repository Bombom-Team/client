import { APP_STORE_LINK, PLAY_STORE_LINK } from '@bombom/shared';
import { getDeviceInWebApp } from '@bombom/shared/ui-web';

export const downloadApp = () => {
  const device = getDeviceInWebApp();
  if (!device) return;

  window.location.href =
    device === 'android' ? PLAY_STORE_LINK : APP_STORE_LINK;
};
