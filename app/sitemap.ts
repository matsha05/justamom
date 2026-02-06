import type { MetadataRoute } from "next";
import { getAllNotes } from "@/lib/notes";
import { absoluteUrl } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const notes = getAllNotes();
  const noteEntries: MetadataRoute.Sitemap = notes.map((note) => ({
    url: absoluteUrl(`/notes/${note.slug}`),
    lastModified: new Date(note.date),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/speaking"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/notes"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/legal"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...noteEntries,
  ];
}
