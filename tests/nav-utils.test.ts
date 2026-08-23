import { describe, expect, it } from "vitest";
import {
  isNavLinkActive,
  isWritingSectionActive,
} from "@/components/header/nav-utils";

describe("header navigation state", () => {
  it("keeps exact page state separate from the Writing section state", () => {
    expect(isNavLinkActive("/blog", "/notes")).toBe(false);
    expect(isNavLinkActive("/blog", "/blog")).toBe(true);
    expect(isNavLinkActive("/blog/a-post", "/blog")).toBe(true);
    expect(isWritingSectionActive("/blog")).toBe(true);
    expect(isWritingSectionActive("/notes/a-note")).toBe(true);
  });
});
