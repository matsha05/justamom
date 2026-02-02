import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";

const footerLinks = [
    { href: "/", label: "Home" },
    ...siteConfig.navLinks,
];

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[var(--color-paper)] border-t border-[var(--color-border)]">
            <div className="container py-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-4">
                        <nav className="flex flex-wrap gap-x-6 gap-y-2">
                            {footerLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-[var(--color-ink)] after:w-0 hover:after:w-full after:transition-all after:duration-200"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <p className="text-caption text-[var(--color-ink-faint)]">
                            © {currentYear} Lizi Shaw. Niwot, Colorado.
                        </p>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-2">
                        <Image
                            src="/images/signature.png"
                            alt="Lizi Shaw signature"
                            width={70}
                            height={64}
                            className="opacity-75"
                        />
                        <span className="text-caption text-[var(--color-ink-faint)]">
                            A Note for Moms
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
