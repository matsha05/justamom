import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { isNavLinkActive } from "@/components/header/nav-utils";

interface DesktopNavProps {
  pathname: string | null;
}

export function DesktopNav({ pathname }: DesktopNavProps) {
  return (
    <nav className="hidden md:flex items-center gap-8">
      {siteConfig.navLinks.map((link) => {
        const isActive = isNavLinkActive(pathname, link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`relative text-[11px] font-medium uppercase tracking-[0.14em] transition-colors py-1 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-[var(--color-ink)] after:transition-all after:duration-200 ${
              isActive
                ? "text-[var(--color-ink)] after:w-full"
                : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] after:w-0 hover:after:w-full"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
