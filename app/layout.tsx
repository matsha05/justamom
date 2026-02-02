import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { Chrome } from "@/components/Chrome";
import "./globals.css";

// JSON-LD Structured Data for Author Profile
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lizi Shaw",
  url: "https://lizishaw.com",
  image: "https://lizishaw.com/images/aboutmepic.avif",
  jobTitle: "Christian Speaker & Writer",
  description:
    "Christian writer and speaker passionate about helping women anchor their motherhood in God's truth.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Niwot",
    addressRegion: "Colorado",
    addressCountry: "US",
  },
  knowsAbout: [
    "Christian motherhood",
    "Biblical parenting",
    "Women's ministry",
    "Faith-based speaking",
    "Mom encouragement",
    "Finding God in everyday life",
  ],
};

const newsreader = Newsreader({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lizi Shaw | Speaker, Writer, Encourager",
    template: "%s | Lizi Shaw",
  },
  description:
    "Helping moms find clarity, courage and peace in a noisy world. Real stories. Biblical truth. A lighthearted look at the everyday moments that shape our lives.",
  keywords: [
    "biblical motherhood",
    "christian mom speaker",
    "faith and motherhood",
    "mom encouragement",
    "women's ministry speaker",
    "biblical parenting",
  ],
  authors: [{ name: "Lizi Shaw" }],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg", // SVG works for now, or use PNG if generated
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://lizishaw.com"),
  openGraph: {
    title: "Lizi Shaw | Speaker, Writer, Encourager",
    description: "Stories and encouragement for everyday women. Helping moms find clarity, courage and peace in a noisy world.",
    url: "https://lizishaw.com",
    siteName: "Lizi Shaw",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lizi Shaw | Speaker, Writer, Encourager",
    description: "Stories and encouragement for everyday women.",
    creator: "@lizishaw", // Placeholder if she has one
  },
  other: {
    "theme-color": "#1f2937",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${newsreader.variable} ${sourceSans.variable}`}>
        <Chrome>{children}</Chrome>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
