import { api, ApiResponse } from "./apiClient";

// 支付方式接口
export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
}

// 支付状态接口
export interface PaymentStatus {
  id: string;
  orderId: string;
  status: "pending" | "completed" | "failed" | "refunded";
  amount: number;
  currency: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

// 创建支付请求接口
export interface CreatePaymentRequest {
  orderId: string;
  paymentMethod: string;
  returnUrl?: string;
}

// 创建支付响应接口
export interface CreatePaymentResponse {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  paymentUrl?: string;
  paymentMethod: string;
  createdAt: string;
}

/**
 * 支付API服务
 */
export const paymentApi = {
  /**
   * 创建支付
   * @param paymentData 支付数据
   * @returns 创建的支付信息
   */
  createPayment: async (
    paymentData: CreatePaymentRequest
  ): Promise<CreatePaymentResponse> => {
    const response = await api.post<{ payment: CreatePaymentResponse }>(
      "/payments/create",
      paymentData
    );
    return response.data?.payment as CreatePaymentResponse;
  },

  /**
   * 验证支付状态
   * @param paymentId 支付ID
   * @returns 支付状态信息
   */
  verifyPayment: async (paymentId: string): Promise<PaymentStatus> => {
    const response = await api.get<{ payment: PaymentStatus }>(
      `/payments/verify/${paymentId}`
    );
    return response.data?.payment as PaymentStatus;
  },

  /**
   * 获取支付方式列表
   * @returns 支付方式列表
   */
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    const response = await api.get<{ methods: PaymentMethod[] }>(
      "/payments/methods"
    );
    return response.data?.methods || [];
  },

  /**
   * 处理支付回调（通常由支付网关调用，前端一般不直接使用）
   * @param paymentId 支付ID
   * @param data 回调数据
   * @returns 处理结果
   */
  handlePaymentCallback: async (
    paymentId: string,
    data: any
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(
      `/payments/webhook/${paymentId}`,
      data
    );
    return {
      success: response.data?.success || false,
      message: response.data?.message || "Unknown error",
    };
  },

  /**
   * 请求退款（仅管理员）
   * @param paymentId 支付ID
   * @param reason 退款原因
   * @returns 退款结果
   */
  requestRefund: async (
    paymentId: string,
    reason: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(
      `/payments/${paymentId}/refund`,
      { reason }
    );
    return {
      success: response.data?.success || false,
      message: response.data?.message || "Unknown error",
    };
  },
};
