"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CaretDown } from "@/components/CaretDown";
import { siteConfig, writingSubnavLinks } from "@/lib/config";
import {
  isNavLinkActive,
  isWritingSectionActive,
} from "@/components/header/nav-utils";

interface DesktopNavProps {
  pathname: string | null;
}

export function DesktopNav({ pathname }: DesktopNavProps) {
  const [writingOpen, setWritingOpen] = useState(false);
  const writingGroupRef = useRef<HTMLDivElement>(null);
  const writingToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!writingOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!writingGroupRef.current?.contains(event.target as Node)) {
        setWritingOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setWritingOpen(false);
        writingToggleRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [writingOpen]);

  return (
    <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
      {siteConfig.navLinks.map((link) => {
        const isActive = isNavLinkActive(pathname, link.href);
        const isWritingActive =
          link.href === "/notes" && isWritingSectionActive(pathname);

        if (link.href === "/notes") {
          return (
            <div
              key={link.href}
              ref={writingGroupRef}
              className="notes-nav-group"
              onMouseEnter={() => setWritingOpen(true)}
              onMouseLeave={() => {
                if (!writingGroupRef.current?.contains(document.activeElement)) {
                  setWritingOpen(false);
                }
              }}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setWritingOpen(false);
                }
              }}
            >
              <div className="notes-nav-trigger">
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className="nav-link"
                  data-section-active={isWritingActive ? "true" : undefined}
                  onClick={() => setWritingOpen(false)}
                >
                  {link.label}
                </Link>
                <button
                  type="button"
                  ref={writingToggleRef}
                  className="notes-nav-toggle"
                  aria-label={`${writingOpen ? "Hide" : "Show"} Writing sections`}
                  aria-expanded={writingOpen}
                  aria-controls="writing-subnav"
                  onClick={() => setWritingOpen((open) => !open)}
                >
                  <CaretDown className="notes-nav-caret" />
                </button>
              </div>

              {writingOpen ? (
                <div id="writing-subnav" className="notes-subnav-corridor">
                  <div className="notes-subnav-panel">
                    <ul aria-label="Writing sections">
                      {writingSubnavLinks.map((subnavLink) => (
                        <li key={subnavLink.href}>
                          <Link
                            href={subnavLink.href}
                            className="notes-subnav-link"
                            aria-current={
                              isNavLinkActive(pathname, subnavLink.href)
                                ? "page"
                                : undefined
                            }
                            onClick={() => setWritingOpen(false)}
                          >
                            {subnavLink.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
          );
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className="nav-link"
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
