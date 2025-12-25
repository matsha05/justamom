import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { NewsletterForm } from "./NewsletterForm";

const footerLinks = [
    { href: "/", label: "Home" },
    ...siteConfig.navLinks,
];

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[var(--color-paper-warm)] border-t border-[var(--color-border)]">
            <div className="container py-12">
                {/* Main Footer Content */}
                <div className="grid md:grid-cols-3 gap-12 mb-12">
                    {/* Brand Column */}
                    <div>
                        <Link href="/" className="inline-block mb-4">
                            <span className="text-h3 text-[var(--color-ink)]">{siteConfig.site.name}</span>
                        </Link>
                        <p className="text-body text-[var(--color-ink-muted)] max-w-xs">
                            {siteConfig.site.description}
                        </p>
                    </div>

                    {/* Navigation Column */}
                    <div>
                        <h4 className="text-label mb-4">Navigate</h4>
                        <nav className="flex flex-col gap-3">
                            {footerLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-caption text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        <h4 className="text-label mb-4">Stay Connected</h4>
                        <p className="text-caption text-[var(--color-ink-muted)] mb-4">
                            A quiet note from one mom to another.
                        </p>
                        <NewsletterForm variant="compact" />
                    </div>
                </div>

                {/* Divider */}
                <div className="divider" />

                {/* Bottom Row */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-caption text-[var(--color-ink-muted)]">
                        © {currentYear} Lizi Shaw. All rights reserved.
                    </p>
                    <div className="text-caption text-[var(--color-ink-faint)]">
                        From Niwot, Colorado <span className="text-[var(--color-accent)]">♥</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
