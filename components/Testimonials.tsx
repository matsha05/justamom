import { ScrollReveal } from "./ScrollReveal";

interface Testimonial {
    quote: string;
    author: string;
    role: string;
}

// Placeholder testimonials - replace with real ones when available
const testimonials: Testimonial[] = [
    {
        quote: "Lizi's message was exactly what our group needed. She speaks with such warmth and authenticity.",
        author: "Sarah M.",
        role: "MomCo Coordinator",
    },
    {
        quote: "I left feeling encouraged and equipped. Her teaching is rooted in Scripture but so practical for everyday life.",
        author: "Jennifer K.",
        role: "Women's Ministry Director",
    },
    {
        quote: "Lizi has a gift for making you feel like you're sitting across the table from a friend.",
        author: "Rachel T.",
        role: "Bible Study Leader",
    },
];

export function Testimonials() {
    return (
        <section className="section">
            <div className="container">
                <ScrollReveal>
                    <div className="text-center mb-12">
                        <p className="text-label mb-4">Kind Words</p>
                        <h2 className="text-h2">What Others Are Saying</h2>
                    </div>
                </ScrollReveal>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <ScrollReveal key={index} delay={index * 100}>
                            <div className="bg-white p-8 rounded-lg border border-[var(--color-border)] shadow-sm h-full flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                                {/* Quote */}
                                <blockquote className="text-body text-[var(--color-ink-soft)] italic leading-relaxed flex-1 mb-6">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </blockquote>

                                {/* Author */}
                                <div className="pt-4 border-t border-[var(--color-border)]">
                                    <p className="font-medium text-[var(--color-ink)]">
                                        {testimonial.author}
                                    </p>
                                    <p className="text-caption text-[var(--color-ink-muted)]">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
