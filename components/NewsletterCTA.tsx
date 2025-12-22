import Link from "next/link";

interface NewsletterCTAProps {
    variant?: "default" | "compact";
    title?: string;
    description?: string;
}

export function NewsletterCTA({
    variant = "default",
    title = "A quiet note for your month.",
    description = "Twice each month I send a short reflection for moms who want wisdom, honesty, and encouragement rooted in Scripture.",
}: NewsletterCTAProps) {
    const mailerliteUrl =
        "https://preview.mailerlite.io/forms/1931972/171530137383208676/share";

    if (variant === "compact") {
        return (
            <div className="text-center py-8">
                <h4 className="text-heading text-lg mb-2">{title}</h4>
                <p className="text-[var(--color-gray-medium)] text-sm mb-4 max-w-md mx-auto">
                    {description}
                </p>
                <Link href={mailerliteUrl} className="btn-primary" target="_blank" rel="noopener noreferrer">
                    Get the Notes
                </Link>
            </div>
        );
    }

    return (
        <section className="bg-gradient-section py-16">
            <div className="container-main text-center">
                <h2 className="text-heading text-2xl md:text-3xl mb-4">{title}</h2>
                <p className="text-[var(--color-gray-medium)] max-w-xl mx-auto mb-8">
                    {description}
                </p>
                <Link href={mailerliteUrl} className="btn-primary" target="_blank" rel="noopener noreferrer">
                    Get the Notes
                </Link>
            </div>
        </section>
    );
}
