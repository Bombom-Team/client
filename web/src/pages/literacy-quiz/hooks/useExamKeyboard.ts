import { useEffect } from 'react';

interface UseExamKeyboardParams {
  isEnabled: boolean;
  currentIndex: number;
  choiceCounts: number[];
  onPick: (questionIndex: number, choice: number) => void;
  onMove: (questionIndex: number) => void;
}

// PC 답안지: 숫자키 1~4로 지금 문항의 답을 고르고, Enter로 다음 문항으로 넘어간다.
export const useExamKeyboard = ({
  isEnabled,
  currentIndex,
  choiceCounts,
  onPick,
  onMove,
}: UseExamKeyboardParams) => {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (event.key === 'Enter') {
        // 제출 버튼·확인 창에서는 Enter를 원래대로 둔다. 보기 버튼에 포커스가 있어도 다시 누르지 않고 넘어간다.
        if (
          event.target instanceof Element &&
          event.target.closest('[data-keep-enter]')
        ) {
          return;
        }
        event.preventDefault();
        onMove(Math.min(choiceCounts.length - 1, currentIndex + 1));
        return;
      }

      const choice = Number(event.key);
      const choiceCount = choiceCounts[currentIndex] ?? 0;
      if (!Number.isInteger(choice) || choice < 1 || choice > choiceCount) {
        return;
      }
      event.preventDefault();
      onPick(currentIndex, choice);
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [choiceCounts, currentIndex, isEnabled, onMove, onPick]);
};
