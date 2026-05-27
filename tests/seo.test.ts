import { describe, expect, it, vi } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { metadata as labMetadata } from "@/app/lab/layout";
import { metadata as notesMetadata } from "@/app/notes/page";
import { generateMetadata as generateNoteMetadata } from "@/app/notes/[slug]/page";
import { absoluteUrl } from "@/lib/config";
import { getAllNotes } from "@/lib/notes";

vi.mock("server-only", () => ({}));

describe("SEO guardrails", () => {
  it("disallows lab routes in robots.txt", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;

    expect(rules?.disallow).toBe("/lab/");
  });

  it("marks lab routes as noindex", () => {
    expect(labMetadata.robots).toMatchObject({
      index: false,
      follow: false,
    });
  });

  it("includes all notes and fresh static-page dates in the sitemap", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(absoluteUrl("/"));
    expect(urls).toContain(absoluteUrl("/notes"));
    expect(
      entries.find((entry) => entry.url === absoluteUrl("/"))?.lastModified
    ).toEqual(new Date("2026-05-27T00:00:00.000Z"));

    for (const note of getAllNotes()) {
      expect(urls).toContain(absoluteUrl(`/notes/${note.slug}`));
    }
  });

  it("defines canonical and social metadata for note surfaces", async () => {
    expect(notesMetadata.alternates).toMatchObject({
      canonical: "/notes",
    });
    expect(notesMetadata.openGraph).toMatchObject({
      type: "website",
      url: "/notes",
    });

    const noteMetadata = await generateNoteMetadata({
      params: Promise.resolve({ slug: "grace-increasing" }),
    });

    expect(noteMetadata.alternates).toMatchObject({
      canonical: "/notes/grace-increasing",
    });
    expect(noteMetadata.openGraph).toMatchObject({
      type: "article",
      url: "/notes/grace-increasing",
      publishedTime: "2026-05-20",
    });
  });
});
