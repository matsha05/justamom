import { describe, expect, it } from "vitest";
import {
  getServerEnvValidationErrors,
  shouldValidateServerEnv,
} from "@/lib/env";

describe("server env validation", () => {
  it("skips strict validation outside production", () => {
    expect(shouldValidateServerEnv({ NODE_ENV: "development" })).toBe(false);
    expect(shouldValidateServerEnv({ NODE_ENV: "test" })).toBe(false);
  });

  it("validates required production env variables", () => {
    const errors = getServerEnvValidationErrors({
      NODE_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "https://lizishaw.com",
      FORMSPREE_ENDPOINT: "",
      MAILER_LITE_API_KEY: "",
      MAILERLITE_GROUP_ID: "",
    });

    expect(errors).toContain("FORMSPREE_ENDPOINT must be a valid URL.");
    expect(errors).toContain("MAILER_LITE_API_KEY is required.");
    expect(errors).toContain("MAILERLITE_GROUP_ID is required.");
  });

  it("accepts a complete production env set", () => {
    const errors = getServerEnvValidationErrors({
      NODE_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "https://lizishaw.com",
      FORMSPREE_ENDPOINT: "https://formspree.io/f/example",
      MAILER_LITE_API_KEY: "key",
      MAILERLITE_GROUP_ID: "group",
    });

    expect(errors).toEqual([]);
  });
});
