"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

// 支付方式类型
type PaymentMethod = "alipay" | "wechat";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, totalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("alipay");
  const [orderNumber, setOrderNumber] = useState("");
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // 生成随机订单号
  useEffect(() => {
    const generateOrderNumber = () => {
      const timestamp = new Date().getTime();
      const random = Math.floor(Math.random() * 1000);
      return `BH${timestamp}${random}`;
    };

    setOrderNumber(generateOrderNumber());
  }, []);

  // 如果购物车为空，重定向到购物车页面
  useEffect(() => {
    if (cartItems.length === 0 && !showSuccess) {
      router.push("/cart");
    }
  }, [cartItems, router, showSuccess]);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  // 处理支付方式选择
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  // 生成支付二维码
  const handleGenerateQRCode = (e: React.FormEvent) => {
    e.preventDefault();

    // 验证表单
    if (!contactInfo.name || !contactInfo.phone) {
      alert("请填写姓名和电话");
      return;
    }

    setIsGeneratingQR(true);

    // 模拟生成二维码的过程
    setTimeout(() => {
      setIsGeneratingQR(false);
      setShowQRCode(true);
    }, 1500);
  };

  // 模拟支付完成
  const handlePaymentComplete = () => {
    setShowQRCode(false);
    setShowSuccess(true);
    clearCart(); // 清空购物车
  };

  // 渲染支付成功页面
  if (showSuccess) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md p-8 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-4">支付成功！</h1>
            <p className="text-[var(--foreground)]/70 mb-2">
              您的订单 #{orderNumber} 已支付成功
            </p>
            <p className="text-[var(--foreground)]/70 mb-8">
              我们将尽快为您准备订单，感谢您的惠顾！
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-3 bg-[var(--secondary)]/20 hover:bg-[var(--secondary)]/40 rounded-md transition-colors duration-300"
              >
                返回首页
              </Link>
              <Link
                href="/menu"
                className="px-6 py-3 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-colors duration-300"
              >
                继续购物
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            结算
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
            完成您的订单并进行支付
          </motion.p>
        </div>
      </div>

      <div className="container-custom mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 结算表单 */}
          <div className="lg:col-span-2">
            {showQRCode ? (
              <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md p-8">
                <h2 className="text-xl font-semibold mb-6">请扫码支付</h2>
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-lg mb-6">
                    {/* 根据支付方式显示不同的二维码 */}
                    {paymentMethod === "alipay" ? (
                      <div className="relative w-64 h-64">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 100 100"
                            className="w-full h-full text-blue-500"
                          >
                            {/* 模拟支付宝二维码 */}
                            <rect
                              x="0"
                              y="0"
                              width="100"
                              height="100"
                              fill="white"
                            />
                            <path
                              d="M10,10 L90,10 L90,90 L10,90 Z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="5"
                            />
                            <path
                              d="M30,30 L70,30 L70,70 L30,70 Z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="5"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="10"
                              fill="currentColor"
                            />
                            <text
                              x="50"
                              y="95"
                              textAnchor="middle"
                              fill="currentColor"
                              fontSize="8"
                            >
                              支付宝
                            </text>
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-64 h-64">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 100 100"
                            className="w-full h-full text-green-500"
                          >
                            {/* 模拟微信支付二维码 */}
                            <rect
                              x="0"
                              y="0"
                              width="100"
                              height="100"
                              fill="white"
                            />
                            <path
                              d="M10,10 L90,10 L90,90 L10,90 Z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="5"
                            />
                            <path
                              d="M25,25 L75,25 L75,75 L25,75 Z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="5"
                            />
                            <path
                              d="M40,40 L60,40 L60,60 L40,60 Z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="5"
                            />
                            <text
                              x="50"
                              y="95"
                              textAnchor="middle"
                              fill="currentColor"
                              fontSize="8"
                            >
                              微信支付
                            </text>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-center mb-2">
                    请使用
                    <span className="font-semibold">
                      {paymentMethod === "alipay" ? "支付宝" : "微信"}
                    </span>
                    扫描二维码完成支付
                  </p>
                  <p className="text-[var(--foreground)]/70 text-sm mb-6">
                    订单号: {orderNumber}
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowQRCode(false)}
                      className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                    >
                      返回
                    </button>
                    <button
                      onClick={handlePaymentComplete}
                      className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
                    >
                      模拟支付完成
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md p-8">
                <h2 className="text-xl font-semibold mb-6">联系信息</h2>
                <form onSubmit={handleGenerateQRCode}>
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2"
                      >
                        姓名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={contactInfo.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:bg-[#2a2a2a]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium mb-2"
                      >
                        电话 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={contactInfo.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:bg-[#2a2a2a]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium mb-2"
                      >
                        地址（可选）
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={contactInfo.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] dark:bg-[#2a2a2a]"
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">支付方式</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div
                          className={`border rounded-md p-4 cursor-pointer transition-all duration-300 ${
                            paymentMethod === "alipay"
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-300 dark:border-gray-700"
                          }`}
                          onClick={() => handlePaymentMethodChange("alipay")}
                        >
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center mr-3">
                              {paymentMethod === "alipay" && (
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <span className="font-medium">支付宝</span>
                          </div>
                        </div>
                        <div
                          className={`border rounded-md p-4 cursor-pointer transition-all duration-300 ${
                            paymentMethod === "wechat"
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                              : "border-gray-300 dark:border-gray-700"
                          }`}
                          onClick={() => handlePaymentMethodChange("wechat")}
                        >
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center mr-3">
                              {paymentMethod === "wechat" && (
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              )}
                            </div>
                            <span className="font-medium">微信支付</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isGeneratingQR}
                      className={`w-full py-3 rounded-md font-medium transition-colors duration-300 ${
                        isGeneratingQR
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
                      }`}
                    >
                      {isGeneratingQR ? (
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
                          生成支付二维码...
                        </span>
                      ) : (
                        "生成支付二维码"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* 订单摘要 */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">订单摘要</h2>

              <div className="max-h-60 overflow-y-auto mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 mb-4">
                    <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-sm">{item.name}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[var(--foreground)]/70">
                          {item.quantity} x {item.price}
                        </span>
                        <span className="text-sm font-medium">
                          ¥
                          {(
                            parseFloat(item.price.replace(/[^\d.]/g, "")) *
                            item.quantity
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-[var(--foreground)]/70">商品总价</span>
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

              <div className="bg-[var(--secondary)]/10 p-4 rounded-md">
                <p className="text-sm">
                  <span className="font-medium">订单号：</span>
                  {orderNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
