import { expect, test, type Page } from "@playwright/test";

async function chooseOption(page: Page, label: string, option: string) {
  await page.getByRole("combobox", { name: label, exact: true }).click();
  await page.getByRole("option", { name: option, exact: true }).click();
}

test("changing contact topic starts a new request after a cached validation error", async ({ page }) => {
  const requests: { key: string; payload: string }[] = [];
  const cachedErrors = new Set<string>();

  await page.route("**/api/contact", async (route) => {
    const key = route.request().headers()["idempotency-key"] ?? "";
    const payload = route.request().postData() ?? "";
    requests.push({ key, payload });
    const isSpeaking = /name="form_type"\r?\n\r?\nspeaking/.test(payload);
    const invalid = cachedErrors.has(key) || !isSpeaking;
    if (invalid) cachedErrors.add(key);
    await route.fulfill({
      status: invalid ? 400 : 200,
      contentType: "application/json",
      body: JSON.stringify(invalid
        ? { error: "Please include a message." }
        : { success: true, message: "Speaking request received." }),
    });
  });

  await page.goto("/contact");
  const form = page.locator("form");
  await form.locator("#name").fill("Test User");
  await form.locator("#email").fill("test@example.com");
  await chooseOption(page, "What's this about? (required)", "Collaboration");
  await form.locator("#message").fill("   ");
  await form.getByRole("button", { name: "Send message" }).click();
  await expect(form.getByRole("alert")).toHaveText("Please include a message.");

  await chooseOption(page, "What's this about? (required)", "Speaking Inquiry");
  await expect(form.getByRole("alert")).toHaveCount(0);
  await form.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator("#contact-success-message")).toContainText("Speaking request received.");
  expect(requests).toHaveLength(2);
  expect(requests[0].key).toBeTruthy();
  expect(requests[1].key).not.toBe(requests[0].key);

  // Clearing controlled fields after success must not act like another user edit.
  await expect(form.getByRole("button", { name: "Send message" })).toBeDisabled();
  await expect(page.locator("#contact-success-message")).toBeFocused();
});

for (const pathname of ["/contact", "/speaking"] as const) {
  test(`${pathname} locks its draft and serializes same-turn submissions`, async ({ page }) => {
    const requests: { key: string; payload: string }[] = [];
    let releaseResponse!: () => void;
    const pendingResponse = new Promise<void>((resolve) => { releaseResponse = resolve; });
    await page.route("**/api/contact", async (route) => {
      requests.push({
        key: route.request().headers()["idempotency-key"] ?? "",
        payload: route.request().postData() ?? "",
      });
      await pendingResponse;
      await route.fulfill({
        status: 502,
        contentType: "application/json",
        body: JSON.stringify({ error: "Please retry this test request." }),
      });
    });

    await page.goto(pathname);
    const form = page.locator("form");
    await form.locator("#name").fill("Test User");
    await form.locator("#email").fill("test@example.com");
    if (pathname === "/contact") {
      await chooseOption(page, "What's this about? (required)", "Collaboration");
    }
    await form.locator("#message").fill("Keep this draft until the request finishes.");
    await form.evaluate((element: HTMLFormElement) => {
      element.requestSubmit();
      element.requestSubmit();
    });
    await expect.poll(() => requests.length).toBe(1);
    await expect(form).toHaveAttribute("aria-busy", "true");
    for (const id of ["name", "email", "message", pathname === "/contact" ? "subject" : "event_type"]) {
      await expect(form.locator(`#${id}`)).toBeDisabled();
    }
    expect(requests[0].payload).toContain("test@example.com");
    expect(requests[0].payload).toContain("Keep this draft until the request finishes.");

    releaseResponse();
    await expect(form.getByRole("alert")).toHaveText("Please retry this test request.");
    await expect(form.locator("#message")).toBeEnabled();
    await expect(form.locator("#message")).toHaveValue("Keep this draft until the request finishes.");
    await form.getByRole("button", { name: "Send message" }).click();
    await expect(form.getByRole("alert")).toHaveText("Please retry this test request.");
    expect(requests).toHaveLength(2);
    expect(requests[0].key).toBeTruthy();
    expect(requests[1].key).toBe(requests[0].key);
  });

  test(`${pathname} calendar and option edits clear errors and replace the request key`, async ({ page }) => {
    // This regression concerns edits, independent of calendar month restoration.
    await page.clock.setFixedTime(new Date("2030-12-01T12:00:00Z"));
    const keys: string[] = [];
    await page.route("**/api/contact", async (route) => {
      keys.push(route.request().headers()["idempotency-key"] ?? "");
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "Please revise this test request." }),
      });
    });

    await page.goto(pathname);
    const form = page.locator("form");
    await form.locator("#name").fill("Test User");
    await form.locator("#email").fill("test@example.com");
    if (pathname === "/contact") {
      await chooseOption(page, "What's this about? (required)", "Speaking Inquiry");
    }
    const dateInput = form.locator("#event_date");
    await dateInput.fill("Dec 12, 2030");

    const submit = async () => {
      await form.getByRole("button", { name: "Send message" }).click();
      await expect(form.getByRole("alert")).toHaveText("Please revise this test request.");
    };
    await submit();

    await dateInput.press("ArrowDown");
    const calendar = page.getByRole("dialog", { name: "Choose date" });
    await calendar.getByRole("button", { name: /Friday, December 13th, 2030/ }).click();
    await expect(dateInput).toHaveValue("Dec 13, 2030");
    await expect(form.getByRole("alert")).toHaveCount(0);
    await submit();

    await chooseOption(page, "Event Type (optional)", "Retreat");
    await expect(form.getByRole("alert")).toHaveCount(0);
    await submit();

    await chooseOption(page, "Approx. Group Size (optional)", "20 - 50");
    await expect(form.getByRole("alert")).toHaveCount(0);
    await submit();

    expect(keys).toHaveLength(4);
    expect(keys.every(Boolean)).toBe(true);
    expect(new Set(keys).size).toBe(4);
  });
}

test("newsletter serializes same-turn submits and keeps retry feedback exclusive", async ({ page }) => {
  const keys: string[] = [];
  let releaseFirstResponse!: () => void;
  const firstResponse = new Promise<void>((resolve) => { releaseFirstResponse = resolve; });
  await page.route("**/api/newsletter", async (route) => {
    keys.push(route.request().headers()["idempotency-key"] ?? "");
    const firstAttempt = keys.length === 1;
    if (firstAttempt) await firstResponse;
    await route.fulfill({
      status: firstAttempt ? 502 : 200,
      contentType: "application/json",
      body: JSON.stringify(firstAttempt
        ? { error: "Please retry this signup." }
        : { success: true, message: "Signup received." }),
    });
  });

  await page.goto("/");
  const form = page.locator("#newsletter form");
  const email = form.getByRole("textbox", { name: "Email address" });
  await email.fill("test@example.com");
  const submitTwice = () => form.evaluate((element: HTMLFormElement) => {
    element.requestSubmit();
    element.requestSubmit();
  });
  await submitTwice();
  await expect.poll(() => keys.length).toBe(1);
  await expect(form).toHaveAttribute("aria-busy", "true");
  await expect(email).toBeDisabled();
  releaseFirstResponse();
  await expect(form.getByRole("alert")).toHaveText("Please retry this signup.");
  await expect(email).toHaveValue("test@example.com");

  await submitTwice();
  await expect(form.getByRole("status")).toHaveText("Signup received.");
  await expect(form.getByRole("alert")).toHaveCount(0);
  await expect(email).toHaveValue("");
  expect(keys).toHaveLength(2);
  expect(keys[0]).toBeTruthy();
  expect(keys[1]).toBe(keys[0]);

  await email.fill("another@example.com");
  await form.getByRole("button", { name: "Join the notes" }).click();
  await expect(form.getByRole("status")).toHaveText("Signup received.");
  expect(keys).toHaveLength(3);
  expect(keys[2]).not.toBe(keys[1]);
});

test("speaking success restarts with an empty draft and a new request key", async ({ page }) => {
  const requests: { key: string; payload: string }[] = [];
  await page.route("**/api/contact", async (route) => {
    requests.push({
      key: route.request().headers()["idempotency-key"] ?? "",
      payload: route.request().postData() ?? "",
    });
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, message: "Speaking request received." }),
    });
  });

  await page.goto("/speaking");
  const form = page.locator("#book form");
  await form.locator("#name").fill("First Person");
  await form.locator("#email").fill("first@example.com");
  await form.locator("#org").fill("First Organization");
  await form.locator("#event_date").fill("Dec 12, 2030");
  await form.getByRole("button", { name: "Send message" }).click();
  const success = page.locator("#speaking-success-message");
  await expect(success).toBeFocused();
  await expect(form).toHaveCount(0);

  await success.getByRole("button", { name: "Send another message" }).click();
  for (const id of ["name", "email", "org", "event_date", "message"]) {
    await expect(form.locator(`#${id}`)).toHaveValue("");
  }
  await form.locator("#name").fill("Second Person");
  await form.locator("#email").fill("second@example.com");
  await form.getByRole("button", { name: "Send message" }).click();
  await expect(success).toContainText("Speaking request received.");
  expect(requests).toHaveLength(2);
  expect(requests[1].key).not.toBe(requests[0].key);
  expect(requests[1].payload).not.toContain("First Organization");
  expect(requests[1].payload).not.toContain("Dec 12, 2030");
});

test("uncertain delivery keeps the draft and request identity for an explicit retry", async ({ page }) => {
  const keys: string[] = [];
  const message = "Your message may have been received. Please check with Lizi before sending a new message.";
  await page.route("**/api/contact", async (route) => {
    keys.push(route.request().headers()["idempotency-key"] ?? "");
    await route.fulfill({
      status: 409,
      contentType: "application/json",
      body: JSON.stringify({ error: message, code: "delivery_unknown" }),
    });
  });

  await page.goto("/speaking");
  const form = page.locator("#book form");
  await form.locator("#name").fill("Test User");
  await form.locator("#email").fill("test@example.com");
  await form.locator("#message").fill("Please keep this inquiry.");
  await form.getByRole("button", { name: "Send message" }).click();
  await expect(form.getByRole("alert")).toHaveText(message);
  await expect(form.locator("#message")).toHaveValue("Please keep this inquiry.");
  expect(keys).toHaveLength(1);
  await form.getByRole("button", { name: "Send message" }).click();
  await expect(form.getByRole("alert")).toHaveText(message);
  expect(keys).toHaveLength(2);
  expect(keys[1]).toBe(keys[0]);
});
