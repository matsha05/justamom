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
      aria-label="Mobile navigation"
    >
      <nav
        ref={menuRef}
        id="mobile-menu"
        className="flex flex-col items-center gap-8 p-6"
        onClick={(event) => event.stopPropagation()}
      >
        {siteConfig.navLinks.map((link) => {
          const isActive = isNavLinkActive(pathname, link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-h3 uppercase tracking-[0.2em] transition-colors ${
                isActive
                  ? "text-[var(--color-ink)]"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              }`}
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
