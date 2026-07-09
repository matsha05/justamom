import Link from "next/link";
import { siteConfig } from "@/lib/config";

const newsletterLink = { href: "/#newsletter", label: "Newsletter" };
const footerLinks = [
  ...siteConfig.navLinks.slice(0, 1),
  newsletterLink,
  ...siteConfig.navLinks.slice(1),
];
const legalLink = { href: "/legal", label: "Privacy & Terms" };

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer border-t border-[var(--color-border)] bg-[var(--color-paper)]">
      <div className="container site-footer-inner py-8 md:py-11">
        <div className="grid gap-7 md:grid-cols-[auto_minmax(0,1fr)] md:items-end">
          <div className="space-y-1.5">
            <p className="text-h4">{siteConfig.author.name}</p>
            <p className="text-[0.95rem] leading-relaxed tracking-[0.01em] text-[var(--color-ink-muted)]">
              © {currentYear} {siteConfig.author.name}. {siteConfig.author.location.city},{" "}
              {siteConfig.author.location.region}.
            </p>
          </div>
          <div className="space-y-3">
            <nav className="site-footer-nav flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-end">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-utility-link site-footer-link"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="md:flex md:justify-end">
              <Link href={legalLink.href} className="nav-utility-link site-footer-link">
                {legalLink.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
