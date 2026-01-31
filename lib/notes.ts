import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface NoteMetadata {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
}

const notesDirectory = path.join(process.cwd(), "content/notes");

export function getAllNotes(): NoteMetadata[] {
    const fileNames = fs.readdirSync(notesDirectory);
    const notes = fileNames
        .filter((fileName) => fileName.endsWith(".mdx"))
        .map((fileName) => {
            const slug = fileName.replace(/\.mdx$/, "");
            const fullPath = path.join(notesDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const { data } = matter(fileContents);

            return {
                slug,
                title: data.title,
                date: data.date,
                excerpt: data.excerpt,
            };
        });

    // Sort by date, newest first
    return notes.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getNoteBySlug(slug: string) {
    const fullPath = path.join(notesDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const normalizedContent = stripTrailingSignOff(content);

    return {
        slug,
        metadata: {
            title: data.title,
            date: data.date,
            excerpt: data.excerpt,
        },
        content: normalizedContent,
    };
}

function stripTrailingSignOff(content: string): string {
    const trimmed = content.trimEnd();
    const signOffPattern = /(?:^|\n)\s*In it with you,\s*\n\s*Lizi\s*$/i;
    if (!signOffPattern.test(trimmed)) {
        return content;
    }
    const withoutSignOff = trimmed.replace(signOffPattern, "");
    return `${withoutSignOff.trimEnd()}\n`;
}

export function getAllNoteSlugs(): string[] {
    const fileNames = fs.readdirSync(notesDirectory);
    return fileNames
        .filter((fileName) => fileName.endsWith(".mdx"))
        .map((fileName) => fileName.replace(/\.mdx$/, ""));
}

export function getAdjacentNotes(currentSlug: string): {
    prev: NoteMetadata | null;
    next: NoteMetadata | null;
} {
    const notes = getAllNotes(); // Already sorted by date, newest first
    const currentIndex = notes.findIndex((note) => note.slug === currentSlug);

    if (currentIndex === -1) {
        return { prev: null, next: null };
    }

    return {
        // Prev = newer note (earlier in array)
        prev: currentIndex > 0 ? notes[currentIndex - 1] : null,
        // Next = older note (later in array)
        next: currentIndex < notes.length - 1 ? notes[currentIndex + 1] : null,
    };
}
