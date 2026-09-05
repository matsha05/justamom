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
  await expect(dialog.getByRole("link", { name: "Notes", exact: true })).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Blog" })).toBeVisible();

  await page.getByRole("button", { name: "Close menu" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});

test("mobile Writing sections open the separate Blog archive", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile-only smoke coverage.");

  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Show Writing sections" }).click();
  await expect(dialog.getByRole("link", { name: "Notes", exact: true })).toBeVisible();
  await dialog.getByRole("link", { name: "Blog", exact: true }).click();

  await expect(page).toHaveURL(/\/blog$/);
  await expect(page.getByRole("heading", { name: "Blog", exact: true })).toBeVisible();
  await expect(dialog).toBeHidden();
});

test("resizing an open mobile menu releases the desktop page", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile-only smoke coverage.");

  await page.setViewportSize({ width: 767, height: 800 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.locator("dialog:modal")).toHaveCount(1);
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

  await page.setViewportSize({ width: 768, height: 800 });
  await expect(page.locator("dialog")).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(
    page.getByRole("button", { name: "Open menu", includeHidden: true })
  ).not.toBeFocused();

  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await page
    .getByRole("navigation", { name: "Primary", exact: true })
    .getByRole("link", { name: "Contact", exact: true })
    .click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(
    page.getByRole("textbox", { name: "Name (required)", exact: true })
  ).toBeVisible();

  await page.setViewportSize({ width: 767, height: 800 });
  const openMenu = page.getByRole("button", { name: "Open menu" });
  await expect(page.locator("dialog")).toHaveCount(0);
  await openMenu.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog")).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(openMenu).toBeFocused();
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
