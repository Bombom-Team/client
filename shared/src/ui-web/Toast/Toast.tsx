import styled from '@emotion/styled';
import {
  DEFAULT_DURATION,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  DEFAULT_POSITION,
} from './Toast.constants';
import ToastItem from './ToastItem';
import { useToasts } from './useToasts';
import type { ToastPosition } from './Toast.types';

interface ToastProps {
  limit?: number;
  duration?: number;
  position?: ToastPosition;
  /** 토스트가 노출되는 모서리(top/bottom)로부터의 간격(px). 채널톡 버튼 등 고정 요소를 피할 때 사용. */
  offset?: number;
}

const Toast = ({
  limit = DEFAULT_LIMIT,
  duration = DEFAULT_DURATION,
  position = DEFAULT_POSITION,
  offset = DEFAULT_OFFSET,
}: ToastProps) => {
  const { toasts } = useToasts(limit);

  return (
    <Container role="log" aria-label="Notifications">
      <StackWrapper position={position} offset={offset}>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            isTop={position.startsWith('top')}
            duration={duration}
          />
        ))}
      </StackWrapper>
    </Container>
  );
};

export default Toast;

const Container = styled.div`
  position: fixed;
  z-index: ${({ theme }) => theme.zIndex.toast};

  inset: 0;
  pointer-events: none;
`;

const mapPosition = (p: ToastPosition, offset: number) => {
  const base = {
    top: 'auto',
    bottom: 'auto',
    left: 'auto',
    right: 'auto',
    transform: '',
    alignItems: 'stretch',
  };
  if (p.startsWith('top')) base.top = `${offset}px`;
  if (p.startsWith('bottom')) base.bottom = `${offset}px`;
  if (p.endsWith('left')) {
    base.left = '16px';
    base.alignItems = 'flex-start';
  }
  if (p.endsWith('right')) {
    base.right = '16px';
    base.alignItems = 'flex-end';
  }
  if (p.endsWith('center')) {
    base.left = '50%';
    base.transform = 'translateX(-50%)';
    base.alignItems = 'center';
  }
  return base;
};

const StackWrapper = styled.div<{ position: ToastPosition; offset: number }>`
  position: fixed;

  display: flex;
  ${({ position, offset }) => mapPosition(position, offset)}
  gap: 12px;
  flex-direction: column;

  pointer-events: none;
`;
