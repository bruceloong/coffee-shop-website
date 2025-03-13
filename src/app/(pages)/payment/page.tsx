"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { orderAPI } from "@/services/api";
import { toast } from "react-hot-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// 订单接口
interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  items: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
      imageUrl: string;
    };
    quantity: number;
  }>;
  contactInfo: {
    name: string;
    phone: string;
    address?: string;
  };
  createdAt: string;
}

// 支付方式接口
interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "processing" | "success" | "failed"
  >("pending");

  // 选择的支付方式
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");

  // 支付倒计时
  const [countdown, setCountdown] = useState(900); // 15分钟

  // 可用的支付方式
  const paymentMethods: PaymentMethod[] = [
    {
      id: "alipay",
      name: "支付宝",
      icon: "/images/alipay.svg",
      color: "bg-blue-50 border-blue-200",
    },
    {
      id: "wechat",
      name: "微信支付",
      icon: "/images/wechat.svg",
      color: "bg-green-50 border-green-200",
    },
    {
      id: "unionpay",
      name: "银联支付",
      icon: "/images/unionpay.svg",
      color: "bg-red-50 border-red-200",
    },
    {
      id: "creditcard",
      name: "信用卡",
      icon: "/images/creditcard.svg",
      color: "bg-purple-50 border-purple-200",
    },
  ];

  // 获取订单信息
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("订单ID不存在");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await orderAPI.getOrder(orderId);
        setOrder(response.data.order);

        // 设置默认支付方式
        if (response.data.order.paymentMethod) {
          setSelectedPaymentMethod(response.data.order.paymentMethod);
        } else {
          setSelectedPaymentMethod("alipay");
        }

        setLoading(false);
      } catch (err: Error | any) {
        console.error("Failed to fetch order:", err);
        setError(err.response?.data?.message || "获取订单信息失败");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // 倒计时
  useEffect(() => {
    if (paymentStatus !== "pending" || !order) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setError("支付超时，请重新下单");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentStatus, order]);

  // 格式化倒计时
  const formatCountdown = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // 处理支付方式选择
  const handlePaymentMethodChange = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  // 模拟支付过程
  const simulatePayment = async () => {
    if (!order || !selectedPaymentMethod) {
      toast.error("请选择支付方式");
      return;
    }

    setProcessingPayment(true);
    setPaymentStatus("processing");

    try {
      // 模拟支付处理
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 随机模拟支付成功或失败 (90%成功率)
      const isSuccess = Math.random() < 0.9;

      if (isSuccess) {
        // 支付成功
        await orderAPI.updateOrderStatus(orderId!, { status: "paid" });
        setPaymentStatus("success");
        toast.success("支付成功！");
      } else {
        // 支付失败
        setPaymentStatus("failed");
        setError("支付失败，请重试");
        toast.error("支付失败，请重试");
      }
    } catch (err: Error | any) {
      console.error("Payment failed:", err);
      setPaymentStatus("failed");
      setError(err.response?.data?.message || "支付失败，请重试");
      toast.error("支付处理出错，请重试");
    } finally {
      setProcessingPayment(false);
    }
  };

  // 重新支付
  const retryPayment = () => {
    setPaymentStatus("pending");
    setError("");
  };

  // 渲染支付成功页面
  if (paymentStatus === "success") {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-500"
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
          <p className="text-gray-600 mb-2">
            您的订单 #{order?.orderNumber} 已支付成功
          </p>
          <p className="text-gray-600 mb-8">
            我们将尽快为您准备订单，感谢您的惠顾！
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              查看订单
            </Link>
            <Link
              href="/menu"
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              继续购物
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // 渲染支付失败页面
  if (paymentStatus === "failed") {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">支付失败</h1>
          <p className="text-gray-600 mb-6">
            {error || "支付过程中发生错误，请重试"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={retryPayment}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              重新支付
            </button>
            <Link
              href="/cart"
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              返回购物车
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // 加载中
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // 错误页面
  if (error && paymentStatus === "pending") {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">出错了</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            href="/cart"
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            返回购物车
          </Link>
        </div>
      </div>
    );
  }

  // 支付处理中
  if (paymentStatus === "processing") {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <LoadingSpinner size="large" />
          </div>
          <h1 className="text-2xl font-bold mb-4">正在处理支付...</h1>
          <p className="text-gray-600 mb-8">
            请不要关闭页面，我们正在处理您的支付请求
          </p>
        </div>
      </div>
    );
  }

  // 渲染支付页面
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6 text-center">请完成支付</h1>

          {order && (
            <>
              {/* 订单信息 */}
              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">订单号:</span>
                    <span className="font-medium">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">收货人:</span>
                    <span className="font-medium">
                      {order.contactInfo.name}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">联系电话:</span>
                    <span className="font-medium">
                      {order.contactInfo.phone}
                    </span>
                  </div>
                  {order.contactInfo.address && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">收货地址:</span>
                      <span className="font-medium">
                        {order.contactInfo.address}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">支付金额:</span>
                    <span className="font-bold text-lg text-primary">
                      ¥{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* 支付倒计时 */}
                <div className="text-center mb-6">
                  <p className="text-gray-600 mb-1">请在以下时间内完成支付</p>
                  <div className="font-mono text-xl font-bold">
                    {formatCountdown()}
                  </div>
                </div>

                {/* 支付方式选择 */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">选择支付方式</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => handlePaymentMethodChange(method.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedPaymentMethod === method.id
                            ? `${method.color} border-opacity-100`
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 mr-3 relative">
                            <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
                            {/* 这里应该放支付方式的图标 */}
                          </div>
                          <span className="font-medium">{method.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 支付二维码 */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedPaymentMethod}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-center mb-8"
                  >
                    {selectedPaymentMethod === "alipay" && (
                      <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-100">
                        <div className="w-48 h-48 bg-white p-2 mx-auto mb-2">
                          {/* 模拟支付宝二维码 */}
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <rect
                              x="0"
                              y="0"
                              width="100"
                              height="100"
                              fill="#FFFFFF"
                            />
                            <path
                              d="M10,10 L90,10 L90,90 L10,90 Z"
                              fill="none"
                              stroke="#1677FF"
                              strokeWidth="5"
                            />
                            <path
                              d="M30,30 L70,30 L70,70 L30,70 Z"
                              fill="none"
                              stroke="#1677FF"
                              strokeWidth="5"
                            />
                            <circle cx="50" cy="50" r="10" fill="#1677FF" />
                          </svg>
                        </div>
                        <p className="text-center text-sm text-gray-600">
                          请使用支付宝扫码支付
                        </p>
                      </div>
                    )}

                    {selectedPaymentMethod === "wechat" && (
                      <div className="bg-green-50 p-4 rounded-lg border-2 border-green-100">
                        <div className="w-48 h-48 bg-white p-2 mx-auto mb-2">
                          {/* 模拟微信支付二维码 */}
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <rect
                              x="0"
                              y="0"
                              width="100"
                              height="100"
                              fill="#FFFFFF"
                            />
                            <path
                              d="M10,10 L90,10 L90,90 L10,90 Z"
                              fill="none"
                              stroke="#07C160"
                              strokeWidth="5"
                            />
                            <path
                              d="M25,25 L75,25 L75,75 L25,75 Z"
                              fill="none"
                              stroke="#07C160"
                              strokeWidth="5"
                            />
                            <path
                              d="M40,40 L60,40 L60,60 L40,60 Z"
                              fill="none"
                              stroke="#07C160"
                              strokeWidth="5"
                            />
                          </svg>
                        </div>
                        <p className="text-center text-sm text-gray-600">
                          请使用微信扫码支付
                        </p>
                      </div>
                    )}

                    {selectedPaymentMethod === "unionpay" && (
                      <div className="bg-red-50 p-4 rounded-lg border-2 border-red-100">
                        <div className="w-48 h-48 bg-white p-2 mx-auto mb-2">
                          {/* 模拟银联支付二维码 */}
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <rect
                              x="0"
                              y="0"
                              width="100"
                              height="100"
                              fill="#FFFFFF"
                            />
                            <path
                              d="M10,10 L90,10 L90,90 L10,90 Z"
                              fill="none"
                              stroke="#E60012"
                              strokeWidth="5"
                            />
                            <path
                              d="M25,40 L75,40 L75,60 L25,60 Z"
                              fill="#E60012"
                            />
                          </svg>
                        </div>
                        <p className="text-center text-sm text-gray-600">
                          请使用银联扫码支付
                        </p>
                      </div>
                    )}

                    {selectedPaymentMethod === "creditcard" && (
                      <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-100 w-full max-w-sm">
                        <h3 className="text-center font-medium mb-4">
                          信用卡支付
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              卡号
                            </label>
                            <input
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <label className="block text-sm text-gray-600 mb-1">
                                有效期
                              </label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-sm text-gray-600 mb-1">
                                CVV
                              </label>
                              <input
                                type="text"
                                placeholder="123"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              持卡人姓名
                            </label>
                            <input
                              type="text"
                              placeholder="张三"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* 操作按钮 */}
                <div className="flex flex-col gap-4">
                  <button
                    onClick={simulatePayment}
                    disabled={processingPayment}
                    className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {processingPayment ? (
                      <div className="flex items-center justify-center">
                        <LoadingSpinner size="small" color="#ffffff" />
                        <span className="ml-2">处理中...</span>
                      </div>
                    ) : (
                      "确认支付"
                    )}
                  </button>
                  <Link
                    href="/cart"
                    className="w-full py-3 text-center bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    取消并返回
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 支付说明 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">支付说明</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>请在15分钟内完成支付，超时订单将自动取消</span>
            </li>
            <li className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>支付成功后，请勿关闭页面，系统会自动跳转</span>
            </li>
            <li className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>如有问题，请联系客服：400-123-4567</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
