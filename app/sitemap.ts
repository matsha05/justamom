import type { MetadataRoute } from "next";
import { getAllNotes } from "@/lib/notes";
import { absoluteUrl } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const notes = getAllNotes();
  const staticLastModified = new Date("2026-02-06T00:00:00.000Z");
  const notesLastModified =
    notes.length > 0 ? new Date(notes[0].date) : staticLastModified;

  const noteEntries: MetadataRoute.Sitemap = notes.map((note) => ({
    url: absoluteUrl(`/notes/${note.slug}`),
    lastModified: new Date(note.date),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: absoluteUrl("/"),
      lastModified: staticLastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: staticLastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/speaking"),
      lastModified: staticLastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/notes"),
      lastModified: notesLastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/work"),
      lastModified: staticLastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: staticLastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/legal"),
      lastModified: staticLastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...noteEntries,
  ];
}
