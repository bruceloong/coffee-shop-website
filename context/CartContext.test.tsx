import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";

const espresso = { id: 1, name: "意式浓缩", price: 28, imageSrc: "/images/espresso.jpg" };
const latte = { id: 3, name: "拿铁", price: 32, imageSrc: "/images/latte.jpg" };

function useTestCart() {
  return useCart();
}

describe("CartContext", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("初始状态为空购物车", () => {
    const { result } = renderHook(useTestCart, { wrapper: CartProvider });
    expect(result.current.cartItems).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
    expect(result.current.isHydrated).toBe(true);
  });

  it("添加商品到购物车", () => {
    const { result } = renderHook(useTestCart, { wrapper: CartProvider });
    act(() => result.current.addToCart(espresso));
    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0]).toEqual({ ...espresso, quantity: 1 });
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBe(28);
  });

  it("重复添加同一商品时合并数量", () => {
    const { result } = renderHook(useTestCart, { wrapper: CartProvider });
    act(() => result.current.addToCart(latte));
    act(() => result.current.addToCart(latte));
    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].quantity).toBe(2);
    expect(result.current.totalPrice).toBe(64);
  });

  it("updateQuantity 将数量更新为 0 时移除商品", () => {
    const { result } = renderHook(useTestCart, { wrapper: CartProvider });
    act(() => result.current.addToCart(espresso));
    act(() => result.current.updateQuantity(espresso.id, 0));
    expect(result.current.cartItems).toHaveLength(0);
  });

  it("removeFromCart 移除指定商品", () => {
    const { result } = renderHook(useTestCart, { wrapper: CartProvider });
    act(() => result.current.addToCart(espresso));
    act(() => result.current.addToCart(latte));
    act(() => result.current.removeFromCart(espresso.id));
    expect(result.current.cartItems.map((i) => i.id)).toEqual([latte.id]);
  });

  it("持久化到 localStorage 的字段只含可序列化基础字段", () => {
    const { result } = renderHook(useTestCart, { wrapper: CartProvider });
    act(() => result.current.addToCart(espresso));
    const raw = window.localStorage.getItem("brew-haven-cart");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed).toEqual([{ id: 1, name: "意式浓缩", price: 28, imageSrc: "/images/espresso.jpg", quantity: 1 }]);
  });

  it("clearCart 后 localStorage 中为空数组", () => {
    const { result } = renderHook(useTestCart, { wrapper: CartProvider });
    act(() => result.current.addToCart(espresso));
    act(() => result.current.clearCart());
    expect(result.current.cartItems).toEqual([]);
    expect(JSON.parse(window.localStorage.getItem("brew-haven-cart")!)).toEqual([]);
  });

  it("移除最后一项后 localStorage 持久化为空数组", () => {
    const { result } = renderHook(useTestCart, { wrapper: CartProvider });
    act(() => result.current.addToCart(espresso));
    act(() => result.current.removeFromCart(espresso.id));
    expect(JSON.parse(window.localStorage.getItem("brew-haven-cart")!)).toEqual([]);
  });

  it("从 localStorage 恢复购物车", () => {
    window.localStorage.setItem(
      "brew-haven-cart",
      JSON.stringify([{ ...espresso, quantity: 2 }])
    );
    const { result } = renderHook(useTestCart, { wrapper: CartProvider });
    expect(result.current.cartItems).toEqual([{ ...espresso, quantity: 2 }]);
    expect(result.current.totalItems).toBe(2);
  });

  it("恢复时过滤不符合结构的脏数据", () => {
    window.localStorage.setItem(
      "brew-haven-cart",
      JSON.stringify([
        { id: 1, name: "意式浓缩", price: 28, imageSrc: "/x.jpg", quantity: 1 },
        { id: "bad", name: 123, price: "9", imageSrc: null, quantity: -1 },
        null,
        42,
      ])
    );
    const { result } = renderHook(useTestCart, { wrapper: CartProvider });
    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].id).toBe(1);
  });

  it("localStorage 中 JSON 损坏时安全降级为空购物车", () => {
    window.localStorage.setItem("brew-haven-cart", "{not-json");
    const { result } = renderHook(useTestCart, { wrapper: CartProvider });
    expect(result.current.cartItems).toEqual([]);
  });

  it("在 Provider 外使用 useCart 时抛出错误", () => {
    expect(() => renderHook(useTestCart)).toThrow(/CartProvider/);
  });
});
