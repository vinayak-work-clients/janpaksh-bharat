import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLivePostBySlug, getLivePosts, getMoreInSection, getRelatedPosts } from "@/lib/posts";
import { ArticleView } from "@/components/article/ArticleView";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getLivePosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getLivePostBySlug(params.slug);
  if (!post) return { title: "Story not found" };
  return {
    title: post.title,
    description: post.standfirst ?? post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.standfirst ?? post.excerpt,
      images: [{ url: post.coverImage }],
      publishedTime: post.publishedAt,
      authors: [post.author.name],
    },
  };
}

export default function NewsArticlePage({ params }: Props) {
  const post = getLivePostBySlug(params.slug);
  if (!post) notFound();

  return <ArticleView post={post} related={getRelatedPosts(post, 3)} moreIn={getMoreInSection(post, 3)} />;
}
