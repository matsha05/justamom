import { NewsletterForm } from "./NewsletterForm";
import { newsletterCtaCopy } from "@/lib/content";

interface NewsletterCTAProps {
    variant?: "default" | "compact";
}

export function NewsletterCTA({ variant = "default" }: NewsletterCTAProps) {
  if (variant === "compact") {
    return (
      <div className="text-center py-12">
        <h4 className="text-h4 mb-3">{newsletterCtaCopy.heading}</h4>
        <p className="text-body mb-6 max-w-md mx-auto">{newsletterCtaCopy.description}</p>
        <NewsletterForm variant="compact" className="max-w-md mx-auto" />
      </div>
    );
  }

  return (
    <section className="section section-warm">
      <div className="container text-center">
        <h2 className="text-h2 mb-4">{newsletterCtaCopy.heading}</h2>
        <p className="text-body-lg max-w-xl mx-auto mb-8">
          {newsletterCtaCopy.description}
        </p>
        <NewsletterForm variant="compact" className="max-w-md mx-auto" />
      </div>
    </section>
  );
}
