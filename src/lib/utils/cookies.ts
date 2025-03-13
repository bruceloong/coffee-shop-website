import Cookies from "js-cookie";

/**
 * 获取cookie值
 * @param name cookie名称
 * @returns cookie值
 */
export const getCookie = (name: string): string | undefined => {
  // 确保在浏览器环境中运行
  if (typeof window === "undefined") {
    return undefined;
  }
  return Cookies.get(name);
};

/**
 * 设置cookie
 * @param name cookie名称
 * @param value cookie值
 * @param options cookie选项
 */
export const setCookie = (
  name: string,
  value: string,
  options?: Cookies.CookieAttributes
): void => {
  // 确保在浏览器环境中运行
  if (typeof window === "undefined") {
    return;
  }
  Cookies.set(name, value, options);
};

/**
 * 删除cookie
 * @param name cookie名称
 * @param options cookie选项
 */
export const removeCookie = (
  name: string,
  options?: Cookies.CookieAttributes
): void => {
  // 确保在浏览器环境中运行
  if (typeof window === "undefined") {
    return;
  }
  Cookies.remove(name, options);
};

/**
 * 设置认证令牌
 * @param token JWT令牌
 */
export const setAuthToken = (token: string): void => {
  setCookie("jwt", token, {
    expires: 90, // 90天过期
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

/**
 * 清除认证令牌
 */
export const clearAuthToken = (): void => {
  removeCookie("jwt");
};
