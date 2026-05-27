import Link from "next/link";
import type { RefObject } from "react";
import { siteConfig } from "@/lib/config";
import { isNavLinkActive } from "@/components/header/nav-utils";

interface MobileMenuProps {
  isOpen: boolean;
  pathname: string | null;
  onClose: () => void;
  menuRef: RefObject<HTMLDialogElement | null>;
}

export function MobileMenu({ isOpen, pathname, onClose, menuRef }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <dialog
      ref={menuRef}
      open
      className="fixed inset-0 z-40 m-0 flex h-screen w-screen max-w-none items-center justify-center border-0 bg-[var(--color-paper)]/98 p-0 text-[var(--color-ink)] backdrop:bg-transparent backdrop-blur-sm transition-all duration-300 md:hidden animate-fade-in"
      aria-modal="true"
      aria-labelledby="mobile-menu-title"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        aria-label="Close menu"
        className="absolute inset-0 cursor-default bg-transparent"
        onClick={onClose}
      />
      <nav
        id="mobile-menu"
        aria-label="Primary"
        className="mobile-menu-panel relative z-10 flex flex-col items-center gap-8 p-6"
      >
        <h2 id="mobile-menu-title" className="sr-only">
          Menu
        </h2>
        {siteConfig.navLinks.map((link, index) => {
          const isActive = isNavLinkActive(pathname, link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className="nav-mobile-link"
              style={{ animationDelay: `${120 + index * 65}ms` }}
              onClick={onClose}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </dialog>
  );
}
