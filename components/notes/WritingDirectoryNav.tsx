import Link from "next/link";
import { writingSubnavLinks } from "@/lib/config";

interface WritingDirectoryNavProps {
  current: "notes" | "blog";
}

export function WritingDirectoryNav({ current }: WritingDirectoryNavProps) {
  return (
    <nav aria-label="Writing sections" className="writing-directory-nav">
      {writingSubnavLinks.map((link) => {
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
