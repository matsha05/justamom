import { NewsletterForm } from "./NewsletterForm";

interface NewsletterCTAProps {
    variant?: "default" | "compact";
}

export function NewsletterCTA({ variant = "default" }: NewsletterCTAProps) {
    if (variant === "compact") {
        return (
            <div className="text-center py-12">
                <h4 className="text-h4 mb-3">A quiet note for your month.</h4>
                <p className="text-body text-[var(--color-ink-muted)] mb-6 max-w-md mx-auto">
                    Twice each month I send a short reflection for moms who want wisdom,
                    honesty, and encouragement rooted in Scripture.
                </p>
                <NewsletterForm variant="compact" className="max-w-md mx-auto" />
            </div>
        );
    }

    return (
        <section className="section section-warm">
            <div className="container text-center">
                {/* Ornamental Divider */}
                <div className="divider-ornament mb-12">
                    <span className="text-[var(--color-accent)] text-2xl">✦</span>
                </div>

                <h2 className="text-h2 mb-4">A quiet note for your month.</h2>
                <p className="text-body-lg text-[var(--color-ink-muted)] max-w-xl mx-auto mb-8">
                    Twice each month I send a short reflection for moms who want wisdom,
                    honesty, and encouragement rooted in Scripture.
                </p>
                <NewsletterForm variant="compact" className="max-w-md mx-auto" />
            </div>
        </section>
    );
}
