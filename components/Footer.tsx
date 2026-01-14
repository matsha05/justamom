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
        <footer className="bg-[var(--color-paper-warm)] border-t border-[var(--color-border)]">
            <div className="container py-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    {/* Left: Copyright + Navigation */}
                    <div className="flex flex-col gap-4">
                        <nav className="flex flex-wrap gap-x-6 gap-y-2">
                            {footerLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative text-caption text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] transition-colors after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-[var(--color-accent)] after:w-0 hover:after:w-full after:transition-all after:duration-200"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <p className="text-caption text-[var(--color-ink-muted)]">
                            © {currentYear} Lizi Shaw. All rights reserved.
                        </p>
                    </div>

                    {/* Right: Signature */}
                    <div className="flex flex-col items-start md:items-end gap-1">
                        <Image
                            src="/images/signature.png"
                            alt="Lizi"
                            width={60}
                            height={55}
                            className="opacity-80"
                        />
                        <div className="text-caption text-[var(--color-ink-faint)]">
                            From Niwot, Colorado <span className="text-[var(--color-accent)]">♥</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
