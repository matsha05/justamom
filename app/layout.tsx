import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

// JSON-LD Structured Data for Author Profile
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lizi Shaw",
  url: "https://lizishaw.com",
  jobTitle: "Christian Speaker & Writer",
  description:
    "Christian writer and speaker passionate about helping women anchor their motherhood in God's truth.",
  sameAs: [],
  knowsAbout: [
    "Christian motherhood",
    "Biblical parenting",
    "Women's ministry",
    "Faith-based speaking",
  ],
};

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
