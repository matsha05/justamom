import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";

const footerLinks = [
    { href: "/", label: "Home" },
    ...siteConfig.navLinks,
];

const legalLinks = [
    { href: "/legal", label: "Privacy & Terms" },
];

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-[var(--color-border)] bg-[var(--color-paper)]">
            <div className="container py-12">
                <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-5">
                        <nav className="flex flex-wrap gap-x-6 gap-y-2">
                            {footerLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-[var(--color-ink)] after:w-0 hover:after:w-full after:transition-all after:duration-200"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <p className="text-caption text-[var(--color-ink-faint)]">
                            © {currentYear} {siteConfig.author.name}. {siteConfig.author.location.city}, {siteConfig.author.location.region}.
                        </p>
                        <nav className="flex items-center gap-4">
                            {legalLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-caption text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex flex-col items-start gap-2 md:items-end">
                        <Image
                            src="/images/signature.png"
                            alt="Lizi Shaw signature"
                            width={76}
                            height={69}
                            className="opacity-85"
                        />
                        <span className="text-caption font-medium tracking-[0.06em] text-[var(--color-ink-faint)]">
                            A Note for Moms
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
