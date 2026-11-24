import { useEffect, useState } from 'react';

interface UseKeyboardInsetParams {
  enabled: boolean;
}

/**
 * 화면 아래에서 키보드가 가리는 높이를 구한다.
 * Android Chrome·iOS Safari는 키보드가 열려도 layout viewport를 줄이지 않고 visual viewport만 줄이므로,
 * 두 높이의 차이로 키보드 높이를 계산한다. 키보드가 닫혀 있거나 layout viewport가 함께 줄어드는 환경에서는 0이다.
 */
export const useKeyboardInset = ({ enabled }: UseKeyboardInsetParams) => {
  const [keyboardInset, setKeyboardInset] = useState(0);

  useEffect(() => {
    const visualViewport = window.visualViewport;
    if (!enabled || !visualViewport) return;

    let animationFrameId: number | null = null;

    const updateKeyboardInset = () => {
      const visibleBottom = visualViewport.offsetTop + visualViewport.height;
      setKeyboardInset(
        Math.max(0, Math.round(window.innerHeight - visibleBottom)),
      );
    };

    const scheduleUpdate = () => {
      if (animationFrameId !== null) return;

      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = null;
        updateKeyboardInset();
      });
    };

    updateKeyboardInset();
    visualViewport.addEventListener('resize', scheduleUpdate);
    visualViewport.addEventListener('scroll', scheduleUpdate);

    return () => {
      visualViewport.removeEventListener('resize', scheduleUpdate);
      visualViewport.removeEventListener('scroll', scheduleUpdate);
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
      setKeyboardInset(0);
    };
  }, [enabled]);

  return keyboardInset;
};
