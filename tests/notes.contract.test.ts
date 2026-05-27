import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";

const notesDirectory = path.join(process.cwd(), "content/notes");

interface ParsedNote {
  slug: string;
  fileName: string;
  title: unknown;
  date: unknown;
  excerpt: unknown;
  content: string;
}

function readNotes(): ParsedNote[] {
  return fs
    .readdirSync(notesDirectory)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(notesDirectory, fileName);
      const { data, content } = matter(fs.readFileSync(fullPath, "utf8"));

      return {
        slug,
        fileName,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        content,
      };
    });
}

function expectRequiredString(value: unknown, field: string, fileName: string): string {
  expect(value, `${fileName} is missing ${field}`).toEqual(expect.any(String));
  const parsedValue = value as string;
  expect(parsedValue.trim(), `${fileName} has a blank ${field}`).not.toBe("");
  return parsedValue;
}

describe("note content contract", () => {
  it("keeps every note discoverable with complete frontmatter", () => {
    const notes = readNotes();

    expect(notes.length).toBeGreaterThan(0);

    for (const note of notes) {
      expect(note.slug, `${note.fileName} should use a route-safe slug`).toMatch(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/
      );

      expectRequiredString(note.title, "title", note.fileName);
      const date = expectRequiredString(note.date, "date", note.fileName);
      expect(Date.parse(date), `${note.fileName} has an invalid date`).not.toBeNaN();
      expectRequiredString(note.excerpt, "excerpt", note.fileName);
    }
  });

  it("keeps note slugs unique", () => {
    const slugs = readNotes().map((note) => note.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("does not duplicate Lizi's sign-off inside source notes", () => {
    const signOffPattern = /In it with you,\s*\n\s*Lizi/gi;

    for (const note of readNotes()) {
      const signOffs = note.content.match(signOffPattern) ?? [];

      expect(
        signOffs.length,
        `${note.fileName} should contain Lizi's sign-off at most once`
      ).toBeLessThanOrEqual(1);
    }
  });
});
