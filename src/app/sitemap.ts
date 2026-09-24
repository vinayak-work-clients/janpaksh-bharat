import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { sections, sectionHref } from "@/config/sections";
import { getLivePosts } from "@/lib/data/posts";
import { SITE_URL } from "@/lib/site-url";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [...siteConfig.nav.map((n) => n.href), "/privacy", "/terms"].map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" || path === "/breaking" ? ("hourly" as const) : ("weekly" as const),
    priority: path === "/" ? 1 : 0.7,
  }));

  const sectionRoutes = sections.map((s) => ({
    url: `${SITE_URL}${sectionHref(s.slug)}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));

  const posts = (await getLivePosts()).map((p) => ({
    url: `${SITE_URL}/news/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "daily" as const,
    priority: p.isBreaking ? 0.9 : 0.8,
  }));

  return [...staticRoutes, ...sectionRoutes, ...posts];
}
