import type { NextConfig } from "next";

/**
 * 部署配置通过环境变量注入（本地 / GitHub Actions 共用）：
 * - NEXT_OUTPUT=export：静态导出（Cloudflare Workers 静态资源）
 * - NEXT_PUBLIC_SITE_URL：canonical / sitemap / JSON-LD 使用的站点地址
 */
const isExport = process.env.NEXT_OUTPUT === "export";

const nextConfig: NextConfig = {
  ...(isExport ? { output: "export" as const } : {}),
  ...(isExport ? { output: "export" as const } : {}),
  images: {
    formats: ["image/avif", "image/webp"],
    // 静态导出模式下 next/image 优化器不可用
    unoptimized: isExport,
  },
};

export default nextConfig;
