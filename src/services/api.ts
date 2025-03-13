import axios from "axios";

// 创建axios实例
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器 - 添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // 未授权错误处理
    if (response && response.status === 401) {
      // 检查当前页面是否是登录页面
      const isLoginPage =
        typeof window !== "undefined" &&
        (window.location.pathname === "/login" ||
          window.location.pathname === "/register");

      // 如果不是登录页面，才清除token并重定向
      if (!isLoginPage) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // 如果在客户端，重定向到登录页
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

// 用户相关API
export const userAPI = {
  // 注册
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }) => {
    const response = await api.post("/users/signup", userData);
    return response.data;
  },

  // 登录
  login: async (email: string, password: string) => {
    const response = await api.post("/users/login", { email, password });
    console.log("登录响应:", response.data); // 添加日志
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      // 检查响应数据结构
      const userData = response.data.data?.user || response.data.user;
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
      }
    }
    return response.data;
  },

  // 登出
  logout: async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return await api.get("/users/logout");
  },

  // 获取当前用户信息
  getCurrentUser: async () => {
    try {
      const response = await api.get("/users/me");
      console.log("获取当前用户响应:", response.data);
      // 处理不同的响应结构
      return response.data?.data?.user
        ? { ...response.data, user: response.data.data.user }
        : response.data;
    } catch (error) {
      console.error("获取当前用户失败:", error);
      throw error;
    }
  },

  // 更新用户信息
  updateProfile: async (userData: {
    name?: string;
    phone?: string;
    address?: string;
  }) => {
    const response = await api.patch("/users/updateMe", userData);
    return response.data;
  },
};

// 产品相关API
export const productAPI = {
  // 获取所有产品
  getAllProducts: async (params?: {
    category?: string;
    search?: string;
    sort?: string;
    limit?: number;
    page?: number;
  }) => {
    const response = await api.get("/products", { params });
    return response.data;
  },

  // 获取单个产品
  getProduct: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // 按分类获取产品
  getProductsByCategory: async (category: string) => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },
};

// 订单相关API
export const orderAPI = {
  // 创建订单
  createOrder: async (orderData: {
    items: Array<{ productId: string; quantity: number }>;
    paymentMethod: string;
    contactInfo: { name: string; phone: string; address?: string };
    note?: string;
  }) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },

  // 获取当前用户的订单
  getMyOrders: async () => {
    const response = await api.get("/orders/my-orders");
    return response.data;
  },

  // 获取单个订单
  getOrder: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // 取消订单
  cancelOrder: async (id: string) => {
    const response = await api.patch(`/orders/${id}/cancel`);
    return response.data;
  },

  // 更新订单状态
  updateOrderStatus: async (id: string, data: { status: string }) => {
    const response = await api.patch(`/orders/${id}/status`, data);
    return response.data;
  },
};

// 支付相关API
export const paymentAPI = {
  // 创建支付
  createPayment: async (orderId: string, paymentMethod: string) => {
    const response = await api.post("/payments", { orderId, paymentMethod });
    return response.data;
  },

  // 验证支付状态
  verifyPayment: async (paymentId: string) => {
    const response = await api.get(`/payments/${paymentId}/verify`);
    return response.data;
  },
};

// 评价相关API
export const reviewAPI = {
  // 获取产品评价
  getProductReviews: async (productId: string) => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  },

  // 创建评价
  createReview: async (reviewData: {
    productId: string;
    rating: number;
    comment: string;
  }) => {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  },

  // 更新评价
  updateReview: async (
    reviewId: string,
    reviewData: { rating?: number; comment?: string }
  ) => {
    const response = await api.patch(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // 删除评价
  deleteReview: async (reviewId: string) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  // 获取我的评价
  getMyReviews: async () => {
    const response = await api.get("/reviews/my-reviews");
    return response.data;
  },
};

export default api;
