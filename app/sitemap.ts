import type { MetadataRoute } from "next";
import { getAllNotes } from "@/lib/notes";
import { absoluteUrl } from "@/lib/config";

const staticPageLastModified = new Date("2026-05-27T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const notes = getAllNotes();
  const notesLastModified =
    notes.length > 0 ? new Date(notes[0].date) : staticPageLastModified;

  const noteEntries: MetadataRoute.Sitemap = notes.map((note) => ({
    url: absoluteUrl(`/notes/${note.slug}`),
    lastModified: new Date(note.date),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: absoluteUrl("/"),
      lastModified: staticPageLastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: staticPageLastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/speaking"),
      lastModified: staticPageLastModified,
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
      lastModified: staticPageLastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: staticPageLastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/legal"),
      lastModified: staticPageLastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...noteEntries,
  ];
}
