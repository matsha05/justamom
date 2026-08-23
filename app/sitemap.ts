import type { MetadataRoute } from "next";
import { getAllNotes, getWritingHref } from "@/lib/notes";
import { absoluteUrl } from "@/lib/config";

const staticPageLastModified = new Date("2026-08-23T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const notes = getAllNotes();
  const monthlyNotes = notes.filter((note) => note.kind === "note");
  const blogPosts = notes.filter((note) => note.kind === "blog");
  const notesLastModified =
    monthlyNotes.length > 0 ? new Date(monthlyNotes[0].date) : staticPageLastModified;
  const blogLastModified =
    blogPosts.length > 0 ? new Date(blogPosts[0].date) : staticPageLastModified;

  const writingEntries: MetadataRoute.Sitemap = notes.map((note) => ({
    url: absoluteUrl(getWritingHref(note)),
    lastModified: new Date(note.date),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const blogIndexEntry: MetadataRoute.Sitemap =
    blogPosts.length > 0
      ? [
          {
            url: absoluteUrl("/blog"),
            lastModified: blogLastModified,
            changeFrequency: "weekly",
            priority: 0.7,
          },
        ]
      : [];

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
    ...blogIndexEntry,
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
    ...writingEntries,
  ];
}
