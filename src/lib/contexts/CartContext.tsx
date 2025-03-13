"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "../api/productApi";

// 购物车项接口
export interface CartItem {
  product: Product;
  quantity: number;
}

// 购物车上下文接口
interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getItem: (productId: string) => CartItem | undefined;
}

// 创建购物车上下文
const CartContext = createContext<CartContextType | undefined>(undefined);

// 购物车提供者属性接口
interface CartProviderProps {
  children: ReactNode;
}

// 购物车提供者组件
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // 从本地存储加载购物车
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // 保存购物车到本地存储
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // 计算购物车总数量
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // 计算购物车总价格
  const totalPrice = items.reduce((total, item) => {
    const price = item.product.actualPrice || item.product.price;
    return total + price * item.quantity;
  }, 0);

  // 添加商品到购物车
  const addItem = (product: Product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product._id === product._id
      );

      if (existingItemIndex >= 0) {
        // 如果商品已存在，更新数量
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // 如果商品不存在，添加新商品
        return [...prevItems, { product, quantity }];
      }
    });
  };

  // 从购物车移除商品
  const removeItem = (productId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product._id !== productId)
    );
  };

  // 更新购物车商品数量
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  // 清空购物车
  const clearCart = () => {
    setItems([]);
  };

  // 检查商品是否在购物车中
  const isInCart = (productId: string) => {
    return items.some((item) => item.product._id === productId);
  };

  // 获取购物车中的商品
  const getItem = (productId: string) => {
    return items.find((item) => item.product._id === productId);
  };

  // 提供上下文值
  const value = {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// 使用购物车上下文的钩子
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
