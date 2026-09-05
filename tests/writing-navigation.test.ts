import { describe, expect, it } from "vitest";
import { getVisibleWritingSubnavLinks } from "@/lib/config";

describe("Writing navigation visibility", () => {
  it("keeps Notes and Blog available regardless of post content", () => {
    expect(getVisibleWritingSubnavLinks()).toEqual([
      { href: "/notes", label: "Notes" },
      { href: "/blog", label: "Blog" },
    ]);
  });
});
