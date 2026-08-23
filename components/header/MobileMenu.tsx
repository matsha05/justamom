"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type RefObject } from "react";
import { CaretDown } from "@/components/CaretDown";
import { siteConfig, writingSubnavLinks } from "@/lib/config";
import {
  isNavLinkActive,
  isWritingSectionActive,
} from "@/components/header/nav-utils";

interface MobileMenuProps {
  isOpen: boolean;
  pathname: string | null;
  onClose: () => void;
  onNavigate: () => void;
  menuRef: RefObject<HTMLDialogElement | null>;
}

export function MobileMenu({
  isOpen,
  pathname,
  onClose,
  onNavigate,
  menuRef,
}: MobileMenuProps) {
  const [writingOpen, setWritingOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = menuRef.current;
    if (!dialog || dialog.open) return;

    dialog.showModal();
    closeButtonRef.current?.focus();

    return () => {
      if (dialog.open) dialog.close();
    };
  }, [menuRef]);

  if (!isOpen) return null;

  return (
    <dialog
      ref={menuRef}
      className="fixed inset-0 z-40 m-0 h-[100dvh] max-h-none w-screen max-w-none overflow-hidden border-0 bg-[var(--color-paper)]/98 p-0 text-[var(--color-ink)] backdrop:bg-transparent backdrop-blur-sm transition-all duration-300 md:hidden animate-fade-in"
      aria-modal="true"
      aria-labelledby="mobile-menu-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        aria-label="Close menu"
        className="absolute inset-0 cursor-default bg-transparent"
        onClick={onClose}
      />
      <button
        type="button"
        ref={closeButtonRef}
        className="mobile-menu-close fixed right-[max(1.25rem,env(safe-area-inset-right))] top-[max(1.15rem,env(safe-area-inset-top))] z-20 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-paper)] p-2 text-[var(--color-ink)] shadow-sm transition-[background-color,transform] hover:bg-[var(--color-paper-soft)] active:scale-95"
        aria-label="Close menu"
        onClick={onClose}
      >
        <svg
          aria-hidden="true"
          className="size-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <nav
        id="mobile-menu"
        aria-label="Primary"
        className="mobile-menu-panel relative z-10 flex h-full w-full flex-col items-center justify-center gap-8 overflow-y-auto overscroll-contain px-6 py-24"
      >
        <h2 id="mobile-menu-title" className="sr-only">
          Menu
        </h2>
        {siteConfig.navLinks.map((link, index) => {
          const isActive = isNavLinkActive(pathname, link.href);
          const isWritingActive =
            link.href === "/notes" && isWritingSectionActive(pathname);

          if (link.href === "/notes") {
            return (
              <div
                key={link.href}
                className="mobile-notes-group"
                style={{ animationDelay: `${120 + index * 65}ms` }}
              >
                <div className="mobile-notes-trigger">
                  <Link
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className="nav-mobile-link"
                    data-section-active={isWritingActive ? "true" : undefined}
                    onClick={onNavigate}
                  >
                    {link.label}
                  </Link>
                  <button
                    type="button"
                    className="mobile-notes-toggle"
                    aria-label={`${writingOpen ? "Hide" : "Show"} Writing sections`}
                    aria-expanded={writingOpen}
                    aria-controls="mobile-writing-subnav"
                    onClick={() => setWritingOpen((open) => !open)}
                  >
                    <CaretDown className="mobile-notes-caret" />
                  </button>
                </div>

                {writingOpen ? (
                  <ul id="mobile-writing-subnav" className="mobile-notes-subnav" aria-label="Writing sections">
                    {writingSubnavLinks.map((subnavLink) => (
                      <li key={subnavLink.href}>
                        <Link
                          href={subnavLink.href}
                          className="mobile-notes-subnav-link"
                          aria-current={
                            isNavLinkActive(pathname, subnavLink.href)
                              ? "page"
                              : undefined
                          }
                          onClick={onNavigate}
                        >
                          {subnavLink.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className="nav-mobile-link"
              style={{ animationDelay: `${120 + index * 65}ms` }}
              onClick={onNavigate}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </dialog>
  );
}
