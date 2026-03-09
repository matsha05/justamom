import { expect, test } from "@playwright/test";

test("mobile navigation opens and closes", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile-only smoke coverage.");

  await page.goto("/");

  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Notes" })).toBeVisible();

  await page.getByRole("button", { name: "Close menu" }).click();
  await expect(dialog).toBeHidden();
});
