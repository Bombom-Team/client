import { useEffect } from 'react';

// 확인창·가림막이 닫히면 열리기 전에 초점이 있던 곳(풀이 화면)으로 초점을 돌려준다.
export const useRestoreFocus = () => {
  useEffect(() => {
    const previousElement = document.activeElement;
    return () => {
      if (
        previousElement instanceof HTMLElement &&
        previousElement.isConnected
      ) {
        previousElement.focus({ preventScroll: true });
      }
    };
  }, []);
};
