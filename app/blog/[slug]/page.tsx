import type { Metadata } from "next";
import { WritingDetailPage } from "@/components/notes/WritingDetailPage";
import {
  getAllWritingSlugs,
  getNoteBySlug,
  getWritingHref,
} from "@/lib/notes";
import { buildArticleMetadata } from "@/lib/metadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllWritingSlugs("blog").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = getNoteBySlug(slug);
    if (post.metadata.kind !== "blog") {
      throw new Error("Not a blog post");
    }

    return buildArticleMetadata({
      title: post.metadata.title,
      description: post.metadata.excerpt,
      pathname: getWritingHref({ slug, kind: "blog" }),
      publishedTime: post.metadata.date,
    });
  } catch {
    return { title: "Post Not Found" };
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  return <WritingDetailPage slug={slug} kind="blog" />;
}
