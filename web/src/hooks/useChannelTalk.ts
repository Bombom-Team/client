import { useEffect } from 'react';
import { useDevice } from './useDevice';
import {
  hideChannelButton,
  showChannelButton,
} from '@/libs/channelTalk/channelTalk.utils';
import { initChannelTalk } from '@/libs/channelTalk/initChannelTalk';

export const useChannelTalk = () => {
  const device = useDevice();

  useEffect(() => {
    initChannelTalk();
  }, []);

  useEffect(() => {
    if (device === 'pc') {
      showChannelButton();
    } else {
      hideChannelButton();
    }
  }, [device]);
};
