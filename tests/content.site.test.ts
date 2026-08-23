import { describe, expect, it } from "vitest";
import { marketingContent } from "@/content/site";
import { conversionSourceValues, conversionSources } from "@/lib/conversions";

describe("marketing content", () => {
  it("keeps the homepage reading-first", () => {
    expect(marketingContent.home.hero.primaryCta).toMatchObject({
      href: "/notes",
      label: "Read recent posts",
    });
    expect(marketingContent.home.hero.secondaryCta).toMatchObject({
      href: "/about",
      label: "More about me",
    });
  });

  it("keeps a stable source for the homepage newsletter form", () => {
    expect(marketingContent.newsletter.homePanel.source).toBe(
      conversionSources.homePanel
    );
  });

  it("defines distinct newsletter form sources for reusable panels", () => {
    const sources = [
      marketingContent.newsletter.homePanel.source,
      marketingContent.newsletter.aboutPanel.source,
      marketingContent.newsletter.workPanel.source,
      marketingContent.newsletter.speakingPanel.source,
      marketingContent.newsletter.notePanel.source,
      marketingContent.newsletter.notesArchivePanel.source,
    ];

    expect(new Set(sources).size).toBe(sources.length);
    expect(sources.every((source) => conversionSourceValues.includes(source))).toBe(true);
  });

  it("describes A Note for Moms as a monthly email", () => {
    const newsletterCopy = JSON.stringify(marketingContent.newsletter);

    expect(newsletterCopy).toMatch(/once a month/i);
    expect(newsletterCopy).not.toMatch(/twice a month|two notes a month/i);
  });

  it("uses Lizi's authored About copy", () => {
    expect(marketingContent.about.hero.heading).toBe("Hi, I’m Lizi Shaw");
    expect(marketingContent.about.hero.paragraphs[0]).toMatch(
      /hot cup of coffee \(black of course\)/
    );
    expect(marketingContent.about.facts.items).toHaveLength(3);
  });

  it("keeps the speaking invitation simple", () => {
    expect(marketingContent.home.speaking.cta.label).toBe("Learn about speaking");
    expect(marketingContent.speaking).not.toHaveProperty("topics");
    expect(marketingContent.speaking.bio.eyebrow).toBe("For event hosts");
  });
});
