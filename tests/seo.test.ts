import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { metadata as labMetadata } from "@/app/lab/layout";

describe("SEO guardrails", () => {
  it("disallows lab routes in robots.txt", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;

    expect(rules?.disallow).toBe("/lab/");
  });

  it("marks lab routes as noindex", () => {
    expect(labMetadata.robots).toMatchObject({
      index: false,
      follow: false,
    });
  });
});
