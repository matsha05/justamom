import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getVisibleWritingSubnavLinks } from "@/lib/config";

export function Chrome({ children }: { children: ReactNode }) {
  const writingLinks = getVisibleWritingSubnavLinks();

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
