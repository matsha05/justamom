import Link from "next/link";
import type { RefObject } from "react";
import { siteConfig } from "@/lib/config";
import { isNavLinkActive } from "@/components/header/nav-utils";

interface MobileMenuProps {
  isOpen: boolean;
  pathname: string | null;
  onClose: () => void;
  menuRef: RefObject<HTMLDivElement | null>;
}

export function MobileMenu({ isOpen, pathname, onClose, menuRef }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-[var(--color-paper)]/98 backdrop-blur-sm transition-all duration-300 md:hidden flex items-center justify-center"
      style={{ top: "0", minHeight: "100vh" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-menu-title"
    >
      <nav
        ref={menuRef}
        id="mobile-menu"
        aria-label="Primary"
        className="flex flex-col items-center gap-8 p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="mobile-menu-title" className="sr-only">
          Menu
        </h2>
        {siteConfig.navLinks.map((link) => {
          const isActive = isNavLinkActive(pathname, link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className="nav-mobile-link"
              onClick={onClose}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
