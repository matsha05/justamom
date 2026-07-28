import { expect, test } from "@playwright/test";
import { conversionSources } from "@/lib/conversions";

test("homepage highlights the primary newsletter CTA", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "You are not just a mom." })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Join A Note for Moms" })
  ).toBeVisible();
});

test("newsletter signup shows success state", async ({ page }) => {
  let newsletterPayload: Record<string, unknown> | null = null;
  const idempotencyKeys: string[] = [];

  await page.route("**/api/newsletter", async (route) => {
    newsletterPayload = JSON.parse(route.request().postData() ?? "{}");
    idempotencyKeys.push(route.request().headers()["idempotency-key"] ?? "");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        message: "Welcome! Check your inbox for a confirmation.",
      }),
    });
  });

  await page.goto("/");
  const newsletterSection = page.locator("#newsletter");
  await page.getByRole("textbox", { name: "Email address" }).fill("mom@example.com");
  await newsletterSection.getByRole("button", { name: "Join the notes" }).click();

  await expect(
    newsletterSection.getByText("Welcome! Check your inbox for a confirmation.")
  ).toBeVisible();
  expect(newsletterPayload).toMatchObject({
    source: conversionSources.homePanel,
    variant: "compact",
    page_path: "/",
  });

  await page.getByRole("textbox", { name: "Email address" }).fill("again@example.com");
  await newsletterSection.getByRole("button", { name: "Join the notes" }).click();

  expect(idempotencyKeys).toHaveLength(2);
  expect(idempotencyKeys[0]).toBeTruthy();
  expect(idempotencyKeys[1]).not.toBe(idempotencyKeys[0]);
});

test("newsletter signup shows retry-after errors", async ({ page }) => {
  let attempt = 0;
  const idempotencyKeys: string[] = [];

  await page.route("**/api/newsletter", async (route) => {
    attempt += 1;
    idempotencyKeys.push(route.request().headers()["idempotency-key"] ?? "");
    await route.fulfill({
      status: attempt === 1 ? 429 : 200,
      headers:
        attempt === 1
          ? {
              "content-type": "application/json",
              "retry-after": "60",
            }
          : { "content-type": "application/json" },
      body:
        attempt === 1
          ? JSON.stringify({
              error: "Too many requests. Please wait a minute and try again.",
            })
          : JSON.stringify({
              success: true,
              message: "Welcome! Check your inbox for a confirmation.",
            }),
    });
  });

  await page.goto("/");
  const newsletterSection = page.locator("#newsletter");
  await page.getByRole("textbox", { name: "Email address" }).fill("mom@example.com");
  await newsletterSection.getByRole("button", { name: "Join the notes" }).click();

  await expect(
    newsletterSection.getByText("Too many requests. Please wait about 1 minute and try again.")
  ).toBeVisible();

  await newsletterSection.getByRole("button", { name: "Join the notes" }).click();
  await expect(
    newsletterSection.getByText("Welcome! Check your inbox for a confirmation.")
  ).toBeVisible();
  expect(idempotencyKeys).toHaveLength(2);
  expect(idempotencyKeys[1]).toBe(idempotencyKeys[0]);
});

test("note pages render with a post-note newsletter CTA", async ({ page }) => {
  await page.goto("/notes/before-calling-the-contractor");

  await expect(
    page.getByRole("heading", { name: "Before Calling the Contractor" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Get A Note for Moms in your inbox" })
  ).toBeVisible();
});

test("notes archive closes with a newsletter invitation", async ({ page }) => {
  await page.goto("/notes");

  const archiveInvitation = page.getByRole("heading", {
    name: "Want the next note in your inbox?",
  });
  await archiveInvitation.scrollIntoViewIfNeeded();

  await expect(archiveInvitation).toBeVisible();
  await expect(page.getByRole("button", { name: "Join the notes" })).toBeVisible();
});

test("speaking hero links directly to the inquiry form", async ({ page }) => {
  await page.goto("/speaking");

  await page.getByRole("link", { name: "Invite me to speak" }).first().click();

  await expect(page).toHaveURL(/\/speaking#book$/);
  await expect(page.locator("#book")).toBeVisible();
});

test("contact form shows client-side validation for missing topic", async ({ page }) => {
  await page.goto("/contact");

  await page.getByRole("textbox", { name: "Name" }).fill("Test User");
  await page.getByRole("textbox", { name: "Email" }).fill("test@example.com");
  await page.getByRole("textbox", { name: "Message" }).fill("Hello there.");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByText("Please select a topic.")).toBeVisible();
});

test("contact success feedback receives focus", async ({ page }) => {
  await page.route("**/api/contact", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        message: "Message sent! I will get back to you as soon as I can.",
      }),
    });
  });

  await page.goto("/contact");
  const form = page.locator("form");
  await form.evaluate((element) => {
    element.noValidate = true;
  });
  await form.getByRole("combobox", { name: "What's this about?" }).click();
  await page.getByRole("option", { name: "Collaboration" }).click();
  await form.getByRole("button", { name: "Send message" }).click();

  const successPanel = page.locator("#contact-success-message");
  await expect(successPanel).toContainText("Message sent!");
  await expect(successPanel).toBeFocused();
});

test("contact speaking inquiries validate shared event details", async ({ page }) => {
  await page.goto("/contact");

  const form = page.locator("form");
  await form.evaluate((element) => {
    element.noValidate = true;
  });
  await form.getByRole("combobox", { name: "What's this about?" }).click();
  await page.getByRole("option", { name: "Speaking Inquiry" }).click();
  await form.getByRole("button", { name: "Send message" }).click();

  await expect(
    form.getByText("Please select an event type and group size.")
  ).toBeVisible();
});

test("speaking inquiry success replaces the form and receives focus", async ({ page }) => {
  await page.route("**/api/contact", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        message: "Inquiry received! I will follow up soon.",
      }),
    });
  });

  await page.goto("/speaking");
  const form = page.locator("#book form");
  await form.evaluate((element) => {
    element.noValidate = true;
  });

  await form.getByRole("button", { name: "Send message" }).click();
  await expect(
    form.getByText("Please select an event type and group size.")
  ).toBeVisible();

  await form.getByRole("combobox", { name: "Event Type" }).click();
  await page.getByRole("option", { name: "Retreat" }).click();
  await form.getByRole("combobox", { name: "Approx. Group Size" }).click();
  await page.getByRole("option", { name: "20 - 50" }).click();
  await form.getByRole("button", { name: "Send message" }).click();

  const successPanel = page.locator("#speaking-success-message");
  await expect(successPanel).toContainText("Inquiry received!");
  await expect(successPanel).toBeFocused();
});
