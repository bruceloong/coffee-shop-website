"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { userAPI } from "@/services/api";
import { toast } from "react-hot-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // 获取用户信息
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getCurrentUser();
        setUser(response.data.user);
        setFormData({
          name: response.data.user.name || "",
          phone: response.data.user.phone || "",
          address: response.data.user.address || "",
        });
      } catch (err: any) {
        console.error("Failed to fetch user profile:", err);
        setError(err.response?.data?.message || "获取用户信息失败");

        // 如果是未授权错误，重定向到登录页
        if (err.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  // 处理输入变化
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setUpdating(true);
      await userAPI.updateProfile(formData);

      // 更新用户信息
      const response = await userAPI.getCurrentUser();
      setUser(response.data.user);

      toast.success("个人资料更新成功");
      setIsEditing(false);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      toast.error(err.response?.data?.message || "更新个人资料失败");
    } finally {
      setUpdating(false);
    }
  };

  // 处理登出
  const handleLogout = async () => {
    try {
      await userAPI.logout();
      toast.success("已成功登出");
      router.push("/");
    } catch (err: any) {
      console.error("Logout error:", err);
      toast.error("登出失败，请重试");
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error && !user) {
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
          <h1 className="text-2xl font-bold mb-4">获取用户信息失败</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            返回登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">个人资料</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* 个人资料头部 */}
          <div className="bg-primary p-6 text-white">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full bg-white text-primary flex items-center justify-center text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-primary-100">{user?.email}</p>
                <p className="text-sm mt-1">
                  加入时间: {user?.createdAt ? formatDate(user.createdAt) : ""}
                </p>
              </div>
            </div>
          </div>

          {/* 个人资料内容 */}
          <div className="p-6">
            {isEditing ? (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
              >
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 mb-2">
                    姓名
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="请输入姓名"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700 mb-2">
                    电话
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="请输入电话号码"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="address" className="block text-gray-700 mb-2">
                    地址
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="请输入地址"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {updating ? (
                      <div className="flex items-center">
                        <LoadingSpinner size="small" color="#ffffff" />
                        <span className="ml-2">保存中...</span>
                      </div>
                    ) : (
                      "保存"
                    )}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-gray-500 text-sm">姓名</h3>
                  <p className="font-medium">{user?.name}</p>
                </div>

                <div>
                  <h3 className="text-gray-500 text-sm">邮箱</h3>
                  <p className="font-medium">{user?.email}</p>
                </div>

                <div>
                  <h3 className="text-gray-500 text-sm">电话</h3>
                  <p className="font-medium">{user?.phone || "未设置"}</p>
                </div>

                <div>
                  <h3 className="text-gray-500 text-sm">地址</h3>
                  <p className="font-medium">{user?.address || "未设置"}</p>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                  >
                    退出登录
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                  >
                    编辑资料
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* 订单历史链接 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">快速链接</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push("/orders")}
              className="flex items-center p-4 border rounded-md hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary mr-3"
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
              <span>我的订单</span>
            </button>
            <button
              onClick={() => router.push("/menu")}
              className="flex items-center p-4 border rounded-md hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>继续购物</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
