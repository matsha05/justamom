"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-[var(--color-paper)]/95 backdrop-blur-md shadow-sm py-3"
                : "bg-transparent py-5"
                }`}
        >
            <div className="container">
                <div className="flex items-center justify-between">
                    {/* Logo with Peony Icon */}
                    <Link href="/" className="group flex items-center gap-4">
                        {/* Peony Icon - vibrant brand mark */}
                        <div className="w-14 h-14 rounded-full shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 overflow-hidden flex items-center justify-center bg-[#4a7c7c]">
                            <Image
                                src="/images/peony-logo-v4.png"
                                alt="Peony flower icon"
                                width={56}
                                height={56}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Text Lockup */}
                        <div className="flex flex-col">
                            <span className="text-h3 text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors leading-tight">
                                Lizi Shaw
                            </span>
                            <span className="text-caption text-[var(--color-ink-muted)] tracking-wide">
                                Speaker · Writer · Encourager
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-10">
                        {siteConfig.navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative text-caption font-medium transition-colors py-1 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:bg-[var(--color-accent)] after:transition-all after:duration-200 ${pathname === link.href
                                    ? "text-[var(--color-accent)] after:w-full"
                                    : "text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] after:w-0 hover:after:w-full"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden relative z-50 p-2 text-[var(--color-ink)] transition-colors hover:bg-[var(--color-paper-dark)]/10 rounded-full"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {/* Mobile Navigation Overlay */}
                <div
                    className={`fixed inset-0 z-40 bg-[var(--color-paper)]/98 backdrop-blur-sm transition-all duration-300 md:hidden flex items-center justify-center ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                        }`}
                    style={{ top: "0", minHeight: "100vh" }}
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <nav className="flex flex-col items-center gap-8 p-6">
                        {siteConfig.navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-h2 font-serif transition-colors ${pathname === link.href
                                    ? "text-[var(--color-accent)]"
                                    : "text-[var(--color-ink)] hover:text-[var(--color-accent)]"
                                    }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
}
