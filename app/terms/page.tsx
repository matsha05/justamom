import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms",
  description: "Terms for Lizi Shaw.",
  pathname: "/legal",
});

export default function TermsPage() {
  permanentRedirect("/legal");
}
