import "@testing-library/jest-dom/vitest";

/**
 * Node ≥22 的实验性 global localStorage 会遮蔽 jsdom 的实现，
 * 导致 window.localStorage 为 undefined。这里补一个内存实现，语义与标准一致。
 */
if (typeof window !== "undefined" && !window.localStorage) {
  const store = new Map<string, string>();
  const memoryStorage: Storage = {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key: string) => store.get(key) ?? null,
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => {
      store.delete(key);
    },
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
  };
  Object.defineProperty(window, "localStorage", {
    value: memoryStorage,
    configurable: true,
  });
}
