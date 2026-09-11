import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getLivePosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [...siteConfig.nav.map((n) => n.href), "/privacy", "/terms"].map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" || path === "/breaking" ? ("hourly" as const) : ("weekly" as const),
    priority: path === "/" ? 1 : 0.7,
  }));

  const posts = getLivePosts().map((p) => ({
    url: `${SITE_URL}/news/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "daily" as const,
    priority: p.isBreaking ? 0.9 : 0.8,
  }));

  return [...staticRoutes, ...posts];
}
