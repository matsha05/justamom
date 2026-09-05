import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllNotes } from "@/lib/notes";
import { buildPageMetadata } from "@/lib/metadata";
import { ArrowIcon } from "@/components/icons/ArrowIcon";
import { PageHero } from "@/components/layout/PageHero";
import { NewsletterSignupPanel } from "@/components/NewsletterSignupPanel";
import { Button } from "@/components/ui/button";
import { NotesFeed } from "@/components/notes/NotesFeed";
import { WritingDirectoryNav } from "@/components/notes/WritingDirectoryNav";
import { marketingContent } from "@/content/site";

export const metadata: Metadata = buildPageMetadata({
  title: "A Note for Moms",
  description: "Read recent editions of A Note for Moms from Lizi Shaw.",
  pathname: "/notes",
});

export default function NotesPage() {
  const notes = getAllNotes();
  const monthlyNotes = notes.filter((note) => note.kind === "note");

  return (
    <>
      <PageHero
        eyebrow="Writing"
        title="A Note for Moms"
        description="Monthly notes about following Jesus through motherhood and ordinary life."
        density="compact"
        className="writing-directory-hero"
        media={
          <div className="image-editorial writing-directory-photo">
            <Image
              src="/images/notes-kitchen-with-kids.avif"
              alt="Lizi holding Ellie in the kitchen while Cooper bakes beside the mixer"
              width={1400}
              height={1050}
              sizes="(min-width: 1024px) 448px, (min-width: 500px) 448px, 90vw"
              priority
            />
          </div>
        }
      >
        <WritingDirectoryNav current="notes" />
      </PageHero>

      <section className="section section-notes-list">
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
