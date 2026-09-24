import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSection } from "@/config/sections";
import { getLivePostBySlug, getLivePosts, getMoreInSection, getRelatedPosts } from "@/lib/data/posts";
import { ArticleView } from "@/components/article/ArticleView";

interface Props {
  params: { slug: string };
}

export const revalidate = 60;
/** Posts published after the build render on first request, then cache. */
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getLivePosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getLivePostBySlug(params.slug);
  if (!post) return { title: "Story not found" };
  return {
    title: post.title,
    description: post.standfirst ?? post.excerpt,
    alternates: { canonical: `/news/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.standfirst ?? post.excerpt,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      section: getSection(post.section)?.name,
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.standfirst ?? post.excerpt },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  // live_posts only returns published, unexpired rows: drafts and archived stories 404.
  const post = await getLivePostBySlug(params.slug);
  if (!post) notFound();

  const [related, moreIn] = await Promise.all([getRelatedPosts(post, 3), getMoreInSection(post, 3)]);
  return <ArticleView post={post} related={related} moreIn={moreIn} />;
}
