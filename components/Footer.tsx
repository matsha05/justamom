import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";

const footerLinks = [...siteConfig.navLinks];
const legalLink = { href: "/legal", label: "Privacy & Terms" };

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-[var(--color-border)] bg-[var(--color-paper)]">
            <div className="container py-8 md:py-11">
                <div className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-end">
                    <div className="space-y-2.5">
                        <Image
                            src="/images/signature.png"
                            alt="Lizi Shaw signature"
                            width={84}
                            height={76}
                            className="w-[84px] h-[76px] opacity-90"
                            sizes="84px"
                        />
                        <p className="text-[0.95rem] leading-relaxed tracking-[0.01em] text-[var(--color-ink-muted)]">
                            © {currentYear} {siteConfig.author.name}. {siteConfig.author.location.city}, {siteConfig.author.location.region}.
                        </p>
                    </div>
                    <div>
                        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-end">
                            {footerLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="nav-utility-link"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <span className="hidden text-[var(--color-ink-faint)] sm:inline" aria-hidden="true">
                                /
                            </span>
                            <Link href={legalLink.href} className="nav-utility-link">
                                {legalLink.label}
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
        </footer>
    );
}
