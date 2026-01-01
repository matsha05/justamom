import type { MetadataRoute } from "next";
import { getAllNotes } from "@/lib/notes";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://lizishaw.com";

    // Get all notes for dynamic sitemap entries
    const notes = getAllNotes();
    const noteEntries: MetadataRoute.Sitemap = notes.map((note) => ({
        url: `${baseUrl}/notes/${note.slug}`,
        lastModified: new Date(note.date),
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/speaking`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/notes`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
        // Individual note pages
        ...noteEntries,
    ];
}
