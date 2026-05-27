import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

interface PageMetadataOptions {
  title: string;
  description: string;
  pathname: string;
}

interface ArticleMetadataOptions extends PageMetadataOptions {
  publishedTime: string;
  modifiedTime?: string;
}

export function buildPageMetadata({
  title,
  description,
  pathname,
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      title,
      description,
      url: pathname,
      siteName: siteConfig.site.name,
      locale: siteConfig.site.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: siteConfig.social.twitterHandle,
    },
  };
}

export function buildArticleMetadata({
  title,
  description,
  pathname,
  publishedTime,
  modifiedTime = publishedTime,
}: ArticleMetadataOptions): Metadata {
  return {
    ...buildPageMetadata({ title, description, pathname }),
    openGraph: {
      title,
      description,
      url: pathname,
      siteName: siteConfig.site.name,
      locale: siteConfig.site.locale,
      type: "article",
      publishedTime,
      modifiedTime,
      authors: [siteConfig.author.name],
    },
  };
}
