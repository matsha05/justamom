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
  title: "Notes for Moms",
  description:
    "Short notes for moms on faith, motherhood, and everyday life.",
  pathname: "/notes",
});

export default function NotesPage() {
  const notes = getAllNotes();

  return (
    <>
      <PageHero
        eyebrow="Notes for Moms"
        title="A Note for Moms"
        description="Short notes for moms, sent twice a month."
        density="compact"
      />

      <section className="section section-notes-list">
        <div className="container">
          <div className="section-split">
            <div className="space-y-5 lg:pt-1">
              <p className="text-label">Recent Notes</p>
              <h2 className="text-h1">For the mom in the thick of it</h2>
              <Button asChild>
                <Link href="/#newsletter">
                  Join A Note for Moms
                  <ArrowIcon />
                </Link>
              </Button>
            </div>

            <NotesFeed
              notes={notes}
              className="space-y-10 max-w-[43rem]"
              supportingItemClassName="py-9 first:pt-0"
            />
          </div>
        </div>

        <div className="container-prose container-prose-followup">
          <NewsletterSignupPanel
            panel={marketingContent.newsletter.notesArchivePanel}
            align="left"
          />
        </div>
      </section>
    </>
  );
}
