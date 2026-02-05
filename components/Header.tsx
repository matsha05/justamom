"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

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
      if (wasOpenRef.current) {
        menuButtonRef.current?.focus();
      }
      wasOpenRef.current = false;
      return;
    }

    wasOpenRef.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables =
      mobileMenuRef.current?.querySelectorAll<HTMLElement>("a, button");
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

  const isActivePath = (href: string) =>
    href === "/notes" ? pathname?.startsWith("/notes") : pathname === href;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--color-paper)]/96 border-b border-[var(--color-border)] py-3 backdrop-blur-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex flex-col">
            <span className="text-h3 leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
              {siteConfig.site.name}
            </span>
            <span className="text-caption tracking-wide text-[var(--color-ink-muted)]">
              {siteConfig.site.tagline}
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {siteConfig.navLinks.map((link) => {
              const isActive = isActivePath(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative py-1 text-[11px] uppercase tracking-[0.18em] transition-colors after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-[var(--color-ink)] after:transition-all after:duration-200 ${
                    isActive
                      ? "text-[var(--color-ink)] after:w-full"
                      : "text-[var(--color-ink-muted)] after:w-0 hover:text-[var(--color-ink)] hover:after:w-full"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            ref={menuButtonRef}
            className="relative z-50 rounded-full p-2 text-[var(--color-ink)] transition-colors hover:bg-[var(--color-paper-soft)] md:hidden"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
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
                className="h-6 w-6"
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

        {mobileMenuOpen ? (
          <div
            className="fixed inset-0 z-40 flex min-h-screen items-center justify-center bg-[var(--color-paper)]/98 backdrop-blur-sm transition-all duration-300 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <nav
              ref={mobileMenuRef}
              id="mobile-menu"
              className="flex flex-col items-center gap-8 p-6"
              onClick={(event) => event.stopPropagation()}
            >
              {siteConfig.navLinks.map((link) => {
                const isActive = isActivePath(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`text-h3 uppercase tracking-[0.2em] transition-colors ${
                      isActive
                        ? "text-[var(--color-ink)]"
                        : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
