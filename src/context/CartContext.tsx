"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { StaticImageData } from "next/image";
import { orderAPI } from "@/services/api";
import { toast } from "react-hot-toast";

// 购物车商品接口
export interface CartItem {
  id: string; // 修改为字符串类型，与MongoDB的_id匹配
  name: string;
  price: number; // 修改为数字类型，与后端匹配
  image: string | StaticImageData; // 支持字符串URL或StaticImageData
  quantity: number;
  category?: string;
}

// 购物车上下文接口
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (contactInfo: ContactInfo) => Promise<any>;
  isLoading: boolean;
  totalItems: number;
  totalPrice: number;
}

// 联系信息接口
interface ContactInfo {
  name: string;
  phone: string;
  address?: string;
}

// 创建上下文
const CartContext = createContext<CartContextType | undefined>(undefined);

// 购物车提供者组件
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 从本地存储加载购物车数据
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);
          setCartItems(parsedCart);
        } catch (error) {
          console.error("Failed to parse cart from localStorage:", error);
        }
      }
    }
  }, []);

  // 保存购物车数据到本地存储
  useEffect(() => {
    if (cartItems.length > 0 && typeof window !== "undefined") {
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
      // 如果价格是字符串，转换为数字
      const priceValue =
        typeof item.price === "string"
          ? parseFloat(item.price.replace(/[^\d.]/g, ""))
          : item.price;
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

    // 显示添加成功提示
    toast.success(`已添加 ${item.name} 到购物车`);
  };

  // 从购物车移除商品
  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // 更新商品数量
  const updateQuantity = (id: string, quantity: number) => {
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
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
  };

  // 结账功能
  const checkout = async (contactInfo: ContactInfo) => {
    setIsLoading(true);
    try {
      // 准备订单数据
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        paymentMethod: "alipay", // 默认支付方式，可以根据需要修改
        contactInfo,
        note: "",
      };

      // 调用API创建订单
      const result = await orderAPI.createOrder(orderData);

      // 成功后清空购物车
      clearCart();

      // 显示成功消息
      toast.success("订单创建成功！");

      setIsLoading(false);
      return result;
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.response?.data?.message || "结账失败，请重试");
      setIsLoading(false);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
        isLoading,
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
