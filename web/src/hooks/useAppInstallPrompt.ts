import { useEffect, useRef, useState } from 'react';
import { useLocalStorageState } from './useLocalStorageState';
import { getDeviceInWebApp, isWebView } from '@/utils/device';
import { downloadApp } from '@/utils/downloadApp';

const APP_INSTALL_DISMISSED_KEY = 'app-install-prompt-dismissed';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7일

export function useAppInstallPrompt() {
  const modalRef = useRef<HTMLDivElement>(null);
  const [dismissedUntil, setDismissedUntil] = useLocalStorageState<number>(
    APP_INSTALL_DISMISSED_KEY,
    0,
  );
  const [isShowModal, setIsShowModal] = useState(false);

  useEffect(() => {
    const device = getDeviceInWebApp();
    if (isWebView() || !device) return;
    if (dismissedUntil && Date.now() < dismissedUntil) return;

    setIsShowModal(true);
  }, [dismissedUntil]);

  const handleInstallClick = () => {
    downloadApp();
  };

  const handleLaterClick = () => {
    setDismissedUntil(Date.now() + DISMISS_DURATION);
    setIsShowModal(false);
  };

  const handleCloseModal = () => {
    setIsShowModal(false);
  };

  return {
    modalRef,
    isShowModal,
    handleInstallClick,
    handleLaterClick,
    handleCloseModal,
  };
}
