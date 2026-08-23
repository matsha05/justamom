export function isNavLinkActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isWritingSectionActive(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname.startsWith("/notes") || pathname.startsWith("/blog");
}
