import type { Metadata } from "next";
import {
  Fraunces,
  Literata,
  Manrope,
  Newsreader,
  Plus_Jakarta_Sans,
  Source_Sans_3,
} from "next/font/google";
import { TypographyPreview } from "@/components/preview/TypographyPreview";

const fraunces = Fraunces({
  variable: "--font-preview-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const literata = Literata({
  variable: "--font-preview-literata",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-preview-manrope",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-preview-newsreader",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-preview-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-preview-source-sans-3",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Typography Preview",
  description:
    "Three high-craft typography systems for the Just a Mom project, with real copy and responsive hierarchy.",
};

export default function PreviewPage() {
  return (
    <div
      className={[
        fraunces.variable,
        literata.variable,
        manrope.variable,
        newsreader.variable,
        plusJakartaSans.variable,
        sourceSans3.variable,
      ].join(" ")}
    >
      <TypographyPreview />
    </div>
  );
}
