"use client";

import type { CSSProperties, ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  Newsreader,
  Source_Sans_3,
  Spectral,
  Literata,
  IBM_Plex_Sans,
} from "next/font/google";
import { cn } from "@/lib/utils";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-newsreader",
  display: "swap",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-spectral",
  display: "swap",
});

const literata = Literata({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-literata",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-source-sans",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const fontOptions = [
  {
    id: "newsreader",
    label: "A",
    name: "Newsreader",
    headingVar: "--font-newsreader",
    bodyName: "Source Sans 3",
    bodyVar: "--font-source-sans",
  },
  {
    id: "spectral",
    label: "B",
    name: "Spectral",
    headingVar: "--font-spectral",
    bodyName: "Inter",
    bodyVar: "--font-inter",
  },
  {
    id: "literata",
    label: "C",
    name: "Literata",
    headingVar: "--font-literata",
    bodyName: "IBM Plex Sans",
    bodyVar: "--font-plex-sans",
  },
] as const;

type FontId = (typeof fontOptions)[number]["id"];

export function PreviewShell({ children }: { children: ReactNode }) {
  const [fontId, setFontId] = useState<FontId>("newsreader");

  const activeFont = useMemo(() => {
    return (
      fontOptions.find((option) => option.id === fontId) ?? fontOptions[1]
    );
  }, [fontId]);

  const style = {
    "--color-ink": "#1d1b19",
    "--color-ink-soft": "#4a433c",
    "--color-ink-muted": "#7a7269",
    "--color-ink-faint": "#b1a79d",
    "--color-paper": "#fbf9f6",
    "--color-paper-warm": "#f6f2ed",
    "--color-paper-soft": "#f0ebe5",
    "--color-accent": "#3f6c67",
    "--color-accent-hover": "#355a56",
    "--color-accent-soft": "#e4efed",
    "--color-accent-light": "#6e918c",
    "--color-border": "#e6dfd6",
    "--color-border-strong": "#d3cac0",
    "--font-lora": `var(${activeFont.headingVar})`,
    "--font-body": `var(${activeFont.bodyVar})`,
    "--section-padding": "clamp(4.75rem, 10vw, 9.5rem)",
    "--container-prose": "640px",
    "--container-max": "1060px",
    "--text-display": "clamp(2.75rem, 5vw, 4.1rem)",
    "--text-h2": "clamp(1.65rem, 2.9vw, 2.15rem)",
    "--text-body": "1.03rem",
    "--text-body-lg": "clamp(1.12rem, 1.35vw, 1.22rem)",
    fontFamily: "var(--font-body)",
  } as CSSProperties;

  return (
    <div
      className={cn(
        newsreader.variable,
        spectral.variable,
        literata.variable,
        sourceSans.variable,
        plexSans.variable
      )}
      style={style}
    >
      <style jsx global>{`
        .preview-editorial .text-body,
        .preview-editorial .text-body-lg {
          line-height: 1.82;
        }

        .preview-editorial .text-display {
          letter-spacing: -0.018em;
        }

        .preview-editorial .text-label {
          letter-spacing: 0.18em;
        }

        .preview-editorial .text-caption {
          line-height: 1.65;
        }

        .preview-editorial .link-arrow {
          color: var(--color-ink-muted);
          text-transform: uppercase;
          letter-spacing: 0.24em;
          font-size: 0.68rem;
          font-weight: 500;
        }

        .preview-editorial .link-arrow:hover {
          color: var(--color-ink);
        }

        .preview-editorial .preview-rule {
          height: 1px;
          width: 100%;
          background: var(--color-border);
        }

        @media (max-width: 640px) {
          .preview-editorial .section {
            padding-top: 4rem;
            padding-bottom: 4rem;
          }

          .preview-editorial .link-arrow {
            letter-spacing: 0.2em;
          }
        }
      `}</style>
      {children}

      <div className="fixed top-6 right-6 z-50 hidden md:flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-white/90 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink-muted)] shadow-sm backdrop-blur">
        <span className="text-[10px]">Typeface</span>
        <div className="flex items-center gap-2">
          {fontOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setFontId(option.id)}
              aria-label={`Typeface ${option.label}: ${option.name}`}
              className={cn(
                "rounded-full px-3 py-1 text-[10px] tracking-[0.15em] transition-colors",
                fontId === option.id
                  ? "bg-[var(--color-ink)] text-white"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <span className="hidden lg:inline text-[10px] tracking-[0.12em] text-[var(--color-ink-faint)]">
          {activeFont.name} + {activeFont.bodyName}
        </span>
      </div>
    </div>
  );
}
