/**
 * ArrowIcon Component
 * Reusable arrow icon for buttons and links.
 * Eliminates duplicate inline SVG code across the codebase.
 */

interface ArrowIconProps {
    direction?: "right" | "left" | "up" | "down";
    className?: string;
}

export function ArrowIcon({
    direction = "right",
    className = "w-4 h-4",
}: ArrowIconProps) {
    const paths: Record<typeof direction, string> = {
        right: "M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3",
        left: "M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18",
        up: "M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18",
        down: "M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3",
    };

    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={paths[direction]}
            />
        </svg>
    );
}
