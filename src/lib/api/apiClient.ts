import { getCookie } from "../utils/cookies";

// API基础URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// 请求选项接口
interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  includeCredentials?: boolean;
}

// 错误响应接口
interface ErrorResponse {
  status: string;
  message: string;
}

// API响应接口
export interface ApiResponse<T = any> {
  status: string;
  data?: T;
  message?: string;
  results?: number;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

/**
 * 发送API请求
 * @param endpoint API端点
 * @param options 请求选项
 * @returns 响应数据
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    headers = {},
    body,
    includeCredentials = true,
  } = options;

  // 构建请求URL
  const url = `${API_BASE_URL}${endpoint}`;

  // 构建请求头
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  // 如果需要，添加认证令牌
  if (includeCredentials) {
    const token = getCookie("jwt");
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  // 构建请求选项
  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: includeCredentials ? "include" : "omit",
  };

  // 如果有请求体，添加到请求选项中
  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    // 发送请求
    const response = await fetch(url, requestOptions);
    const data = await response.json();

    // 检查响应状态
    if (!response.ok) {
      const error: ErrorResponse = data;
      throw new Error(error.message || "请求失败");
    }

    return data as ApiResponse<T>;
  } catch (error: any) {
    console.error("API请求错误:", error);
    throw error;
  }
}

// 导出便捷的HTTP方法
export const api = {
  get: <T = any>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">
  ) => apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(
    endpoint: string,
    body: any,
    options?: Omit<RequestOptions, "method">
  ) => apiRequest<T>(endpoint, { ...options, method: "POST", body }),

  put: <T = any>(
    endpoint: string,
    body: any,
    options?: Omit<RequestOptions, "method">
  ) => apiRequest<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T = any>(
    endpoint: string,
    body: any,
    options?: Omit<RequestOptions, "method">
  ) => apiRequest<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T = any>(
    endpoint: string,
    options?: Omit<RequestOptions, "method">
  ) => apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};
