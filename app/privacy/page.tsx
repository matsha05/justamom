import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for Lizi Shaw.",
  pathname: "/legal",
});

export default function PrivacyPage() {
  permanentRedirect("/legal");
}
