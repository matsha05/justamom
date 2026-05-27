import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for Lizi Shaw.",
};

export default function TermsPage() {
  permanentRedirect("/legal");
}
