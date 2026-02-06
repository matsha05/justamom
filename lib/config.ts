const defaultSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lizishaw.com";
const defaultNewsletterShareUrl =
  process.env.NEXT_PUBLIC_NEWSLETTER_URL ??
  "https://preview.mailerlite.io/forms/1931972/171530137383208676/share";
const defaultFormspreeEndpoint =
  process.env.FORMSPREE_ENDPOINT ?? "https://formspree.io/f/mqezoggn";
const defaultTwitterHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE ?? "@lizishaw";

export const siteConfig = {
  site: {
    name: "Lizi Shaw",
    tagline: "Speaker · Writer · Encourager",
    url: defaultSiteUrl,
    locale: "en_US",
  },
  author: {
    name: "Lizi Shaw",
    jobTitle: "Christian Speaker & Writer",
    description:
      "Christian writer and speaker helping moms live from identity received in Christ, not performance.",
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
    imagePath: "/images/aboutmepic.avif",
  },
  content: {
    seoDescription:
      "A Note for Moms: quiet biblical encouragement for moms navigating the tension between 'just a mom' and 'do it all.'",
    openGraphDescription:
      "Short notes and biblical encouragement for moms who need a steadier place to stand.",
    twitterDescription: "Biblical encouragement for moms in the thick of everyday life.",
    keywords: [
      "a note for moms",
      "biblical motherhood",
      "christian mom speaker",
      "faith and motherhood",
      "mom encouragement",
      "biblical parenting",
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
    shareUrl: defaultNewsletterShareUrl,
    welcomeMessage: "Welcome! Check your inbox for a confirmation.",
    alreadySubscribedMessage:
      "You're already on the list! Check your inbox for past notes.",
  },
  social: {
    twitterHandle: defaultTwitterHandle,
  },
  theme: {
    color: "#fbf9f6",
  },
  integrations: {
    mailerLiteApiBaseUrl: "https://connect.mailerlite.com/api",
  },
  navLinks: [
    { href: "/notes", label: "Notes" },
    { href: "/work", label: "Work" },
    { href: "/about", label: "About" },
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
