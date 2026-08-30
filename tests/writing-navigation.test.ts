import { describe, expect, it } from "vitest";
import { getVisibleWritingSubnavLinks } from "@/lib/config";

describe("Writing navigation visibility", () => {
  it("hides Blog while the archive is empty", () => {
    expect(getVisibleWritingSubnavLinks(false)).toEqual([
      { href: "/notes", label: "Notes" },
    ]);
  });

  it("reveals Blog when at least one post exists", () => {
    expect(getVisibleWritingSubnavLinks(true)).toEqual([
      { href: "/notes", label: "Notes" },
      { href: "/blog", label: "Blog" },
    ]);
  });
});
