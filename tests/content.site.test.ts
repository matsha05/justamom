import { describe, expect, it } from "vitest";
import { marketingContent } from "@/content/site";
import { analyticsEvents } from "@/lib/analytics/events";

describe("marketing content", () => {
  it("keeps homepage newsletter CTA wired to the analytics contract", () => {
    expect(marketingContent.home.hero.primaryCta.eventName).toBe(
      analyticsEvents.newsletterCtaClick
    );
  });

  it("keeps a stable source for the homepage newsletter form", () => {
    expect(marketingContent.newsletter.homePanel.source).toBe("home_panel");
  });

  it("defines distinct newsletter form sources for reusable panels", () => {
    const sources = [
      marketingContent.newsletter.homePanel.source,
      marketingContent.newsletter.aboutPanel.source,
      marketingContent.newsletter.workPanel.source,
      marketingContent.newsletter.speakingPanel.source,
      marketingContent.newsletter.notePanel.source,
    ];

    expect(new Set(sources).size).toBe(sources.length);
  });
});
