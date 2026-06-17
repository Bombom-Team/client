import html2canvas from 'html2canvas';
import { useRef } from 'react';
import { sendMessageToRN } from '@/libs/webview/webview.utils';
import { isWebView } from '@/utils/device';

export const useCertificateDownload = (nickname?: string) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const download = async () => {
    if (!certificateRef.current || !nickname) return;

    const canvas = await html2canvas(certificateRef.current, {
      scale: window.devicePixelRatio || 1,
    });
    const fileName = `${nickname}_수료증.png`;

    if (isWebView()) {
      const imageFileBase64 = canvas.toDataURL('image/png');
      sendMessageToRN({
        type: 'SAVE_IMAGE',
        payload: { imageFileBase64, fileName },
      });
    } else {
      const link = document.createElement('a');
      link.download = fileName;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return { certificateRef, download };
};
