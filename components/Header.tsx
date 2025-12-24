"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const navLinks = [
    { href: "/about", label: "About" },
    { href: "/notes", label: "Notes" },
    { href: "/speaking", label: "Speaking" },
    { href: "/contact", label: "Contact" },
];

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

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
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-caption font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="https://preview.mailerlite.io/forms/1931972/171530137383208676/share"
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
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-[var(--color-ink)]"
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
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <nav className="py-6 border-t border-[var(--color-border)] mt-4">
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-body font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-accent)] transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href="https://preview.mailerlite.io/forms/1931972/171530137383208676/share"
                                className="btn btn-primary mt-2 text-center justify-center"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setMobileMenuOpen(false)}
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
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}
