import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://coffee.yss520.online";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/menu", "/about", "/contact", "/cart"] as const;

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/menu" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
