import type { MetadataRoute } from "next";

// 静态导出（output: export）要求显式声明
export const dynamic = "force-static";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://coffee.mengyadiary.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
