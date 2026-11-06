import { expect, test } from "@playwright/test";

test("entering mobile width resets the desktop Writing disclosure", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop-only smoke coverage.");

  await page.setViewportSize({ width: 1024, height: 800 });
  await page.goto("/");
  const writingToggle = page.locator('button[aria-controls="writing-subnav"]');
  await writingToggle.focus();
  await writingToggle.press("Enter");
  await expect(writingToggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#writing-subnav")).toBeVisible();

  await page.setViewportSize({ width: 767, height: 800 });
  await expect(writingToggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#writing-subnav")).toHaveCount(0);

  const openMenu = page.getByRole("button", { name: "Open menu" });
  await openMenu.click();
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog")).toHaveCount(0);
  await expect(openMenu).toBeFocused();

  // The mobile trigger sits where Writing appears after resize; avoid a new hover-open event.
  await page.mouse.move(20, 400);
  await page.setViewportSize({ width: 1024, height: 800 });
  await expect(writingToggle).toBeVisible();
  await expect(writingToggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#writing-subnav")).toHaveCount(0);
  await writingToggle.focus();
  await writingToggle.press("Enter");
  await expect(page.locator("#writing-subnav")).toBeVisible();
});
