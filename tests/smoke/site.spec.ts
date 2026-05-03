import { expect, test } from "@playwright/test";

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
  await page.route("**/api/newsletter", async (route) => {
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
});

test("newsletter signup shows retry-after errors", async ({ page }) => {
  await page.route("**/api/newsletter", async (route) => {
    await route.fulfill({
      status: 429,
      headers: {
        "content-type": "application/json",
        "retry-after": "60",
      },
      body: JSON.stringify({
        error: "Too many requests. Please wait a minute and try again.",
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

test("contact form shows client-side validation for missing topic", async ({ page }) => {
  await page.goto("/contact");

  await page.getByRole("textbox", { name: "Name" }).fill("Test User");
  await page.getByRole("textbox", { name: "Email" }).fill("test@example.com");
  await page.getByRole("textbox", { name: "Message" }).fill("Hello there.");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByText("Please select a topic.")).toBeVisible();
});
