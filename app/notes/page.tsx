import type { Metadata } from "next";
import Link from "next/link";
import { getAllNotes } from "@/lib/notes";
import { ArrowIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { NotesFeed } from "@/components/notes/NotesFeed";

export const metadata: Metadata = {
  title: "Notes for Moms",
  description:
    "A Note for Moms—short reflections on faith, motherhood, and the quiet work of ordinary days.",
};

export default function NotesPage() {
  const notes = getAllNotes();

  return (
    <>
      <section className="section section-warm pt-[clamp(3.75rem,8vw,6rem)] pb-10">
        <div className="container-prose space-y-6">
          <p className="text-label">Notes for Moms</p>
          <h1 className="text-display">A Note for Moms</h1>
          <p className="text-body-lg text-[var(--color-ink-soft)]">
            Short notes for moms, sent twice a month.
          </p>
        </div>
      </section>

      <section className="section pt-8">
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
      </section>
    </>
  );
}
