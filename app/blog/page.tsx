import type { Metadata } from "next";
import Link from "next/link";
import { getAllNotes } from "@/lib/notes";
import { buildPageMetadata } from "@/lib/metadata";
import { ArrowIcon } from "@/components/icons/ArrowIcon";
import { PageHero } from "@/components/layout/PageHero";
import { NewsletterSignupPanel } from "@/components/NewsletterSignupPanel";
import { NotesFeed } from "@/components/notes/NotesFeed";
import { WritingDirectoryNav } from "@/components/notes/WritingDirectoryNav";
import { marketingContent } from "@/content/site";

const blogPosts = getAllNotes().filter((note) => note.kind === "blog");

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Blog",
    description: "Blog posts and other writing from Lizi Shaw.",
    pathname: "/blog",
  }),
  ...(blogPosts.length === 0
    ? { robots: { index: false, follow: true } }
    : {}),
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Writing"
        title="Blog"
        description="Other writing from Lizi. New posts will be gathered here as they’re published."
        density="compact"
      >
        <WritingDirectoryNav current="blog" />
      </PageHero>

      <section className="section section-notes-list section-soft">
        <div className="container">
          <div className="section-split">
            <div className="space-y-4 lg:pt-1">
              <p className="text-label">Blog</p>
              <h2 className="text-h1">Recent posts</h2>
              <p className="text-body max-w-[30ch] text-[var(--color-ink-soft)]">
                These posts won&apos;t be emailed, but the monthly note will link to what&apos;s new.
              </p>
            </div>

            {blogPosts.length > 0 ? (
              <NotesFeed
                notes={blogPosts}
                className="space-y-10 max-w-[43rem]"
                supportingItemClassName="py-9 first:pt-0"
              />
            ) : (
              <div className="writing-empty-state max-w-[43rem]">
                <p className="text-h3">Blog posts are on the way.</p>
                <p className="text-body max-w-[36ch]">
                  In the meantime, Lizi&apos;s recent notes are ready to read.
                </p>
                <Link className="link-arrow" href="/notes">
                  Read recent notes
                  <ArrowIcon />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="newsletter" className="section">
        <div className="container-prose">
          <NewsletterSignupPanel
            panel={marketingContent.newsletter.blogArchivePanel}
            align="left"
          />
        </div>
      </section>
    </>
  );
}
