import type { ReactNode } from "react";

interface FootnoteNumberProps {
  number: string;
}

export function FootnoteReference({ number }: FootnoteNumberProps) {
  return (
    <sup className="post-footnote-reference">
      <a
        id={`footnote-ref-${number}`}
        href={`#footnote-${number}`}
        role="doc-noteref"
        aria-label={`Read footnote ${number}`}
      >
        {number}
      </a>
    </sup>
  );
}

export function PostFootnotes({ children }: { children: ReactNode }) {
  return (
    <section className="post-footnotes" role="doc-endnotes" aria-label="Footnotes">
      <ol className="post-footnotes-list" role="list">
        {children}
      </ol>
    </section>
  );
}

export function PostFootnote({
  number,
  children,
}: FootnoteNumberProps & { children: ReactNode }) {
  return (
    <li id={`footnote-${number}`} className="post-footnote" tabIndex={-1}>
      <span className="post-footnote-number" aria-hidden="true">
        {number}
      </span>
      <div className="post-footnote-copy">
        {children}
        <a
          className="post-footnote-backlink"
          href={`#footnote-ref-${number}`}
          role="doc-backlink"
          aria-label={`Back to the story at footnote ${number}`}
        >
          Back to the story
        </a>
      </div>
    </li>
  );
}
