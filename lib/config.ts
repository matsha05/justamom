/**
 * Site Configuration
 * Centralized configuration for URLs, contact info, and site-wide settings.
 * This eliminates hardwired values scattered across components.
 */

export const siteConfig = {
    // Newsletter & Mailing List
    newsletterUrl:
        "https://preview.mailerlite.io/forms/1931972/171530137383208676/share",

    // Contact
    email: "hello@lizishaw.com",

    // Social Media (add as needed)
    social: {
        // instagram: "https://instagram.com/lizishaw",
        // facebook: "https://facebook.com/lizishaw",
    },

    // Site Metadata
    site: {
        name: "Lizi Shaw",
        tagline: "Speaker · Writer · Encourager",
        description:
            "Helping moms find clarity, courage and peace in a noisy world.",
        url: "https://lizishaw.com",
    },

    // Author Info
    author: {
        name: "Lizi Shaw",
        jobTitle: "Christian Speaker & Writer",
        location: "Niwot, Colorado",
    },

    // Navigation Links
    navLinks: [
        { href: "/notes", label: "Notes" },
        { href: "/work", label: "Work" },
        { href: "/about", label: "About" },
        { href: "/speaking", label: "Speaking" },
        { href: "/contact", label: "Contact" },
    ],
};

export type SiteConfig = typeof siteConfig;
