"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { orderAPI } from "@/services/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// 订单状态映射
const orderStatusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "待支付", color: "bg-yellow-100 text-yellow-800" },
  paid: { label: "已支付", color: "bg-blue-100 text-blue-800" },
  processing: { label: "处理中", color: "bg-purple-100 text-purple-800" },
  completed: { label: "已完成", color: "bg-green-100 text-green-800" },
  cancelled: { label: "已取消", color: "bg-gray-100 text-gray-800" },
  refunded: { label: "已退款", color: "bg-red-100 text-red-800" },
};

// 支付方式映射
const paymentMethodMap: Record<string, string> = {
  alipay: "支付宝",
  wechat: "微信支付",
  cash: "现金",
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // 获取用户订单
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderAPI.getMyOrders();
        setOrders(response.data.orders);
        setError("");
      } catch (err: any) {
        console.error("Failed to fetch orders:", err);
        setError(err.response?.data?.message || "获取订单失败");

        // 如果是未授权错误，重定向到登录页
        if (err.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  // 取消订单
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("确定要取消此订单吗？")) {
      return;
    }

    try {
      setLoading(true);
      await orderAPI.cancelOrder(orderId);

      // 刷新订单列表
      const response = await orderAPI.getMyOrders();
      setOrders(response.data.orders);

      // 如果当前选中的订单被取消，更新它
      if (selectedOrder && selectedOrder._id === orderId) {
        const updatedOrder = response.data.orders.find(
          (o: any) => o._id === orderId
        );
        setSelectedOrder(updatedOrder);
      }

      alert("订单已成功取消");
    } catch (err: any) {
      console.error("Failed to cancel order:", err);
      alert(err.response?.data?.message || "取消订单失败");
    } finally {
      setLoading(false);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 加载中
  if (loading && !orders.length) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // 错误页面
  if (error && !orders.length) {
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
          <h1 className="text-2xl font-bold mb-4">获取订单失败</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              重试
            </button>
            <Link
              href="/"
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 没有订单
  if (!loading && orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">暂无订单</h1>
          <p className="text-gray-600 mb-8">您还没有任何订单记录</p>
          <Link
            href="/menu"
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            去购物
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">我的订单</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 订单列表 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="font-semibold">订单列表</h2>
            </div>
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {orders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedOrder?._id === order._id ? "bg-gray-50" : ""
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">订单 #{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        orderStatusMap[order.status]?.color || "bg-gray-100"
                      }`}
                    >
                      {orderStatusMap[order.status]?.label || order.status}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <span className="text-sm text-gray-600">
                      {order.items.length} 件商品
                    </span>
                    <span className="font-medium">
                      ¥{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* 订单详情 */}
        <div className="lg:col-span-2">
          {selectedOrder ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold">订单详情</h2>
                  <p className="text-gray-600">#{selectedOrder.orderNumber}</p>
                </div>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    orderStatusMap[selectedOrder.status]?.color || "bg-gray-100"
                  }`}
                >
                  {orderStatusMap[selectedOrder.status]?.label ||
                    selectedOrder.status}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">订单信息</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">创建时间</p>
                      <p>{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">支付方式</p>
                      <p>
                        {paymentMethodMap[selectedOrder.paymentMethod] ||
                          selectedOrder.paymentMethod}
                      </p>
                    </div>
                    {selectedOrder.paidAt && (
                      <div>
                        <p className="text-sm text-gray-600">支付时间</p>
                        <p>{formatDate(selectedOrder.paidAt)}</p>
                      </div>
                    )}
                    {selectedOrder.completedAt && (
                      <div>
                        <p className="text-sm text-gray-600">完成时间</p>
                        <p>{formatDate(selectedOrder.completedAt)}</p>
                      </div>
                    )}
                    {selectedOrder.cancelledAt && (
                      <div>
                        <p className="text-sm text-gray-600">取消时间</p>
                        <p>{formatDate(selectedOrder.cancelledAt)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">联系信息</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p>
                    <span className="text-gray-600">姓名：</span>
                    {selectedOrder.contactInfo.name}
                  </p>
                  <p>
                    <span className="text-gray-600">电话：</span>
                    {selectedOrder.contactInfo.phone}
                  </p>
                  {selectedOrder.contactInfo.address && (
                    <p>
                      <span className="text-gray-600">地址：</span>
                      {selectedOrder.contactInfo.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">商品列表</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className={`flex items-center py-3 ${
                        index !== selectedOrder.items.length - 1
                          ? "border-b"
                          : ""
                      }`}
                    >
                      <div className="flex-grow">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          ¥{item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ¥{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between font-bold">
                      <span>总计</span>
                      <span>¥{selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 订单操作 */}
              <div className="flex justify-end gap-4">
                {selectedOrder.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleCancelOrder(selectedOrder._id)}
                      disabled={loading}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      取消订单
                    </button>
                    <Link
                      href={`/payment?orderId=${selectedOrder._id}&method=${selectedOrder.paymentMethod}`}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                    >
                      去支付
                    </Link>
                  </>
                )}

                {selectedOrder.status === "paid" && (
                  <button
                    onClick={() => handleCancelOrder(selectedOrder._id)}
                    disabled={loading}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    申请取消
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="text-xl font-semibold mb-2">选择一个订单</h3>
              <p className="text-gray-500">从左侧列表选择一个订单查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
