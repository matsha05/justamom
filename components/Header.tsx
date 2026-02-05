"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";
import { DesktopNav } from "@/components/header/DesktopNav";
import { MobileMenu } from "@/components/header/MobileMenu";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollThreshold } from "@/hooks/useScrollThreshold";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrolled = useScrollThreshold(20);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock(mobileMenuOpen);
  useFocusTrap({
    containerRef: mobileMenuRef,
    active: mobileMenuOpen,
    onEscape: () => setMobileMenuOpen(false),
  });

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--color-paper)]/96 backdrop-blur-sm border-b border-[var(--color-border)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex flex-col">
            <span className="text-h3 text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors leading-tight">
              {siteConfig.site.name}
            </span>
            <span className="text-caption text-[var(--color-ink-muted)] tracking-wide">
              {siteConfig.site.tagline}
            </span>
          </Link>

          <DesktopNav pathname={pathname} />

          <button
            className="md:hidden relative z-50 p-2 text-[var(--color-ink)] transition-colors hover:bg-[var(--color-paper-soft)] rounded-full"
            onClick={() => setMobileMenuOpen((open) => !open)}
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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

        <MobileMenu
          isOpen={mobileMenuOpen}
          pathname={pathname}
          onClose={() => setMobileMenuOpen(false)}
          menuRef={mobileMenuRef}
        />
      </div>
    </header>
  );
}
