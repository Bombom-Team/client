import { toastStore } from './toastStore';
import type { ToastData } from '../Toast.types';
import type { Store } from './createStore';

export const updateToastsState = (
  store: Store,
  update: (toasts: ToastData[]) => ToastData[],
) => {
  const state = store.getState();
  const toasts = update([...state]);

  store.setState(toasts);
};

// 토스트 id는 화면 안에서만 구분하면 되므로 crypto.randomUUID 대신 카운터를 쓴다.
// Chrome 92 미만 WebView에는 crypto.randomUUID가 없다.
let toastIdCount = 0;

export const showToast = (toast: ToastData, store: Store = toastStore) => {
  toastIdCount += 1;
  const id = `toast-${toastIdCount}`;

  updateToastsState(store, (toasts) => {
    if (
      toasts.some(
        (storedToast) =>
          storedToast.message === toast.message &&
          storedToast.variant === toast.variant,
      )
    ) {
      return toasts;
    }
    return [...toasts, { ...toast, id }];
  });
};

export const hideToast = (id: string, store: Store = toastStore) => {
  updateToastsState(store, (toasts) =>
    toasts.filter((storedToast) => storedToast.id !== id),
  );
};

export const updateToast = (toast: ToastData, store: Store = toastStore) => {
  updateToastsState(store, (toasts) =>
    toasts.map((storedToast) => {
      if (storedToast.id === toast.id) {
        return { ...storedToast, ...toast };
      }
      return storedToast;
    }),
  );
};

export const cleanToasts = (store: Store = toastStore) => {
  updateToastsState(store, () => []);
};

export const toast = {
  success: (message: string) => showToast({ variant: 'success', message }),
  error: (message: string) => showToast({ variant: 'error', message }),
  info: (message: string) => showToast({ variant: 'info', message }),
} as const;
