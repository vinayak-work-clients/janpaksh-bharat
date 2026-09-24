/** JSON-LD builders. All URLs are absolute (NEXT_PUBLIC_SITE_URL). */
import type { Post } from "@/types/content";
import type { Section } from "@/config/sections";
import type { SiteSettings } from "@/lib/site-settings";
import { SITE_URL } from "@/lib/site-url";

export const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`);

export function organizationLd(s: SiteSettings) {
  const sameAs = [s.socials.instagram, s.socials.youtube, s.socials.x, s.socials.facebook].filter((u) => /^https?:\/\//.test(u));
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: s.name,
    alternateName: s.nameHindi,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: s.logo.url ?? abs("/icon.png") },
    description: s.description,
    email: s.contact.email,
    telephone: s.contact.phone,
    address: { "@type": "PostalAddress", addressLocality: s.location, addressCountry: "IN" },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function webSiteLd(s: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: s.name,
    alternateName: s.nameHindi,
    description: s.description,
    inLanguage: ["en-IN", "hi-IN"],
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function articleLd(post: Post, s: SiteSettings, section?: Section) {
  const isPodcast = post.type === "podcast";
  const base = {
    "@context": "https://schema.org",
    "@type": isPodcast ? "PodcastEpisode" : "NewsArticle",
    "@id": abs(`/news/${post.slug}`),
    url: abs(`/news/${post.slug}`),
    headline: post.title,
    ...(post.titleHindi ? { alternativeHeadline: post.titleHindi } : {}),
    description: post.standfirst ?? post.excerpt,
    image: [post.coverImage],
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    expires: post.expiresAt,
    inLanguage: post.titleHindi ? "hi-IN" : "en-IN",
    author: { "@type": "Person", name: post.author.name },
    publisher: {
      "@type": "NewsMediaOrganization",
      "@id": `${SITE_URL}/#organization`,
      name: s.name,
      logo: { "@type": "ImageObject", url: s.logo.url ?? abs("/icon.png") },
    },
    ...(section ? { articleSection: section.name } : {}),
    ...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
    isAccessibleForFree: true,
  };
  if (!isPodcast) return { ...base, mainEntityOfPage: abs(`/news/${post.slug}`) };
  return {
    ...base,
    name: post.title,
    partOfSeries: { "@type": "PodcastSeries", name: s.podcast.showName, url: abs("/podcasts") },
    ...(post.mediaUrl ? { associatedMedia: { "@type": "MediaObject", contentUrl: post.mediaUrl } } : {}),
    ...(post.durationSec ? { timeRequired: `PT${Math.round(post.durationSec)}S` } : {}),
  };
}
