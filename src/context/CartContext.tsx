"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, MenuItem } from "@/types";

const STORAGE_KEY = "brew-haven-cart";

/** 校验 localStorage 恢复的数据，防止脏数据导致渲染崩溃 */
function isValidCartItem(item: unknown): item is CartItem {
  if (typeof item !== "object" || item === null) return false;
  const it = item as Record<string, unknown>;
  return (
    typeof it.id === "number" &&
    typeof it.name === "string" &&
    typeof it.price === "number" &&
    typeof it.imageSrc === "string" &&
    typeof it.quantity === "number" &&
    it.quantity > 0
  );
}

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidCartItem);
  } catch {
    return [];
  }
}

interface CartContextValue {
  cartItems: CartItem[];
  /** localStorage 恢复是否完成（避免 SSR 水合期间 badge 闪烁） */
  isHydrated: boolean;
  totalItems: number;
  totalPrice: number;
  addToCart: (item: Pick<MenuItem, "id" | "name" | "price"> & { imageSrc: string }) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // 挂载后从 localStorage 恢复
  useEffect(() => {
    setCartItems(readStoredCart());
    setIsHydrated(true);
  }, []);

  // 恢复完成后，任何变化都无条件持久化（包括清空为空数组）
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // 隐私模式等场景下写入失败时静默降级，不影响功能
    }
  }, [cartItems, isHydrated]);

  const addToCart = useCallback(
    (item: Pick<MenuItem, "id" | "name" | "price"> & { imageSrc: string }) => {
      setCartItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...prev, { ...item, quantity: 1 }];
      });
    },
    []
  );

  const removeFromCart = useCallback((id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    setCartItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.id !== id);
      return prev.map((i) => (i.id === id ? { ...i, quantity } : i));
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const totalItems = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.quantity, 0),
    [cartItems]
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      isHydrated,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [cartItems, isHydrated, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart 必须在 CartProvider 内使用");
  }
  return ctx;
}
