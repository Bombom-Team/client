import { useEffect } from 'react';
import {
  hideChannelButton,
  showChannelButton,
} from '@/libs/channelTalk/channelTalk.utils';
import { initChannelTalk } from '@/libs/channelTalk/initChannelTalk';
import { useDevice } from './useDevice';

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
