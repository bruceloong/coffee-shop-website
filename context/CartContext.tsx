"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { StaticImageData } from "next/image";

// 购物车商品接口
export interface CartItem {
  id: number;
  name: string;
  price: string;
  image: StaticImageData;
  quantity: number;
}

// 购物车上下文接口
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// 创建上下文
const CartContext = createContext<CartContextType | undefined>(undefined);

// 购物车提供者组件
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // 从本地存储加载购物车数据
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        // 由于图片对象无法序列化，这里需要特殊处理
        // 实际项目中可能需要存储图片路径而非对象
        setCartItems(parsedCart);
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
  }, []);

  // 保存购物车数据到本地存储
  useEffect(() => {
    if (cartItems.length > 0) {
      // 注意：这里的图片对象无法正确序列化，实际项目中需要特殊处理
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // 计算总数量和总价格
  useEffect(() => {
    const itemCount = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setTotalItems(itemCount);

    const price = cartItems.reduce((total, item) => {
      // 移除价格中的货币符号并转换为数字
      const priceValue = parseFloat(item.price.replace(/[^\d.]/g, ""));
      return total + priceValue * item.quantity;
    }, 0);
    setTotalPrice(price);
  }, [cartItems]);

  // 添加商品到购物车
  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        // 如果商品已存在，增加数量
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        // 如果商品不存在，添加新商品
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  // 从购物车移除商品
  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // 更新商品数量
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // 清空购物车
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 自定义钩子，用于访问购物车上下文
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
