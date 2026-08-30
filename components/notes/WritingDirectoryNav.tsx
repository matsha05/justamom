import Link from "next/link";
import { getVisibleWritingSubnavLinks } from "@/lib/config";
import { getAllNotes } from "@/lib/notes";

interface WritingDirectoryNavProps {
  current: "notes" | "blog";
}

export function WritingDirectoryNav({ current }: WritingDirectoryNavProps) {
  const writingLinks = getVisibleWritingSubnavLinks(
    getAllNotes().some((note) => note.kind === "blog")
  );

  return (
    <nav aria-label="Writing sections" className="writing-directory-nav">
      {writingLinks.map((link) => {
        const isCurrent =
          (current === "notes" && link.href === "/notes") ||
          (current === "blog" && link.href === "/blog");

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isCurrent ? "page" : undefined}
            className="writing-directory-link"
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
