export const conversionSources = {
  site: "site",
  homeHero: "home_hero",
  homePanel: "home_panel",
  aboutPanel: "about_panel",
  workPanel: "work_panel",
  speakingPanel: "speaking_panel",
  notePanel: "note_panel",
  contactPage: "contact_page",
  speakingPage: "speaking_page",
  aboutInvitation: "about_invitation",
  homeSpeakingSection: "home_speaking_section",
} as const;

export const conversionSourceValues = Object.values(conversionSources) as [
  ConversionSource,
  ...ConversionSource[],
];

export type ConversionSource =
  (typeof conversionSources)[keyof typeof conversionSources];

export const newsletterVariantValues = ["default", "compact", "hero"] as const;

export type NewsletterVariant = (typeof newsletterVariantValues)[number];

export const conversionMessages = {
  contactSuccess:
    "Message sent! I will get back to you as soon as I can.",
  speakingSuccess:
    "Inquiry received! I will follow up soon.",
  contactError: "Unable to send your message right now. Please try again.",
  networkError: "Network error. Please check your connection and try again.",
} as const;

export function getCurrentPagePath(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return `${window.location.pathname}${window.location.search}`;
}
