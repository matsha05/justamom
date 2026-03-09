export type AnalyticsEventValue = string | number | boolean;
export type AnalyticsEventProperties = Record<string, AnalyticsEventValue>;

export const analyticsEvents = {
  newsletterCtaClick: "newsletter_cta_click",
  newsletterSignupStart: "newsletter_signup_start",
  newsletterSignupSuccess: "newsletter_signup_success",
  noteRead: "note_read",
  speakingCtaClick: "speaking_cta_click",
  speakingInquiryStart: "speaking_inquiry_start",
  speakingInquirySuccess: "speaking_inquiry_success",
} as const;

export type AnalyticsEventName =
  (typeof analyticsEvents)[keyof typeof analyticsEvents];
