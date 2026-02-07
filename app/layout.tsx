import type { Metadata } from "next";
import { Literata, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { Chrome } from "@/components/Chrome";
import { personJsonLd, siteConfig } from "@/lib/config";
import "./globals.css";

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload: true,
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload: true,
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.site.name} | ${siteConfig.site.tagline}`,
    template: `%s | ${siteConfig.site.name}`,
  },
  description: siteConfig.content.seoDescription,
  keywords: [...siteConfig.content.keywords],
  authors: [{ name: siteConfig.author.name }],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL(siteConfig.site.url),
  openGraph: {
    title: `${siteConfig.site.name} | ${siteConfig.site.tagline}`,
    description: siteConfig.content.openGraphDescription,
    url: siteConfig.site.url,
    siteName: siteConfig.site.name,
    locale: siteConfig.site.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.site.name} | ${siteConfig.site.tagline}`,
    description: siteConfig.content.twitterDescription,
    creator: siteConfig.social.twitterHandle,
  },
  other: {
    "theme-color": siteConfig.theme.color,
    "mobile-web-app-capable": "yes",
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className={`${literata.variable} ${plusJakartaSans.variable}`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Chrome>{children}</Chrome>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
