import { expect, test } from "@playwright/test";

test("book recommendations need no personal details and preserve text on failure", async ({ page }) => {
  let attempts = 0;
  await page.route("**/api/book-recommendations", async (route) => {
    attempts += 1;
    const body = route.request().postData() ?? "";
    expect(body).toContain("A favorite book by its author");
    expect(body).not.toContain('name="email"');
    expect(body).not.toContain('name="name"');
    await route.fulfill({
      status: attempts === 1 ? 502 : 200,
      contentType: "application/json",
      body: JSON.stringify(attempts === 1 ? { error: "Please try again." } : { success: true }),
    });
  });
  await page.goto("/blog/books-im-reading-lately");
  const form = page.getByRole("region", { name: "What should I read next?" });
  const recommendation = form.getByLabel("Your book recommendation");
  await recommendation.fill("A favorite book by its author");
  await form.getByRole("button", { name: "Send recommendation" }).click();
  await expect(form.getByText("Please try again.")).toBeVisible();
  await expect(recommendation).toHaveValue("A favorite book by its author");
  await form.getByRole("button", { name: "Send recommendation" }).click();
  await expect(form.getByRole("status")).toContainText("sent privately to Lizi");
  await expect(recommendation).toHaveValue("");
  await expect(form.getByRole("button", { name: "Send recommendation" })).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
