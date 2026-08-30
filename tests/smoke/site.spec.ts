import { expect, test } from "@playwright/test";
import { conversionSources } from "@/lib/conversions";

test("homepage leads readers into Lizi's writing", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Hi, I’m Lizi." })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Read recent notes" })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "More about me" })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Work" })).toHaveCount(0);
  await expect(page.getByText("You are not just a mom.")).toHaveCount(0);
  await expect(page.getByText("Books and reading")).toHaveCount(0);
  await expect(
    page.getByAltText("Lizi Shaw smiling on a mountain trail and holding up her hiking poles")
  ).toBeVisible();
  await expect(page.locator("#notes article.note-feed-article")).toHaveCount(3);
  await expect(page.getByRole("link", { name: "See all notes" })).toBeVisible();
  await expect(page.locator('main img[src*="signature"]')).toHaveCount(0);
});

test("desktop Writing navigation hides empty sections", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Desktop-only smoke coverage.");

  await page.goto("/");
  const primaryNav = page.getByRole("navigation", { name: "Primary" });
  const writingLink = primaryNav.getByRole("link", { name: "Writing", exact: true });

  await writingLink.hover();
  await expect(primaryNav.getByRole("link", { name: "Notes", exact: true })).toBeVisible();
  await expect(primaryNav.getByRole("link", { name: "Blog" })).toHaveCount(0);

  await primaryNav.getByRole("button", { name: "Hide Writing sections" }).press("Escape");
  await expect(primaryNav.getByRole("link", { name: "Notes", exact: true })).toHaveCount(0);

  const writingToggle = primaryNav.locator('button[aria-controls="writing-subnav"]');
  await writingToggle.press("Enter");
  await expect(writingToggle).toHaveAttribute("aria-expanded", "true");
  await writingToggle.press("Escape");
  await expect(writingToggle).toHaveAttribute("aria-expanded", "false");
  await expect(writingToggle).toBeFocused();
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

test("notes archive contains only recent notes and closes with a newsletter invitation", async ({ page }) => {
  await page.goto("/notes");

  await expect(page.getByRole("heading", { name: "A Note for Moms", exact: true })).toBeVisible();
  const writingDirectory = page.getByRole("navigation", {
    name: "Writing sections",
    exact: true,
  });
  await expect(writingDirectory.getByRole("link", { name: "Notes", exact: true })).toHaveAttribute(
    "aria-current",
    "page"
  );
  await expect(writingDirectory.getByRole("link", { name: "Blog" })).toHaveCount(0);
  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: "Blog" })
  ).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Recent notes" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Blog" })).toHaveCount(0);
  await expect(page.getByText("Blog posts are on the way.")).toHaveCount(0);

  const archiveInvitation = page.getByRole("heading", {
    name: "Join A Note for Moms",
  });
  await archiveInvitation.scrollIntoViewIfNeeded();

  await expect(archiveInvitation).toBeVisible();
  await expect(page.getByRole("button", { name: "Join the notes" })).toBeVisible();
});

test("blog has its own archive page", async ({ page }) => {
  await page.goto("/blog");

  await expect(page.getByRole("heading", { name: "Blog", exact: true }).first()).toBeVisible();
  const writingDirectory = page.getByRole("navigation", {
    name: "Writing sections",
    exact: true,
  });
  await expect(writingDirectory.getByRole("link", { name: "Blog", exact: true })).toHaveCount(0);
  await expect(
    writingDirectory.getByRole("link", { name: "Notes", exact: true })
  ).toBeVisible();
  await expect(page.getByText("Blog posts are on the way.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Read recent notes" })).toHaveAttribute(
    "href",
    "/notes"
  );
});

test("Lizi's requested photos appear on Speaking and About", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByAltText("Lizi Shaw smiling outside beside a brick wall")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Hi, I’m Lizi Shaw" })).toBeVisible();
  await expect(page.getByText(/hot cup of coffee \(black of course\)/)).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Lizi smiling outdoors with her three children" })
  ).toHaveCount(1);
  await expect(page.getByAltText("Lizi laughing at home with two of her children")).toHaveCount(0);
  await expect(page.getByAltText("Lizi laughing as two of her children hug her outside")).toBeVisible();
  await expect(page.getByAltText("Lizi and Matt smiling together beneath a rainbow")).toBeVisible();
  await expect(
    page.getByAltText("Lizi sitting on a picnic blanket with her three children at an outdoor concert")
  ).toBeVisible();
  await expect(page.locator('img[src*="about-lizi-red-rocks"]')).toHaveCount(0);
  await expect(page.locator('img[src*="about-lizi-banks"]')).toHaveCount(0);
  await expect(page.locator('img[src*="about-lizi-hiking"]')).toHaveCount(0);
  await expect(page.locator('img[src*="about-lizi-outdoors"]')).toHaveCount(0);
  await expect(page.locator('img[src*="about-lizi-family-banks"]')).toHaveCount(0);
  await expect(page.locator('img[src*="home-lizi-table"]')).toHaveCount(0);
  await expect(page.locator('img[src*="about-lizi-race-day"]')).toHaveCount(0);

  await page.goto("/speaking");
  const speakingPortrait = page.getByAltText("Lizi Shaw smiling outside beside a brick wall");
  await expect(speakingPortrait).toBeVisible();
  await expect(page.getByAltText("Lizi smiling outdoors with her three children")).toHaveCount(0);

  const aspectRatioDifference = await speakingPortrait.evaluate((image: HTMLImageElement) => {
    const bounds = image.getBoundingClientRect();
    const renderedRatio = bounds.width / bounds.height;
    const naturalRatio = image.naturalWidth / image.naturalHeight;

    return Math.abs(renderedRatio - naturalRatio);
  });

  expect(aspectRatioDifference).toBeLessThan(0.01);
  await expect(page.getByText("Topics I share")).toHaveCount(0);
  await expect(page.getByText("Identity in the Noise")).toHaveCount(0);
});

test("About uses one responsive lead family photo in the reading flow", async ({ page }, testInfo) => {
  await page.goto("/about");

  const leadFrame = page.locator('[data-about-lead-photo="responsive"]');
  const leadImage = page.getByRole("img", {
    name: "Lizi smiling outdoors with her three children",
  });
  const proseChildren = page.locator(".about-copy-column .prose");

  await expect(leadFrame).toBeVisible();
  await expect(leadImage).toHaveCount(1);
  await expect(page.locator('img[src*="about-lizi-three-kids"]')).toHaveCount(1);
  expect(
    await proseChildren.evaluate((prose) => {
      const children = Array.from(prose.children);
      const photoIndex = children.findIndex((child) =>
        child.hasAttribute("data-about-lead-photo")
      );

      return (
        photoIndex === 1 &&
        children[0]?.tagName === "P" &&
        children[2]?.tagName === "P"
      );
    })
  ).toBe(true);

  if (testInfo.project.name.includes("mobile")) {
    await expect(page.locator(".about-photo-rail img:visible")).toHaveCount(3);

    const firstParagraph = page.locator(".about-copy-column .prose > p").nth(0);
    const secondParagraph = page.locator(".about-copy-column .prose > p").nth(1);
    const facts = page.locator(".about-facts");
    const remainingPhotoRail = page.locator(".about-photo-rail");
    const [firstBox, leadBox, secondBox, factsBox, railBox] = await Promise.all([
      firstParagraph.boundingBox(),
      leadFrame.boundingBox(),
      secondParagraph.boundingBox(),
      facts.boundingBox(),
      remainingPhotoRail.boundingBox(),
    ]);

    expect(firstBox).not.toBeNull();
    expect(leadBox).not.toBeNull();
    expect(secondBox).not.toBeNull();
    expect(factsBox).not.toBeNull();
    expect(railBox).not.toBeNull();
    expect(firstBox!.y + firstBox!.height).toBeLessThan(leadBox!.y);
    expect(leadBox!.y + leadBox!.height).toBeLessThan(secondBox!.y);
    expect(factsBox!.y + factsBox!.height).toBeLessThan(railBox!.y);
  } else {
    await expect(page.locator(".about-photo-rail img:visible")).toHaveCount(3);
    await expect(page.locator(".about-editorial-grid img:visible")).toHaveCount(4);

    const firstRailPhoto = page.locator(".about-photo-rail img:visible").first();
    const [copyBox, railBox, leadBox, firstRailPhotoBox] = await Promise.all([
      page.locator(".about-copy-column").boundingBox(),
      page.locator(".about-photo-rail").boundingBox(),
      leadFrame.boundingBox(),
      firstRailPhoto.boundingBox(),
    ]);

    expect(copyBox).not.toBeNull();
    expect(railBox).not.toBeNull();
    expect(leadBox).not.toBeNull();
    expect(firstRailPhotoBox).not.toBeNull();
    expect(Math.abs(copyBox!.y - railBox!.y)).toBeLessThan(2);
    expect(railBox!.x).toBeGreaterThan(copyBox!.x + copyBox!.width);
    expect(Math.abs(leadBox!.x - railBox!.x)).toBeLessThan(2);
    expect(Math.abs(leadBox!.y - railBox!.y)).toBeLessThan(2);
    expect(Math.abs(leadBox!.width - railBox!.width)).toBeLessThan(2);
    expect(firstRailPhotoBox!.y).toBeGreaterThan(leadBox!.y + leadBox!.height);
  }
});

test("the retired work section redirects into the writing archive", async ({ page }) => {
  await page.goto("/work");

  await expect(page).toHaveURL(/\/notes$/);
  await expect(page.getByRole("heading", { name: "A Note for Moms", exact: true })).toBeVisible();
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
  await expect(page.getByRole("combobox", { name: "What's this about?" })).toBeFocused();
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

test("contact speaking inquiries accept optional event details", async ({ page }) => {
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

  await page.goto("/contact");

  const form = page.locator("form");
  await form.getByRole("combobox", { name: "What's this about?" }).click();
  await page.getByRole("option", { name: "Speaking Inquiry" }).click();
  const eventDetails = form.getByRole("group", { name: "Event details, if known" });

  await expect(eventDetails).toContainText(
    "Every field in this section is optional."
  );
  await expect(
    eventDetails.getByRole("combobox", { name: "Event Type (optional)" })
  ).toHaveAttribute("aria-required", "false");
  await expect(form.locator("#message")).toHaveCount(1);

  await form.getByRole("textbox", { name: "Name (required)", exact: true }).fill("Test User");
  await form
    .getByRole("textbox", { name: "Email (required)", exact: true })
    .fill("test@example.com");
  await form.getByRole("button", { name: "Send message" }).click();

  const successPanel = page.locator("#contact-success-message");
  await expect(successPanel).toContainText("Inquiry received!");
  await expect(successPanel).toBeFocused();
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
  const nameInput = form.getByRole("textbox", { name: "Your Name (required)" });
  const emailInput = form.getByRole("textbox", { name: "Email Address (required)" });
  const eventDetails = form.getByRole("group", { name: "Event details, if known" });

  await form.getByRole("button", { name: "Send message" }).click();
  await expect(nameInput).toBeFocused();

  await expect(eventDetails).toContainText(
    "Every field in this section is optional."
  );
  await expect(
    eventDetails.getByRole("combobox", { name: "Event Type (optional)" })
  ).toHaveAttribute("aria-required", "false");

  await nameInput.fill("Test User");
  await emailInput.fill("test@example.com");
  await form.getByRole("button", { name: "Send message" }).click();

  const successPanel = page.locator("#speaking-success-message");
  await expect(successPanel).toContainText("Inquiry received!");
  await expect(successPanel).toBeFocused();
});
