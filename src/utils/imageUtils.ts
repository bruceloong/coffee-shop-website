/**
 * 获取图片的完整URL，处理GitHub Pages环境和自定义域名下的路径问题
 * @param path 图片路径
 * @returns 完整的图片URL
 */
export function getImageUrl(path: string): string {
  // 确保路径以/开头
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // 检查是否在浏览器环境
  // if (typeof window === "undefined") {
  //   // 服务器端渲染环境，返回基本路径
  //   return `/images${normalizedPath}`;
  // }

  // // 尝试从Next.js数据中获取basePath
  let basePath = "";
  // try {
  //   const nextData = window.__NEXT_DATA__;
  //   if (nextData?.runtimeConfig?.basePath) {
  //     basePath = nextData.runtimeConfig.basePath;
  //   }
  // } catch (e) {
  //   // 如果无法访问Next.js数据，继续使用默认逻辑
  //   console.warn("无法从Next.js配置中获取basePath: ", e);
  // }

  // 客户端环境，检查当前URL
  const hostname = window.location.hostname;

  // 情况1: GitHub Pages 环境 (github.io)
  if (hostname.includes("github.io") && !basePath) {
    // 从URL中提取仓库名称
    const pathSegments = window.location.pathname.split("/");
    const repoName = pathSegments[1]; // 第一个路径段是仓库名称

    // 使用仓库名称作为basePath
    basePath = `/${repoName}`;
  }

  // 情况2: 自定义域名或本地开发环境
  // 使用已经确定的basePath（可能为空）

  // 返回完整路径
  return `${basePath}/images${normalizedPath}`;
}

/**
 * 检测当前环境
 * @returns 环境信息对象
 */
export function detectEnvironment() {
  if (typeof window === "undefined") {
    return { isServer: true, isGitHubPages: false, isCustomDomain: false };
  }

  const hostname = window.location.hostname;
  const isGitHubPages = hostname.includes("github.io");
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
  const isCustomDomain = !isGitHubPages && !isLocalhost;

  return {
    isServer: false,
    isGitHubPages,
    isLocalhost,
    isCustomDomain,
    hostname,
  };
}
