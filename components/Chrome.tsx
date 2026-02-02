"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function Chrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "";
  const isPreview = pathname.startsWith("/preview");

  if (isPreview) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
