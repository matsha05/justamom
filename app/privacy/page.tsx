import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Lizi Shaw.",
};

export default function PrivacyPage() {
  permanentRedirect("/legal");
}
