import type { Metadata } from "next";
import { Poppins, Dancing_Script } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["400", "700"],
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
    "Lizi Shaw",
    "Christian speaker",
    "mom encouragement",
    "biblical motherhood",
    "women's ministry",
  ],
  authors: [{ name: "Lizi Shaw" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lizishaw.com",
    siteName: "Lizi Shaw",
    title: "Lizi Shaw | Speaker, Writer, Encourager",
    description:
      "Helping moms find clarity, courage and peace in a noisy world.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lizi Shaw | Speaker, Writer, Encourager",
    description:
      "Helping moms find clarity, courage and peace in a noisy world.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${dancingScript.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
