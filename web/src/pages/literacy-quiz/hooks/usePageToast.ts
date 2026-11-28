import { useCallback, useEffect, useMemo, useState } from 'react';

const TOAST_DURATION_MS = 1900;

interface PageToastState {
  id: number;
  message: string;
}

// 결과 화면 전용 하단 토스트. 공용 토스트는 휴대폰에서 아래 고정 버튼과 겹쳐서 따로 둔다.
export const usePageToast = () => {
  const [toastState, setToastState] = useState<PageToastState | null>(null);

  useEffect(() => {
    if (!toastState) return;
    const timerId = setTimeout(() => setToastState(null), TOAST_DURATION_MS);
    return () => clearTimeout(timerId);
  }, [toastState]);

  const showToast = useCallback((message: string) => {
    setToastState((current) => ({ id: (current?.id ?? 0) + 1, message }));
  }, []);

  return useMemo(
    () => ({
      toastMessage: toastState?.message ?? null,
      toastId: toastState?.id ?? 0,
      showToast,
    }),
    [showToast, toastState],
  );
};
