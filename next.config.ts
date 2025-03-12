import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  // 确保生成的静态文件包含正确的路径
  trailingSlash: true,
};

export default nextConfig;
