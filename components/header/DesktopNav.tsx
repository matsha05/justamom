import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { isNavLinkActive } from "@/components/header/nav-utils";

interface DesktopNavProps {
  pathname: string | null;
}

export function DesktopNav({ pathname }: DesktopNavProps) {
  return (
    <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
      {siteConfig.navLinks.map((link) => {
        const isActive = isNavLinkActive(pathname, link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className="nav-link"
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
