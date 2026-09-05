import Image from "next/image";

interface BookReviewHeadingProps {
  title: string;
  author: string;
  cover: string;
  href: string;
  width: string;
}

export function BookReviewHeading({ title, author, cover, href, width }: BookReviewHeadingProps) {
  return (
    <div className="book-review-heading">
      <a href={href} target="_blank" rel="noopener noreferrer" className="book-review-cover" aria-label={`${title} on the publisher’s website (opens in a new tab)`}>
        <Image src={cover} alt={`${title} book cover`} width={Number(width)} height={450} sizes="(max-width: 640px) 96px, 120px" />
      </a>
      <div>
        <h2><em>{title}</em></h2>
        <p>by {author}</p>
      </div>
    </div>
  );
}
