import { api, ApiResponse } from "./apiClient";
import { Product } from "./productApi";
import { User } from "./userApi";

// 订单状态枚举
export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

// 支付状态枚举
export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

// 订单项接口
export interface OrderItem {
  _id?: string;
  product: Product | string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

// 订单接口
export interface Order {
  _id: string;
  orderNumber: string;
  user: User | string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentId?: string;
  shippingAddress?: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 创建订单请求接口
export interface CreateOrderRequest {
  items: {
    product: string;
    quantity: number;
  }[];
  shippingAddress?: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentMethod?: string;
  notes?: string;
}

// 更新订单请求接口
export interface UpdateOrderRequest {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: string;
  paymentId?: string;
  shippingAddress?: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  notes?: string;
}

// 订单查询参数接口
export interface OrderQueryParams {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

// 订单分页响应接口
export interface OrderPaginatedResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 订单API服务
 */
export const orderApi = {
  /**
   * 获取所有订单（管理员可查看所有订单，普通用户只能查看自己的订单）
   * @param params 查询参数
   * @returns 订单分页响应
   */
  getAllOrders: async (
    params: OrderQueryParams = {}
  ): Promise<OrderPaginatedResponse> => {
    // 构建查询字符串
    const queryParams = new URLSearchParams();

    if (params.status) queryParams.append("status", params.status);
    if (params.paymentStatus)
      queryParams.append("paymentStatus", params.paymentStatus);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.search) queryParams.append("search", params.search);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/orders?${queryString}` : "/orders";

    const response = await api.get<OrderPaginatedResponse>(endpoint);

    return {
      orders: response.data?.orders || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1,
    };
  },

  /**
   * 获取当前用户的订单
   * @param params 查询参数
   * @returns 订单分页响应
   */
  getMyOrders: async (
    params: OrderQueryParams = {}
  ): Promise<OrderPaginatedResponse> => {
    // 构建查询字符串
    const queryParams = new URLSearchParams();

    if (params.status) queryParams.append("status", params.status);
    if (params.paymentStatus)
      queryParams.append("paymentStatus", params.paymentStatus);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    if (params.search) queryParams.append("search", params.search);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/orders/my-orders?${queryString}`
      : "/orders/my-orders";

    const response = await api.get<OrderPaginatedResponse>(endpoint);

    return {
      orders: response.data?.orders || [],
      total: response.total || 0,
      page: response.page || 1,
      limit: response.limit || 10,
      totalPages: response.totalPages || 1,
    };
  },

  /**
   * 获取单个订单
   * @param orderId 订单ID
   * @returns 订单信息
   */
  getOrder: async (orderId: string): Promise<Order> => {
    const response = await api.get<{ order: Order }>(`/orders/${orderId}`);
    return response.data?.order as Order;
  },

  /**
   * 创建订单
   * @param orderData 订单数据
   * @returns 创建的订单
   */
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await api.post<{ order: Order }>("/orders", orderData);
    return response.data?.order as Order;
  },

  /**
   * 更新订单（仅管理员）
   * @param orderId 订单ID
   * @param orderData 订单数据
   * @returns 更新后的订单
   */
  updateOrder: async (
    orderId: string,
    orderData: UpdateOrderRequest
  ): Promise<Order> => {
    const response = await api.patch<{ order: Order }>(
      `/orders/${orderId}`,
      orderData
    );
    return response.data?.order as Order;
  },

  /**
   * 取消订单
   * @param orderId 订单ID
   * @returns 更新后的订单
   */
  cancelOrder: async (orderId: string): Promise<Order> => {
    const response = await api.post<{ order: Order }>(
      `/orders/${orderId}/cancel`
    );
    return response.data?.order as Order;
  },

  /**
   * 获取订单统计信息（仅管理员）
   * @returns 订单统计信息
   */
  getOrderStats: async (): Promise<{
    totalOrders: number;
    totalSales: number;
    pendingOrders: number;
    processingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    refundedOrders: number;
  }> => {
    const response = await api.get<{
      stats: {
        totalOrders: number;
        totalSales: number;
        pendingOrders: number;
        processingOrders: number;
        completedOrders: number;
        cancelledOrders: number;
        refundedOrders: number;
      };
    }>("/orders/stats");
    return (
      response.data?.stats || {
        totalOrders: 0,
        totalSales: 0,
        pendingOrders: 0,
        processingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        refundedOrders: 0,
      }
    );
  },
};
