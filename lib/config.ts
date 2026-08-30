const defaultSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lizishaw.com";
const defaultFormspreeEndpoint =
  process.env.FORMSPREE_ENDPOINT ?? "https://formspree.io/f/mqezoggn";
const defaultTwitterHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE ?? "@lizishaw";

export const writingSubnavLinks = [
  { href: "/notes", label: "Notes" },
  { href: "/blog", label: "Blog" },
] as const;

export type WritingSubnavLink = (typeof writingSubnavLinks)[number];

export function getVisibleWritingSubnavLinks(
  hasBlogPosts: boolean
): WritingSubnavLink[] {
  return writingSubnavLinks.filter(
    (link) => hasBlogPosts || link.href !== "/blog"
  );
}

export const siteConfig = {
  site: {
    name: "Lizi Shaw",
    tagline: "",
    url: defaultSiteUrl,
    locale: "en_US",
  },
  author: {
    name: "Lizi Shaw",
    jobTitle: "Christian Writer & Speaker",
    description:
      "Christian writer and speaker pointing women towards Jesus through honest writing about faith and ordinary life.",
    location: {
      city: "Niwot",
      region: "Colorado",
      country: "US",
    },
    knowsAbout: [
      "Christian motherhood",
      "Biblical parenting",
      "Women's ministry",
      "Faith-based speaking",
      "Mom encouragement",
      "Finding God in everyday life",
    ],
    imagePath: "/images/lizi-solo-portrait.avif",
  },
  content: {
    seoDescription:
      "Writing from Lizi Shaw about following Jesus through motherhood and ordinary life.",
    openGraphDescription:
      "Notes and other writing from Lizi Shaw about faith, motherhood, and ordinary life.",
    twitterDescription:
      "Notes and other writing from Lizi Shaw about faith and ordinary life.",
    keywords: [
      "a note for moms",
      "christian writing for women",
      "christian mom speaker",
      "faith and motherhood",
      "following Jesus",
      "everyday faith",
    ],
  },
  legal: {
    lastUpdated: "February 6, 2026",
  },
  contact: {
    email: "hello@lizishaw.com",
    formspreeEndpoint: defaultFormspreeEndpoint,
  },
  newsletter: {
    welcomeMessage: "Welcome! Check your inbox for a confirmation.",
    alreadySubscribedMessage:
      "You're already on the list! Check your inbox for past notes.",
  },
  social: {
    twitterHandle: defaultTwitterHandle,
  },
  theme: {
    color: "#f8f4ed",
  },
  integrations: {
    mailerLiteApiBaseUrl: "https://connect.mailerlite.com/api",
  },
  navLinks: [
    { href: "/about", label: "About Me" },
    { href: "/notes", label: "Writing" },
    { href: "/speaking", label: "Speaking" },
    { href: "/contact", label: "Contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

export function absoluteUrl(pathname = "/"): string {
  return new URL(pathname, siteConfig.site.url).toString();
}

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.author.name,
  url: siteConfig.site.url,
  image: absoluteUrl(siteConfig.author.imagePath),
  jobTitle: siteConfig.author.jobTitle,
  description: siteConfig.author.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: siteConfig.author.location.city,
    addressRegion: siteConfig.author.location.region,
    addressCountry: siteConfig.author.location.country,
  },
  knowsAbout: siteConfig.author.knowsAbout,
} as const;
