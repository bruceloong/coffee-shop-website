import { api, ApiResponse } from "./apiClient";
import { setAuthToken, clearAuthToken } from "../utils/cookies";

// 用户接口
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

// 注册请求接口
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

// 登录请求接口
export interface LoginRequest {
  email: string;
  password: string;
}

// 更新用户信息请求接口
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

// 更新密码请求接口
export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

// 认证响应接口
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * 用户API服务
 */
export const userApi = {
  /**
   * 用户注册
   * @param userData 用户注册数据
   * @returns 注册响应
   */
  signup: async (userData: SignupRequest): Promise<User> => {
    const response = await api.post<AuthResponse>("/users/signup", userData);

    if (response.data && response.data.token) {
      setAuthToken(response.data.token);
    }

    return response.data?.user as User;
  },

  /**
   * 用户登录
   * @param credentials 登录凭证
   * @returns 登录响应
   */
  login: async (credentials: LoginRequest): Promise<User> => {
    const response = await api.post<AuthResponse>("/users/login", credentials);

    if (response.data && response.data.token) {
      setAuthToken(response.data.token);
    }

    return response.data?.user as User;
  },

  /**
   * 用户登出
   */
  logout: async (): Promise<void> => {
    await api.get("/users/logout");
    clearAuthToken();
  },

  /**
   * 获取当前用户信息
   * @returns 用户信息
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await api.get<{ data?: { user: User }; user?: User }>(
        "/users/me"
      );
      // 处理不同的响应结构
      return response.data?.data?.user || response.data?.user || null;
    } catch (error) {
      return null;
    }
  },

  /**
   * 更新用户信息
   * @param userData 用户信息
   * @returns 更新后的用户信息
   */
  updateProfile: async (userData: UpdateUserRequest): Promise<User> => {
    const response = await api.patch<{ user: User }>(
      "/users/updateMe",
      userData
    );
    return response.data?.user as User;
  },

  /**
   * 更新密码
   * @param passwordData 密码数据
   * @returns 更新后的用户信息
   */
  updatePassword: async (
    passwordData: UpdatePasswordRequest
  ): Promise<User> => {
    const response = await api.patch<AuthResponse>(
      "/users/updatePassword",
      passwordData
    );

    if (response.data && response.data.token) {
      setAuthToken(response.data.token);
    }

    return response.data?.user as User;
  },

  /**
   * 获取所有用户（仅管理员）
   * @returns 用户列表
   */
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<{ users: User[] }>("/users");
    return response.data?.users || [];
  },

  /**
   * 获取单个用户（仅管理员）
   * @param userId 用户ID
   * @returns 用户信息
   */
  getUser: async (userId: string): Promise<User> => {
    const response = await api.get<{ user: User }>(`/users/${userId}`);
    return response.data?.user as User;
  },

  /**
   * 更新用户（仅管理员）
   * @param userId 用户ID
   * @param userData 用户数据
   * @returns 更新后的用户信息
   */
  updateUser: async (
    userId: string,
    userData: UpdateUserRequest & { role?: string; active?: boolean }
  ): Promise<User> => {
    const response = await api.patch<{ user: User }>(
      `/users/${userId}`,
      userData
    );
    return response.data?.user as User;
  },

  /**
   * 删除用户（仅管理员）
   * @param userId 用户ID
   */
  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}`);
  },
};
