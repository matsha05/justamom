import Link from "next/link";

interface NewsletterCTAProps {
    variant?: "default" | "compact";
}

export function NewsletterCTA({ variant = "default" }: NewsletterCTAProps) {
    const mailerliteUrl =
        "https://preview.mailerlite.io/forms/1931972/171530137383208676/share";

    if (variant === "compact") {
        return (
            <div className="text-center py-12">
                <h4 className="text-h4 mb-3">A quiet note for your month.</h4>
                <p className="text-body text-[var(--color-ink-muted)] mb-6 max-w-md mx-auto">
                    Twice each month I send a short reflection for moms who want wisdom,
                    honesty, and encouragement rooted in Scripture.
                </p>
                <Link
                    href={mailerliteUrl}
                    className="btn btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Get the Notes
                </Link>
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
                <Link
                    href={mailerliteUrl}
                    className="btn btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Get the Notes
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                    </svg>
                </Link>

                {/* Ornamental Divider */}
                <div className="divider-ornament mt-12">
                    <span className="text-[var(--color-accent)] text-2xl">✦</span>
                </div>
            </div>
        </section>
    );
}
