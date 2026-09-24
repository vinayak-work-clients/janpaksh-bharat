import { getLivePosts } from "@/lib/data/posts";
import { SITE_URL } from "@/lib/site-url";

export const revalidate = 300;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Google News sitemap: stories from the last 48 hours. */
export async function GET() {
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const posts = (await getLivePosts()).filter((p) => new Date(p.publishedAt).getTime() >= cutoff);
  const items = posts
    .map(
      (p) => `  <url>
    <loc>${esc(`${SITE_URL}/news/${p.slug}`)}</loc>
    <news:news>
      <news:publication>
        <news:name>Janpaksh Bharat</news:name>
        <news:language>hi</news:language>
      </news:publication>
      <news:publication_date>${new Date(p.publishedAt).toISOString()}</news:publication_date>
      <news:title>${esc(p.title)}</news:title>${p.tags.length ? `\n      <news:keywords>${esc(p.tags.join(", "))}</news:keywords>` : ""}
    </news:news>
  </url>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=300" } });
}
