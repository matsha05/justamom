import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getVisibleWritingSubnavLinks } from "@/lib/config";
import { getAllNotes } from "@/lib/notes";

export function Chrome({ children }: { children: ReactNode }) {
  const writingLinks = getVisibleWritingSubnavLinks(
    getAllNotes().some((note) => note.kind === "blog")
  );

  return (
    <>
      <Header writingLinks={writingLinks} />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer writingLinks={writingLinks} />
    </>
  );
}
