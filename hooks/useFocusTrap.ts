"use client";

import { useEffect, type RefObject } from "react";

interface UseFocusTrapOptions {
  containerRef: RefObject<HTMLElement | null>;
  active: boolean;
  onEscape?: () => void;
}

function getFocusableNodes(container: HTMLElement): HTMLElement[] {
  const nodes = container.querySelectorAll<HTMLElement>(
    "a, button, input, textarea, select, [tabindex]:not([tabindex='-1'])"
  );

  return Array.from(nodes).filter(
    (node) => !node.hasAttribute("disabled") && node.getAttribute("aria-hidden") !== "true"
  );
}

export function useFocusTrap({ containerRef, active, onEscape }: UseFocusTrapOptions) {
  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusables = getFocusableNodes(container);
    focusables[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onEscape?.();
        return;
      }

      if (event.key !== "Tab") return;

      const nodes = getFocusableNodes(container);
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, containerRef, onEscape]);
}
