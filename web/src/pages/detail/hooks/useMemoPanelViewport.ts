import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

interface MemoPanelViewportStyle extends CSSProperties {
  '--memo-viewport-height'?: string;
  '--memo-viewport-top'?: string;
}

interface MemoPanelViewport {
  height: number;
  offsetTop: number;
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
          }
        : {},
    [viewport],
  );
};
