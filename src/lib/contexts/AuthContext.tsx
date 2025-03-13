"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, userApi } from "../api/userApi";
import { getCookie, clearAuthToken } from "../utils/cookies";

// 认证上下文接口
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }) => Promise<void>;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者属性接口
interface AuthProviderProps {
  children: ReactNode;
}

// 认证提供者组件
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 检查用户是否已认证
  const isAuthenticated = !!user;

  // 初始化时加载用户信息
  useEffect(() => {
    const loadUser = async () => {
      try {
        // 检查是否有JWT令牌
        const token = getCookie("jwt");
        if (!token) {
          setLoading(false);
          return;
        }

        // 获取当前用户信息
        const userData = await userApi.getCurrentUser();
        setUser(userData);
        setError(null);
      } catch (err) {
        console.error("Failed to load user:", err);
        setError("Failed to authenticate user");
        clearAuthToken();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // 登录
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await userApi.login({ email, password });
      setUser(userData);
      setError(null);
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 注册
  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await userApi.signup({ name, email, password });
      setUser(userData);
      setError(null);
    } catch (err: any) {
      console.error("Signup failed:", err);
      setError(err.message || "Signup failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 登出
  const logout = async () => {
    setLoading(true);
    try {
      await userApi.logout();
      setUser(null);
      setError(null);
    } catch (err: any) {
      console.error("Logout failed:", err);
      setError(err.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  // 更新用户资料
  const updateProfile = async (userData: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }) => {
    setLoading(true);
    try {
      const updatedUser = await userApi.updateProfile(userData);
      setUser(updatedUser);
      setError(null);
    } catch (err: any) {
      console.error("Profile update failed:", err);
      setError(err.message || "Profile update failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 更新密码
  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    setLoading(true);
    try {
      const userData = await userApi.updatePassword({
        currentPassword,
        newPassword,
      });
      setUser(userData);
      setError(null);
    } catch (err: any) {
      console.error("Password update failed:", err);
      setError(err.message || "Password update failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 提供上下文值
  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 使用认证上下文的钩子
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
