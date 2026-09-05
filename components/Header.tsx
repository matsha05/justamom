"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";
import { DesktopNav } from "@/components/header/DesktopNav";
import { MobileMenu } from "@/components/header/MobileMenu";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollThreshold } from "@/hooks/useScrollThreshold";
import type { WritingSubnavLink } from "@/lib/config";

interface HeaderProps {
  writingLinks: readonly WritingSubnavLink[];
}

export function Header({ writingLinks }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrolled = useScrollThreshold(20);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDialogElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const restoreMenuFocusRef = useRef(true);

  const closeMobileMenu = useCallback((restoreFocus = true) => {
    restoreMenuFocusRef.current = restoreFocus;
    setMobileMenuOpen(false);
  }, []);

  const dismissMobileMenu = useCallback(() => closeMobileMenu(), [closeMobileMenu]);
  const finishMobileNavigation = useCallback(
    () => closeMobileMenu(false),
    [closeMobileMenu]
  );

  useBodyScrollLock(mobileMenuOpen);
  useFocusTrap({
    containerRef: mobileMenuRef,
    active: mobileMenuOpen,
    onEscape: dismissMobileMenu,
  });

  useEffect(() => {
    if (wasOpenRef.current && !mobileMenuOpen && restoreMenuFocusRef.current) {
      menuToggleRef.current?.focus();
    }
    wasOpenRef.current = mobileMenuOpen;
  }, [mobileMenuOpen]);

  useEffect(() => {
    const desktopViewport = window.matchMedia("(min-width: 48rem)");
    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) closeMobileMenu(false);
    };

    desktopViewport.addEventListener("change", handleViewportChange);
    return () => desktopViewport.removeEventListener("change", handleViewportChange);
  }, [closeMobileMenu]);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-transparent transition-[padding,background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "bg-[var(--color-paper)]/96 backdrop-blur-sm border-[var(--color-border)] py-[0.95rem]"
          : "bg-transparent backdrop-blur-0 py-[1.2rem]"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          <Link href="/" className="header-brand group flex flex-col">
            <span className="header-brand-name text-h3 font-normal tracking-[-0.01em] text-[var(--color-ink)] leading-tight">
              {siteConfig.site.name}
            </span>
            {siteConfig.site.tagline ? (
              <span className="header-brand-tagline text-caption font-medium text-[var(--color-ink-muted)] tracking-[0.08em]">
                {siteConfig.site.tagline}
              </span>
            ) : null}
          </Link>

          <DesktopNav pathname={pathname} writingLinks={writingLinks} />

          {!mobileMenuOpen ? (
            <button
              type="button"
              ref={menuToggleRef}
              className="md:hidden relative z-50 p-2 text-[var(--color-ink)] transition-[background-color,transform] hover:bg-[var(--color-paper-soft)] active:scale-95 rounded-full"
              onClick={() => {
                restoreMenuFocusRef.current = true;
                setMobileMenuOpen(true);
              }}
              aria-label="Open menu"
              aria-expanded="false"
              aria-controls="mobile-menu"
              aria-haspopup="dialog"
            >
              <svg
                aria-hidden="true"
                className="size-6"
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
            </button>
          ) : null}
        </div>

        {mobileMenuOpen ? (
          <MobileMenu
            isOpen
            pathname={pathname}
            writingLinks={writingLinks}
            onClose={dismissMobileMenu}
            onNavigate={finishMobileNavigation}
            menuRef={mobileMenuRef}
          />
        ) : null}
      </div>
    </header>
  );
}
