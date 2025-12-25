"use client";

import { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number; // in ms
    direction?: "up" | "down" | "left" | "right" | "none";
    duration?: number; // in ms
}

export function ScrollReveal({
    children,
    className,
    delay = 0,
    direction = "up",
    duration = 600,
}: ScrollRevealProps) {
    const [ref, isVisible] = useScrollReveal<HTMLDivElement>();

    const directionStyles = {
        up: "translate-y-8",
        down: "-translate-y-8",
        left: "translate-x-8",
        right: "-translate-x-8",
        none: "",
    };

    return (
        <div
            ref={ref}
            className={cn(
                "transition-all ease-out",
                isVisible
                    ? "opacity-100 translate-x-0 translate-y-0"
                    : `opacity-0 ${directionStyles[direction]}`,
                className
            )}
            style={{
                transitionDuration: `${duration}ms`,
                transitionDelay: `${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}
