import type { HTMLAttributes } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { DownloadCard } from "@/components/DownloadCard";
import { MDXImage } from "@/components/MDXImage";
import { NoteNewsletterCTA } from "@/components/NoteNewsletterCTA";
import { NoteSignOff } from "@/components/NoteSignOff";
import { NoteNavigation } from "@/components/notes/NoteNavigation";
import type { NoteMetadata, WritingKind } from "@/lib/notes";

const mdxComponents = {
  p: ({ children, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-6 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  strong: ({ children, ...props }: HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-[var(--color-ink)]" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: HTMLAttributes<HTMLElement>) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),
  blockquote: ({ children, ...props }: HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-10 border-l-2 border-[var(--color-border-strong)] pl-6 [&_p]:mb-0"
      {...props}
    >
      <div className="text-body-lg italic leading-relaxed text-[var(--color-ink-soft)]">
        {children}
      </div>
    </blockquote>
  ),
  img: MDXImage,
  DownloadCard,
};

interface NoteArticleProps {
  content: string;
  postscript: string | null;
  kind: WritingKind;
  previousNote: NoteMetadata | null;
  nextNote: NoteMetadata | null;
}

export function NoteArticle({
  content,
  postscript,
  kind,
  previousNote,
  nextNote,
}: NoteArticleProps) {
  return (
    <article>
      <div className="note-article-content text-body-lg">
        <MDXRemote source={content} components={mdxComponents} />
      </div>

      {kind === "note" ? <NoteSignOff className="note-signoff" /> : null}
      {postscript ? (
        <div className="note-article-content mt-8 text-body-lg">
          <MDXRemote source={postscript} components={mdxComponents} />
        </div>
      ) : null}
      <NoteNewsletterCTA />
      <NoteNavigation previousNote={previousNote} nextNote={nextNote} />
    </article>
  );
}
