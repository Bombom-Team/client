import { useCallback, useRef, useState } from 'react';

type Serializable =
  | string
  | number
  | boolean
  | null
  | Serializable[]
  | { [key: string]: Serializable };

export const useSessionStorageState = <T extends Serializable>(
  key: string,
  defaultValue?: T,
) => {
  const [storedValue, setStoredValue] = useState<T | undefined>(() => {
    try {
      const value = window.sessionStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });
  const storedValueRef = useRef(storedValue);

  const setValue = useCallback(
    (value: T | ((prev: T | undefined) => T)) => {
      const valueToStore =
        typeof value === 'function' ? value(storedValueRef.current) : value;
      storedValueRef.current = valueToStore;

      try {
        if (valueToStore === null) {
          window.sessionStorage.removeItem(key);
        } else {
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch {
        // noop
      }

      setStoredValue(valueToStore);
    },
    [key],
  );

  return [storedValue, setValue] as const;
};
