import { expect, test } from "@playwright/test";

test("mobile navigation opens and closes", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile-only smoke coverage.");

  await page.goto("/");

  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect.poll(() => dialog.evaluate((element) => element.matches(":modal"))).toBe(true);
  await expect(dialog.getByRole("button", { name: "Close menu" })).toBeFocused();
  await expect(dialog.getByRole("link", { name: "About Me" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Writing", exact: true })).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Speaking" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Contact" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Work" })).toHaveCount(0);

  const writingToggle = dialog.locator('button[aria-controls="mobile-writing-subnav"]');
  await expect(writingToggle).toHaveAttribute("aria-expanded", "false");
  await writingToggle.click();
  await expect(writingToggle).toHaveAttribute("aria-expanded", "true");
  await expect(dialog.getByRole("link", { name: "Recent Notes" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Blog" })).toBeVisible();

  await page.getByRole("button", { name: "Close menu" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});

test("mobile Writing sections navigate to separate archives", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile-only smoke coverage.");

  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Show Writing sections" }).click();
  await dialog.getByRole("link", { name: "Blog" }).click();

  await expect(page).toHaveURL(/\/blog$/);
  await expect(page.getByRole("heading", { name: "Blog", exact: true }).first()).toBeVisible();
  await expect(dialog).toBeHidden();
});

test("mobile navigation remains reachable in a short viewport", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile-only smoke coverage.");

  await page.setViewportSize({ width: 320, height: 320 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.locator('button[aria-controls="mobile-writing-subnav"]').click();

  await expect(dialog.getByRole("link", { name: "About Me" })).toBeVisible();
  const contactLink = dialog.getByRole("link", { name: "Contact" });
  await contactLink.scrollIntoViewIfNeeded();
  await expect(contactLink).toBeVisible();
  await expect
    .poll(() =>
      dialog
        .getByRole("navigation", { name: "Primary" })
        .evaluate((element) => element.scrollHeight > element.clientHeight)
    )
    .toBe(true);
});
