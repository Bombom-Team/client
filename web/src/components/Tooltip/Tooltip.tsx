import styled from '@emotion/styled';
import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CSSProperties, PropsWithChildren } from 'react';

type TooltipPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

interface TooltipProps {
  id?: string;
  opened: boolean;
  position?: TooltipPosition;
  anchorRef: { current: HTMLElement | null };
}

const OFFSET_PX = 8;

const Tooltip = ({
  id,
  opened,
  position = 'top',
  anchorRef,
  children,
}: PropsWithChildren<TooltipProps>) => {
  const [style, setStyle] = useState<CSSProperties | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!opened) return;

    const updatePosition = () => {
      if (!anchorRef.current || !tooltipRef.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      let left = rect.left;
      let top = rect.top;

      switch (position) {
        case 'top':
          left = rect.left;
          top = rect.top - tooltipRect.height - OFFSET_PX;
          break;
        case 'bottom':
          left = rect.left;
          top = rect.bottom + OFFSET_PX;
          break;
        case 'left':
          left = rect.left - tooltipRect.width - OFFSET_PX;
          top = rect.top + rect.height / 2 - tooltipRect.height / 2;
          break;
        case 'right':
          left = rect.right + OFFSET_PX;
          top = rect.top + rect.height / 2 - tooltipRect.height / 2;
          break;
        case 'top-left':
          left = rect.right - tooltipRect.width;
          top = rect.top - tooltipRect.height - OFFSET_PX;
          break;
        case 'top-right':
          left = rect.left;
          top = rect.top - tooltipRect.height - OFFSET_PX;
          break;
        case 'bottom-left':
          left = rect.right - tooltipRect.width;
          top = rect.bottom + OFFSET_PX;
          break;
        case 'bottom-right':
        default:
          left = rect.left;
          top = rect.bottom + OFFSET_PX;
      }

      setStyle({
        left,
        top,
      });
    };

    updatePosition();
  }, [anchorRef, opened, position]);

  const portalOpened = opened && Boolean(style);
  const content = (
    <Container
      ref={tooltipRef}
      role="tooltip"
      id={id}
      opened={portalOpened}
      style={style ?? {}}
    >
      {children}
    </Container>
  );

  if (typeof document === 'undefined') return content;

  return createPortal(content, document.body);
};

export default Tooltip;

const Container = styled.div<{ opened: boolean }>`
  visibility: hidden;
  position: fixed;
  z-index: ${({ theme }) => theme.zIndex.elevated};
  width: max-content;
  max-width: 280px;
  padding: 10px 12px;
  border-radius: 10px;
  box-shadow: 0 10px 20px -12px rgb(0 0 0 / 35%);

  background: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.caption};

  opacity: 0;
  transition:
    opacity 0.15s ease,
    visibility 0.15s;

  ${({ opened }) =>
    opened &&
    `
      visibility: visible;
      opacity: 1;
    `}
`;
