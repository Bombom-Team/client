import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

interface MemoPanelViewportStyle extends CSSProperties {
  '--memo-viewport-height'?: string;
  '--memo-viewport-top'?: string;
  '--memo-viewport-width'?: string;
  '--memo-viewport-left'?: string;
}

interface MemoPanelViewport {
  height: number;
  offsetTop: number;
  width: number;
  offsetLeft: number;
}

export const useMemoPanelViewport = () => {
  const [viewport, setViewport] = useState<MemoPanelViewport | null>(null);

  useEffect(() => {
    const visualViewport = window.visualViewport;
    if (!visualViewport) return;

    let animationFrameId: number | null = null;

    const updateViewport = () => {
      setViewport({
        height: visualViewport.height,
        offsetTop: visualViewport.offsetTop,
        width: visualViewport.width,
        offsetLeft: visualViewport.offsetLeft,
      });
    };

    const scheduleViewportUpdate = () => {
      if (animationFrameId !== null) return;

      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = null;
        updateViewport();
      });
    };

    updateViewport();
    visualViewport.addEventListener('resize', scheduleViewportUpdate);
    visualViewport.addEventListener('scroll', scheduleViewportUpdate);

    return () => {
      visualViewport.removeEventListener('resize', scheduleViewportUpdate);
      visualViewport.removeEventListener('scroll', scheduleViewportUpdate);
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return useMemo<MemoPanelViewportStyle>(
    () =>
      viewport
        ? {
            '--memo-viewport-height': `${viewport.height}px`,
            '--memo-viewport-top': `${viewport.offsetTop}px`,
            '--memo-viewport-width': `${viewport.width}px`,
            '--memo-viewport-left': `${viewport.offsetLeft}px`,
          }
        : {},
    [viewport],
  );
};
