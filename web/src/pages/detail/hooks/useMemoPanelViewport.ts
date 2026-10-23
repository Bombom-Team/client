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

    const updateViewport = () => {
      setViewport({
        height: visualViewport.height,
        offsetTop: visualViewport.offsetTop,
        width: visualViewport.width,
        offsetLeft: visualViewport.offsetLeft,
      });
    };

    updateViewport();
    visualViewport.addEventListener('resize', updateViewport);
    visualViewport.addEventListener('scroll', updateViewport);

    return () => {
      visualViewport.removeEventListener('resize', updateViewport);
      visualViewport.removeEventListener('scroll', updateViewport);
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
