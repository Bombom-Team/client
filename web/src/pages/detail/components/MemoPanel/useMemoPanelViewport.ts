import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

interface MemoPanelViewportStyle extends CSSProperties {
  '--memo-viewport-height'?: string;
  '--memo-viewport-top'?: string;
}

export const useMemoPanelViewport = () => {
  const [viewportStyle, setViewportStyle] = useState<MemoPanelViewportStyle>(
    {},
  );

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const updateViewport = () => {
      setViewportStyle({
        '--memo-viewport-height': `${viewport.height}px`,
        '--memo-viewport-top': `${viewport.offsetTop}px`,
      });
    };

    updateViewport();
    viewport.addEventListener('resize', updateViewport);
    viewport.addEventListener('scroll', updateViewport);

    return () => {
      viewport.removeEventListener('resize', updateViewport);
      viewport.removeEventListener('scroll', updateViewport);
    };
  }, []);

  return viewportStyle;
};
