export function isNavLinkActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return href === "/notes" ? pathname.startsWith("/notes") : pathname === href;
}
