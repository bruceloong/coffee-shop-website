import type { NextConfig } from "next";

/**
 * 部署配置通过环境变量注入（本地 / GitHub Actions / 部署脚本共用）：
 * - NEXT_PUBLIC_BASE_PATH：GitHub Pages 项目页需要 /<repo> 前缀；绑定自定义域名（public/CNAME 存在）时不设置
 * - NEXT_OUTPUT=export：静态导出（GitHub Pages）
 * - NEXT_PUBLIC_SITE_URL：canonical / sitemap / JSON-LD 使用的站点地址
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
const isExport = process.env.NEXT_OUTPUT === "export";

const nextConfig: NextConfig = {
  basePath: basePath || undefined,
  ...(isExport ? { output: "export" as const } : {}),
  images: {
    formats: ["image/avif", "image/webp"],
    // 静态导出模式下 next/image 优化器不可用
    unoptimized: isExport,
  },
};

export default nextConfig;
