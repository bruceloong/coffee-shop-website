"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, totalPrice, checkout, clearCart, isLoading } = useCart();

  const [contactInfo, setContactInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("alipay");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 如果购物车为空，重定向到购物车页面
  if (cartItems.length === 0 && typeof window !== "undefined") {
    router.push("/cart");
    return null;
  }

  // 处理输入变化
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));

    // 清除错误
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 表单验证
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!contactInfo.name.trim()) {
      newErrors.name = "请输入您的姓名";
    }

    if (!contactInfo.phone.trim()) {
      newErrors.phone = "请输入您的电话号码";
    } else if (!/^1[3-9]\d{9}$/.test(contactInfo.phone)) {
      newErrors.phone = "请输入有效的手机号码";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交订单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await checkout(contactInfo);

      // 跳转到支付页面
      router.push(
        `/payment?orderId=${result.data.order._id}&method=${paymentMethod}`
      );
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">结账</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 订单摘要 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">订单摘要</h2>

            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center py-4 border-b"
              >
                <div className="relative h-16 w-16 rounded-md overflow-hidden">
                  <Image
                    src={
                      typeof item.image === "string"
                        ? item.image
                        : item.image.src
                    }
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-500 text-sm">数量: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ¥{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between mb-2">
                <span>小计</span>
                <span>¥{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>配送费</span>
                <span>¥0.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>总计</span>
                <span>¥{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 联系信息和支付方式 */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-4">联系信息</h2>

            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-2">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={contactInfo.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="请输入您的姓名"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-700 mb-2">
                电话 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={contactInfo.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="请输入您的电话号码"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="address" className="block text-gray-700 mb-2">
                地址
              </label>
              <textarea
                id="address"
                name="address"
                value={contactInfo.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="请输入您的地址（可选）"
              />
            </div>

            <h2 className="text-xl font-semibold mb-4">支付方式</h2>

            <div className="mb-6">
              <div className="flex items-center mb-3">
                <input
                  type="radio"
                  id="alipay"
                  name="paymentMethod"
                  value="alipay"
                  checked={paymentMethod === "alipay"}
                  onChange={() => setPaymentMethod("alipay")}
                  className="mr-2"
                />
                <label htmlFor="alipay" className="flex items-center">
                  <span className="mr-2">支付宝</span>
                  <svg
                    className="w-6 h-6 text-blue-500"
                    viewBox="0 0 1024 1024"
                    fill="currentColor"
                  >
                    <path d="M230.4 576.512c-12.288 9.728-25.088 24.064-28.672 41.984-5.12 24.576-1.024 55.296 22.528 79.872 28.672 29.184 72.704 37.376 96.768 38.4 60.416 2.56 113.664-30.72 149.504-65.536 19.456-18.944 35.328-40.96 49.152-64.512-113.664-58.88-195.072-91.648-239.104-91.648-20.48-0.512-36.864 6.144-50.176 11.264v0.512z" />
                    <path
                      d="M957.44 264.192c0-8.192-1.024-15.872-2.56-23.552 0-1.024 0-2.56-0.512-3.584 0-0.512 0-1.536-0.512-2.048-1.536-7.68-4.096-15.36-6.656-22.528-0.512-1.024-0.512-2.56-1.024-3.584-3.072-7.168-6.656-14.336-10.752-21.504-0.512-0.512-1.024-1.536-1.536-2.048-4.096-6.656-8.704-13.312-13.824-19.456-0.512-0.512-1.024-1.536-2.048-2.048-5.12-6.144-10.752-12.288-16.896-17.92-0.512-0.512-1.536-1.536-2.048-2.048-6.144-5.632-12.8-10.752-19.968-15.872-0.512-0.512-1.536-1.024-2.048-1.536-7.168-4.608-14.336-9.216-22.016-13.312-1.024-0.512-2.048-1.024-3.072-1.536-7.68-3.584-15.36-7.168-23.552-9.728-1.024-0.512-2.56-0.512-3.584-1.024-8.192-2.56-16.384-4.608-24.576-6.144-1.024 0-2.56-0.512-3.584-0.512-8.704-1.536-17.92-2.048-26.624-2.048H189.44c-8.704 0-17.408 0.512-26.112 2.048-1.024 0-2.56 0.512-3.584 0.512-8.192 1.536-16.384 3.584-24.576 6.144-1.024 0.512-2.56 0.512-3.584 1.024-8.192 2.56-15.872 6.144-23.552 9.728-1.024 0.512-2.048 1.024-3.072 1.536-7.68 4.096-14.848 8.704-22.016 13.312-0.512 0.512-1.536 1.024-2.048 1.536-7.168 5.12-13.824 10.24-19.968 15.872-0.512 0.512-1.536 1.536-2.048 2.048-6.144 5.632-11.776 11.776-16.896 17.92-0.512 0.512-1.024 1.536-2.048 2.048-5.12 6.144-9.728 12.8-13.824 19.456-0.512 0.512-1.024 1.536-1.536 2.048-4.096 7.168-7.68 14.336-10.752 21.504-0.512 1.024-0.512 2.56-1.024 3.584-2.56 7.168-5.12 14.848-6.656 22.528 0 0.512 0 1.536-0.512 2.048 0 1.024 0 2.56-0.512 3.584-1.536 7.68-2.56 15.36-2.56 23.552v495.616c0 8.192 1.024 15.872 2.56 23.552 0 1.024 0 2.56 0.512 3.584 0 0.512 0 1.536 0.512 2.048 1.536 7.68 4.096 15.36 6.656 22.528 0.512 1.024 0.512 2.56 1.024 3.584 3.072 7.168 6.656 14.336 10.752 21.504 0.512 0.512 1.024 1.536 1.536 2.048 4.096 6.656 8.704 13.312 13.824 19.456 0.512 0.512 1.024 1.536 2.048 2.048 5.12 6.144 10.752 12.288 16.896 17.92 0.512 0.512 1.536 1.536 2.048 2.048 6.144 5.632 12.8 10.752 19.968 15.872 0.512 0.512 1.536 1.536 2.048 2.048 6.144 5.632 12.8 10.752 19.968 15.872 0.512 0.512 1.536 1.536 2.048 2.048 6.144 5.632 12.8 10.752 19.968 15.872 0.512 0.512 1.536 1.024 2.048 1.536 7.168 4.608 14.336 9.216 22.016 13.312 1.024 0.512 2.048 1.024 3.072 1.536 7.68 3.584 15.36 7.168 23.552 9.728 1.024 0.512 2.56 0.512 3.584 1.024 8.192 2.56 16.384 4.608 24.576 6.144 1.024 0 2.56 0.512 3.584 0.512 8.704 1.536 17.408 2.048 26.112 2.048h645.12c8.704 0 17.92-0.512 26.624-2.048 1.024 0 2.56-0.512 3.584-0.512 8.192-1.536 16.384-3.584 24.576-6.144 1.024-0.512 2.56-0.512 3.584-1.024 8.192-2.56 15.872-6.144 23.552-9.728 1.024-0.512 2.048-1.024 3.072-1.536 7.68-4.096 14.848-8.704 22.016-13.312 0.512-0.512 1.536-1.024 2.048-1.536 7.168-5.12 13.824-10.24 19.968-15.872 0.512-0.512 1.536-1.536 2.048-2.048 6.144-5.632 11.776-11.776 16.896-17.92 0.512-0.512 1.024-1.536 2.048-2.048 5.12-6.144 9.728-12.8 13.824-19.456 0.512-0.512 1.024-1.536 1.536-2.048 4.096-7.168 7.68-14.336 10.752-21.504 0.512-1.024 0.512-2.56 1.024-3.584 2.56-7.168 5.12-14.848 6.656-22.528 0-0.512 0-1.536 0.512-2.048 0-1.024 0 -2.56 0.512-3.584 1.536-7.68 2.56-15.36 2.56-23.552V264.192z"
                      fill="#06B4FD"
                    />
                    <path
                      d="M683.008 576c-76.8-25.088-174.08-60.416-174.08-60.416v-99.328h-187.904v109.568c-38.4 29.696-62.976 74.752-62.976 125.44 0 88.576 71.68 160.256 160.256 160.256 65.024 0 120.832-38.912 146.432-94.72 88.576 44.544 152.576 74.24 152.576 74.24-28.16 130.56-144.384 228.864-285.696 228.864-160.256 0-290.304-129.536-290.304-290.304 0-129.024 84.48-238.08 200.704-276.48V335.872h187.904v-45.568h-187.904v-79.872h187.904v-58.88h99.328v58.88h187.904v79.872h-187.904v45.568h187.904v117.76c-33.28-1.024-67.072 10.752-95.232 33.792-29.696 24.064-50.688 58.368-58.88 97.28 0.512 0 7.168 1.536 7.168 1.536z"
                      fill="#FFFFFF"
                    />
                  </svg>
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="wechat"
                  name="paymentMethod"
                  value="wechat"
                  checked={paymentMethod === "wechat"}
                  onChange={() => setPaymentMethod("wechat")}
                  className="mr-2"
                />
                <label htmlFor="wechat" className="flex items-center">
                  <span className="mr-2">微信支付</span>
                  <svg
                    className="w-6 h-6 text-green-500"
                    viewBox="0 0 1024 1024"
                    fill="currentColor"
                  >
                    <path
                      d="M692.992 347.968c4.48 0 8.96 0.128 13.376 0.32-26.816-125.44-161.024-218.688-218.688-171.136 0-312.32 116.48-312.32 265.344 0 85.312 46.784 155.648 124.672 210.112l-31.168 93.504 108.992-54.592c39.04 7.68 70.4 15.744 108.8 15.744 9.728 0 19.392-0.448 28.992-1.216-6.08-20.736-9.536-42.56-9.536-65.152 0-135.584 116.48-245.376 282.176-245.376z m-178.304-90.112c23.488 0 39.04 15.488 39.04 39.04 0 23.488-15.552 39.04-39.04 39.04-23.488 0-46.976-15.552-46.976-39.04 0-23.552 23.488-39.04 46.976-39.04z m-233.024 78.08c-23.488 0-47.04-15.552-47.04-39.04 0-23.488 23.552-39.04 47.04-39.04 23.488 0 39.04 15.552 39.04 39.04 0 23.488-15.552 39.04-39.04 39.04z"
                      fill="#3CAF34"
                    />
                    <path
                      d="M957.056 618.112c0-124.8-124.672-226.56-265.344-226.56-148.672 0-265.344 101.76-265.344 226.56 0 124.928 116.672 226.56 265.344 226.56 31.104 0 62.336-7.808 93.44-15.552l85.44 46.912-23.488-77.952c62.4-46.912 109.952-108.864 109.952-179.968z m-350.784-39.04c-15.552 0-31.168-15.552-31.168-31.168 0-15.552 15.616-31.168 31.168-31.168 23.552 0 39.04 15.616 39.04 31.168 0 15.616-15.488 31.168-39.04 31.168z m171.136 0c-15.488 0-31.104-15.552-31.104-31.168 0-15.552 15.616-31.168 31.104-31.168 23.488 0 39.04 15.616 39.04 31.168 0 15.616-15.552 31.168-39.04 31.168z"
                      fill="#3CAF34"
                    />
                  </svg>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <LoadingSpinner size="small" color="#ffffff" />
                  <span className="ml-2">处理中...</span>
                </div>
              ) : (
                "提交订单"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
