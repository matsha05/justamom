import type { Metadata } from "next";
import Link from "next/link";
import { getAllNotes } from "@/lib/notes";
import { buildPageMetadata } from "@/lib/metadata";
import { ArrowIcon } from "@/components/icons/ArrowIcon";
import { PageHero } from "@/components/layout/PageHero";
import { NewsletterSignupPanel } from "@/components/NewsletterSignupPanel";
import { Button } from "@/components/ui/button";
import { NotesFeed } from "@/components/notes/NotesFeed";
import { marketingContent } from "@/content/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Writing",
  description:
    "A Note for Moms and other writing from Lizi Shaw, all in one place.",
  pathname: "/notes",
});

export default function NotesPage() {
  const notes = getAllNotes();
  const monthlyNotes = notes.filter((note) => note.kind === "note");
  const blogPosts = notes.filter((note) => note.kind === "blog");

  return (
    <>
      <PageHero
        eyebrow="Archive"
        title="Writing"
        description="A Note for Moms and other writing, all in one place."
        density="compact"
      >
        <nav aria-label="Writing sections" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link className="link-arrow" href="#recent-notes">
            A Note for Moms
            <ArrowIcon />
          </Link>
          <Link className="link-arrow" href="#blog">
            Blog
            <ArrowIcon />
          </Link>
        </nav>
      </PageHero>

      <section id="recent-notes" className="section section-notes-list scroll-mt-24">
        <div className="container">
          <div className="section-split">
            <div className="space-y-5 lg:pt-1">
              <p className="text-label">A Note for Moms</p>
              <h2 className="text-h1">Recent notes</h2>
              <p className="text-body max-w-[28ch] text-[var(--color-ink-soft)]">
                The monthly email note, gathered here to read anytime.
              </p>
              <Button asChild>
                <Link href="#newsletter">
                  Join A Note for Moms
                  <ArrowIcon />
                </Link>
              </Button>
            </div>

            <NotesFeed
              notes={monthlyNotes}
              className="space-y-10 max-w-[43rem]"
              supportingItemClassName="py-9 first:pt-0"
            />
          </div>
        </div>
      </section>

      <section id="blog" className="section section-compact section-soft scroll-mt-24">
        <div className="container">
          <div className="section-split">
            <div className="space-y-4 lg:pt-1">
              <p className="text-label">More writing</p>
              <h2 className="text-h1">Blog</h2>
              <p className="text-body max-w-[30ch] text-[var(--color-ink-soft)]">
                Other posts will live here. They won&apos;t be emailed, but the monthly note will link to what&apos;s new.
              </p>
            </div>

            <NotesFeed
              notes={blogPosts}
              emptyMessage="Blog posts are on the way."
              className="max-w-[43rem] border-y border-[var(--color-border)] py-8"
              supportingItemClassName="py-9 first:pt-0"
            />
          </div>
        </div>
      </section>

      <section id="newsletter" className="section">
        <div className="container-prose">
          <NewsletterSignupPanel
            panel={marketingContent.newsletter.notesArchivePanel}
            align="left"
          />
        </div>
      </section>
    </>
  );
}
