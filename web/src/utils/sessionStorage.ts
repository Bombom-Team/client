type Serializable =
  | string
  | number
  | boolean
  | null
  | Serializable[]
  | { [key: string]: Serializable };

interface StorageType<T extends Serializable> {
  get: () => T;
  set: (data: T) => void;
  remove: () => void;
}

export const createSessionStorage = <T extends Serializable>(
  key: string,
  defaultData?: T,
): StorageType<T> => ({
  get() {
    try {
      const data = window.sessionStorage.getItem(key);
      return data ? JSON.parse(data) : defaultData;
    } catch {
      return defaultData;
    }
  },

  set(data) {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(data));
    } catch {
      // noop
    }
  },

  remove() {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // noop
    }
  },
});
