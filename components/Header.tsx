"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!mobileMenuOpen) {
            document.body.style.overflow = "";
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const focusables = mobileMenuRef.current?.querySelectorAll<HTMLElement>(
            "a, button"
        );
        focusables?.[0]?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setMobileMenuOpen(false);
                return;
            }

            if (event.key !== "Tab" || !mobileMenuRef.current) {
                return;
            }

            const nodes = Array.from(
                mobileMenuRef.current.querySelectorAll<HTMLElement>("a, button")
            );
            if (nodes.length === 0) return;
            const first = nodes[0];
            const last = nodes[nodes.length - 1];
            const active = document.activeElement;

            if (event.shiftKey && active === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [mobileMenuOpen]);

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-[var(--color-paper)]/96 backdrop-blur-sm border-b border-[var(--color-border)] py-3"
                : "bg-transparent py-5"
                }`}
        >
            <div className="container">
                <div className="flex items-center justify-between">
                    {/* Wordmark */}
                    <Link href="/" className="group flex flex-col">
                        <span className="text-h3 text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors leading-tight">
                            Lizi Shaw
                        </span>
                        <span className="text-caption text-[var(--color-ink-muted)] tracking-wide">
                            Speaker · Writer · Encourager
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {siteConfig.navLinks.map((link) => {
                            const isNotes = link.href === "/notes";
                            const isActive = isNotes
                                ? pathname?.startsWith("/notes")
                                : pathname === link.href;

                            return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative text-[11px] uppercase tracking-[0.18em] transition-colors py-1 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-[var(--color-ink)] after:transition-all after:duration-200 ${isActive
                                    ? "text-[var(--color-ink)] after:w-full"
                                    : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] after:w-0 hover:after:w-full"
                                    }`}
                            >
                                {link.label}
                            </Link>
                            );
                        })}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden relative z-50 p-2 text-[var(--color-ink)] transition-colors hover:bg-[var(--color-paper-dark)]/10 rounded-full"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-menu"
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
                    role="dialog"
                    aria-modal="true"
                    aria-hidden={!mobileMenuOpen}
                    aria-label="Mobile navigation"
                >
                    <nav
                        ref={mobileMenuRef}
                        id="mobile-menu"
                        className="flex flex-col items-center gap-8 p-6"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {siteConfig.navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-h3 uppercase tracking-[0.2em] transition-colors ${(link.href === "/notes"
                                    ? pathname?.startsWith("/notes")
                                    : pathname === link.href)
                                    ? "text-[var(--color-ink)]"
                                    : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
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
