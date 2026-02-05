import "server-only";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";

export interface NoteMetadata {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

interface NoteRecord extends NoteMetadata {
  content: string;
}

const notesDirectory = path.join(process.cwd(), "content/notes");

function parseRequiredString(
  value: unknown,
  field: "title" | "date" | "excerpt",
  slug: string
): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid frontmatter: '${field}' is required for note '${slug}'.`);
  }
  return value.trim();
}

function parseDate(value: string, slug: string): string {
  if (Number.isNaN(Date.parse(value))) {
    throw new Error(`Invalid frontmatter: 'date' is invalid for note '${slug}'.`);
  }
  return value;
}

function parseNoteFile(fileName: string): NoteRecord {
  const slug = fileName.replace(/\.mdx$/, "");
  const fullPath = path.join(notesDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const title = parseRequiredString(data.title, "title", slug);
  const date = parseDate(parseRequiredString(data.date, "date", slug), slug);
  const excerpt = parseRequiredString(data.excerpt, "excerpt", slug);

  return {
    slug,
    title,
    date,
    excerpt,
    content,
  };
}

const readNotes = cache((): NoteRecord[] => {
  const fileNames = fs.readdirSync(notesDirectory);

  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => parseNoteFile(fileName))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
});

function stripTrailingSignOff(content: string): string {
  const trimmed = content.trimEnd();
  const signOffPattern = /(?:^|\n)\s*In it with you,\s*\n\s*Lizi\s*$/i;
  if (!signOffPattern.test(trimmed)) {
    return content;
  }
  const withoutSignOff = trimmed.replace(signOffPattern, "");
  return `${withoutSignOff.trimEnd()}\n`;
}

export function getAllNotes(): NoteMetadata[] {
  return readNotes().map((note) => ({
    slug: note.slug,
    title: note.title,
    date: note.date,
    excerpt: note.excerpt,
  }));
}

export function getNoteBySlug(slug: string) {
  const note = readNotes().find((entry) => entry.slug === slug);
  if (!note) {
    throw new Error(`Note not found: '${slug}'.`);
  }

  return {
    slug: note.slug,
    metadata: {
      title: note.title,
      date: note.date,
      excerpt: note.excerpt,
    },
    content: stripTrailingSignOff(note.content),
  };
}

export function getAllNoteSlugs(): string[] {
  return readNotes().map((note) => note.slug);
}

export function getAdjacentNotes(currentSlug: string): {
  prev: NoteMetadata | null;
  next: NoteMetadata | null;
} {
  const notes = getAllNotes();
  const currentIndex = notes.findIndex((note) => note.slug === currentSlug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? notes[currentIndex - 1] : null,
    next: currentIndex < notes.length - 1 ? notes[currentIndex + 1] : null,
  };
}
