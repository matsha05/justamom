import { expect, test } from "@playwright/test";

test("notes expose semantic dates and descriptive read links", async ({ page }) => {
  await page.goto("/notes");

  const articles = page.locator("article.note-feed-article");
  const articleCount = await articles.count();

  expect(articleCount).toBeGreaterThan(0);

  for (let index = 0; index < articleCount; index += 1) {
    const article = articles.nth(index);
    const title = (await article.getByRole("heading").textContent())?.trim();
    const date = article.locator("time");

    expect(title).toBeTruthy();
    await expect(date).toHaveCount(1);
    await expect(date).toHaveAttribute("datetime", /^\d{4}-\d{2}-\d{2}$/);
    await expect(date).toHaveCSS("color", "rgb(111, 100, 92)");
    await expect(
      article.getByRole("link", { name: `Read post: ${title}` })
    ).toBeVisible();
  }
});
