import type { NextConfig } from "next";

// 检测是否是GitHub Pages环境
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const repoName =
  process.env.GITHUB_REPOSITORY?.split("/")[1] || "coffee-shop-website";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  // 只在GitHub Pages环境中设置basePath和assetPrefix
  ...(isGitHubPages
    ? {
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
      }
    : {}),
  images: {
    unoptimized: true,
  },
  // 确保生成的静态文件包含正确的路径
  trailingSlash: true,
};

export default nextConfig;
