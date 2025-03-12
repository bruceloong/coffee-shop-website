"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } =
    useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  // 处理结算
  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    setIsProcessing(true);
    // 模拟处理时间
    setTimeout(() => {
      setIsProcessing(false);
      router.push("/checkout");
    }, 1000);
  };

  return (
    <div className="pt-24 pb-16">
      {/* 页面标题 */}
      <div className="bg-[var(--primary)] text-white py-16">
        <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            购物车
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "80px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1 bg-white mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-2xl mx-auto text-white/90"
          >
            查看您选择的商品并进行结算
          </motion.p>
        </div>
      </div>

      <div className="container-custom mt-12">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-2xl font-semibold mb-4">购物车是空的</h2>
            <p className="text-[var(--foreground)]/70 mb-8">
              您的购物车中还没有商品，快去选购吧！
            </p>
            <Link
              href="/menu"
              className="bg-[var(--primary)] text-white px-6 py-3 rounded-md hover:bg-[var(--primary-dark)] transition-colors duration-300"
            >
              浏览菜单
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 购物车商品列表 */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">购物车商品</h2>
                    <button
                      onClick={clearCart}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      清空购物车
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                    >
                      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-[var(--primary)] font-semibold mt-1">
                          {item.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* 订单摘要 */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">订单摘要</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/70">
                      商品总价
                    </span>
                    <span>¥{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground)]/70">配送费</span>
                    <span>¥0.00</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between font-semibold">
                    <span>总计</span>
                    <span className="text-[var(--primary)]">
                      ¥{totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing || cartItems.length === 0}
                  className={`w-full py-3 rounded-md font-medium transition-colors duration-300 ${
                    isProcessing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      处理中...
                    </span>
                  ) : (
                    "去结算"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
