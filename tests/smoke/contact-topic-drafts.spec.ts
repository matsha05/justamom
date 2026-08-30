import { expect, test, type Page } from "@playwright/test";

function multipartValue(payload: string, field: string) {
  const match = payload.match(
    new RegExp(`name="${field}"\\r?\\n(?:Content-Type:[^\\r\\n]+\\r?\\n)?\\r?\\n([^\\r\\n]*)`)
  );

  return match?.[1] ?? null;
}

async function chooseTopic(page: Page, topic: string) {
  const form = page.locator("form");
  await form.getByRole("combobox", { name: "What's this about?" }).click();
  await page.getByRole("option", { name: topic, exact: true }).click();
}

test("contact topic changes preserve drafts and submit only the active fields", async ({ page }) => {
  const submissions: string[] = [];

  await page.route("**/api/contact", async (route) => {
    submissions.push(route.request().postData() ?? "");

    if (submissions.length === 1) {
      await route.fulfill({
        status: 502,
        contentType: "application/json",
        body: JSON.stringify({ error: "Intentional test retry." }),
      });
      return;
    }

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

  await form.getByRole("textbox", { name: "Name (required)", exact: true }).fill("Test User");
  await form
    .getByRole("textbox", { name: "Email (required)", exact: true })
    .fill("test@example.com");
  await chooseTopic(page, "Collaboration");
  await form
    .getByRole("textbox", { name: "Message (required)", exact: true })
    .fill("Please preserve this contact draft.");

  await chooseTopic(page, "Speaking Inquiry");
  const eventDetails = form.getByRole("group", { name: "Event details, if known" });

  await eventDetails
    .getByRole("textbox", { name: "Church / Group Name (optional)", exact: true })
    .fill("Monday Night Mamas");
  await eventDetails
    .getByRole("combobox", { name: "Event Date(s) (optional)", exact: true })
    .fill("Oct 12, 2026");
  await eventDetails
    .getByRole("textbox", { name: "Location (City, State) (optional)", exact: true })
    .fill("Denver, CO");
  await eventDetails.getByRole("combobox", { name: "Event Type (optional)" }).click();
  await page.getByRole("option", { name: "Retreat", exact: true }).click();
  await eventDetails.getByRole("combobox", { name: "Approx. Group Size (optional)" }).click();
  await page.getByRole("option", { name: "20 - 50", exact: true }).click();
  await eventDetails
    .getByRole("textbox", { name: "Event theme or vision (optional)", exact: true })
    .fill("Please preserve this speaking draft.");

  await expect(form.locator("#message")).toHaveCount(1);

  await chooseTopic(page, "Collaboration");
  await expect(
    form.getByRole("textbox", { name: "Message (required)", exact: true })
  ).toHaveValue("Please preserve this contact draft.");
  await expect(form.locator("#message")).toHaveCount(1);

  await form.getByRole("button", { name: "Send message" }).click();
  await expect(form.getByRole("alert")).toContainText("Intentional test retry.");
  await expect.poll(() => submissions.length).toBe(1);

  expect(multipartValue(submissions[0], "form_type")).toBe("contact");
  expect(multipartValue(submissions[0], "subject")).toBe("Collaboration");
  expect(multipartValue(submissions[0], "message")).toBe(
    "Please preserve this contact draft."
  );
  expect(multipartValue(submissions[0], "organization")).toBeNull();
  expect(multipartValue(submissions[0], "event_date")).toBeNull();
  expect(multipartValue(submissions[0], "location")).toBeNull();
  expect(multipartValue(submissions[0], "event_type")).toBeNull();
  expect(multipartValue(submissions[0], "audience_size")).toBeNull();

  await chooseTopic(page, "Speaking Inquiry");
  await expect(
    eventDetails.getByRole("textbox", {
      name: "Church / Group Name (optional)",
      exact: true,
    })
  ).toHaveValue("Monday Night Mamas");
  await expect(
    eventDetails.getByRole("combobox", {
      name: "Event Date(s) (optional)",
      exact: true,
    })
  ).toHaveValue("Oct 12, 2026");
  await expect(
    eventDetails.getByRole("textbox", {
      name: "Location (City, State) (optional)",
      exact: true,
    })
  ).toHaveValue("Denver, CO");
  await expect(eventDetails.getByRole("combobox", { name: "Event Type (optional)" })).toContainText(
    "Retreat"
  );
  await expect(
    eventDetails.getByRole("combobox", { name: "Approx. Group Size (optional)" })
  ).toContainText("20 - 50");
  await expect(
    eventDetails.getByRole("textbox", {
      name: "Event theme or vision (optional)",
      exact: true,
    })
  ).toHaveValue("Please preserve this speaking draft.");
  await expect(form.locator("#message")).toHaveCount(1);

  await form.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator("#contact-success-message")).toContainText("Inquiry received!");
  await expect.poll(() => submissions.length).toBe(2);

  expect(multipartValue(submissions[1], "form_type")).toBe("speaking");
  expect(multipartValue(submissions[1], "subject")).toBe("Speaking Inquiry");
  expect(multipartValue(submissions[1], "message")).toBe(
    "Please preserve this speaking draft."
  );
  expect(multipartValue(submissions[1], "organization")).toBe("Monday Night Mamas");
  expect(multipartValue(submissions[1], "event_date")).toBe("Oct 12, 2026");
  expect(multipartValue(submissions[1], "location")).toBe("Denver, CO");
  expect(multipartValue(submissions[1], "event_type")).toBe("Retreat");
  expect(multipartValue(submissions[1], "audience_size")).toBe("20-50");
  expect(submissions[1]).not.toContain("Please preserve this contact draft.");

  await expect(
    form.getByRole("textbox", { name: "Message (required)", exact: true })
  ).toHaveValue("");
  await chooseTopic(page, "Speaking Inquiry");
  await expect(
    eventDetails.getByRole("textbox", {
      name: "Church / Group Name (optional)",
      exact: true,
    })
  ).toHaveValue("");
  await expect(
    eventDetails.getByRole("combobox", {
      name: "Event Date(s) (optional)",
      exact: true,
    })
  ).toHaveValue("");
  await expect(
    eventDetails.getByRole("textbox", {
      name: "Event theme or vision (optional)",
      exact: true,
    })
  ).toHaveValue("");
});
