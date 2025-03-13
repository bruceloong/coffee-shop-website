"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { orderAPI, productAPI, userAPI } from "@/services/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// 统计卡片组件
const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white rounded-lg shadow-md p-6 ${color}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div
        className={`p-3 rounded-full ${color.replace(
          "border-l-4",
          "bg-opacity-20 bg"
        )}`}
      >
        {icon}
      </div>
    </div>
  </motion.div>
);

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalUsers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
    recentOrders: [],
    topSellingProducts: [],
  });

  // 获取统计数据
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // 获取订单数据
        const ordersResponse = await orderAPI.getAllOrders();
        const orders = ordersResponse.data.orders;

        // 获取产品数据
        const productsResponse = await productAPI.getAllProducts();
        const products = productsResponse.data.products;

        // 获取用户数据
        const usersResponse = await userAPI.getAllUsers();
        const users = usersResponse.data.users;

        // 计算统计数据
        const totalOrders = orders.length;
        const totalSales = orders
          .filter(
            (order: any) =>
              order.status === "paid" || order.status === "completed"
          )
          .reduce((sum: number, order: any) => sum + order.totalAmount, 0);
        const totalUsers = users.length;
        const totalProducts = products.length;
        const lowStockProducts = products.filter(
          (product: any) => product.stock <= 5
        ).length;
        const pendingOrders = orders.filter(
          (order: any) => order.status === "pending"
        ).length;

        // 最近订单
        const recentOrders = orders
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5);

        // 计算畅销产品
        const productSales: Record<string, { count: number; product: any }> =
          {};
        orders.forEach((order: any) => {
          order.items.forEach((item: any) => {
            const productId = item.product._id || item.product;
            if (!productSales[productId]) {
              const product = products.find((p: any) => p._id === productId);
              productSales[productId] = { count: 0, product };
            }
            productSales[productId].count += item.quantity;
          });
        });

        const topSellingProducts = Object.values(productSales)
          .filter((item: any) => item.product) // 确保产品存在
          .sort((a: any, b: any) => b.count - a.count)
          .slice(0, 5);

        setStats({
          totalOrders,
          totalSales,
          totalUsers,
          totalProducts,
          lowStockProducts,
          pendingOrders,
          recentOrders,
          topSellingProducts,
        });

        setError("");
      } catch (err: any) {
        console.error("Failed to fetch stats:", err);
        setError(err.response?.data?.message || "获取统计数据失败");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // 格式化金额
  const formatCurrency = (amount: number) => {
    return `¥${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
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
        <h1 className="text-2xl font-bold mb-4">获取数据失败</h1>
        <p className="text-gray-600 mb-8">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          重新加载
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">仪表盘</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="总订单数"
          value={stats.totalOrders}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
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
          }
          color="border-l-4 border-blue-500"
        />
        <StatCard
          title="总销售额"
          value={formatCurrency(stats.totalSales)}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          color="border-l-4 border-green-500"
        />
        <StatCard
          title="用户数量"
          value={stats.totalUsers}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
          color="border-l-4 border-purple-500"
        />
        <StatCard
          title="待处理订单"
          value={stats.pendingOrders}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          color="border-l-4 border-yellow-500"
        />
      </div>

      {/* 库存警告 */}
      {stats.lowStockProducts > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                有 {stats.lowStockProducts} 个产品库存不足（少于5件）
                <a
                  href="/admin/products"
                  className="font-medium underline text-yellow-700 hover:text-yellow-600 ml-2"
                >
                  查看详情
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近订单 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">最近订单</h2>
          </div>
          <div className="p-6">
            {stats.recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">暂无订单数据</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        订单号
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        日期
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        金额
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recentOrders.map((order: any) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "paid"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status === "completed"
                              ? "已完成"
                              : order.status === "paid"
                              ? "已支付"
                              : order.status === "pending"
                              ? "待支付"
                              : order.status === "cancelled"
                              ? "已取消"
                              : order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4 text-right">
              <a
                href="/admin/orders"
                className="text-sm font-medium text-primary hover:text-primary-dark"
              >
                查看所有订单 →
              </a>
            </div>
          </div>
        </motion.div>

        {/* 畅销产品 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">畅销产品</h2>
          </div>
          <div className="p-6">
            {stats.topSellingProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">暂无销售数据</p>
            ) : (
              <div className="space-y-4">
                {stats.topSellingProducts.map((item: any) => (
                  <div
                    key={item.product._id}
                    className="flex items-center p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden relative">
                      {item.product.imageUrl && (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        售价: {formatCurrency(item.product.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold">
                        已售 {item.count} 件
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 text-right">
              <a
                href="/admin/products"
                className="text-sm font-medium text-primary hover:text-primary-dark"
              >
                查看所有产品 →
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
