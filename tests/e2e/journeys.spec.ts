import { expect, test } from "@playwright/test";
test("Future Mix, discovery and mobile navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "My interests" }).click();
  await expect(
    page.getByRole("button", { name: "My interests" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("link", { name: "Discover your possibilities" }).click();
  await page.getByRole("link", { name: "Start activity" }).click();
  for (let i = 0; i < 6; i++) {
    await page.locator(".option").first().click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
  }
  await page.getByLabel("Your reflection").fill("Try a design project");
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "View reflections" }).click();
  await expect(page.getByText("Try a design project")).toBeVisible();
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("button", { name: "Services", exact: true }).click();
  await page.getByRole("link", { name: "All services", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Our services" }),
  ).toBeVisible();
});
test("careers, comparisons, saved goals and milestones persist", async ({
  page,
}) => {
  await page.goto("/careers/");
  await page.getByLabel("Career field").selectOption("Technology");
  await page.getByRole("link", { name: "Software developer" }).click();
  await page.getByRole("button", { name: "Save career" }).click();
  await page.getByRole("button", { name: "Compare", exact: true }).click();
  await page.getByRole("link", { name: "All careers" }).click();
  await page.getByPlaceholder("Search careers or skills").fill("teacher");
  await page.getByRole("button", { name: "Compare", exact: true }).click();
  await expect(page.getByRole("row")).toHaveCount(3);
  await page.goto("/my-future/");
  await expect(
    page.getByRole("link", { name: "Software developer" }),
  ).toBeVisible();
  await page.getByLabel("New goal").fill("Try programming");
  await page.getByRole("button", { name: "Add goal" }).click();
  await page.getByLabel("New milestone").fill("Write a simple app");
  await page.getByRole("button", { name: "Add milestone" }).click();
  await page.getByRole("checkbox", { name: "Write a simple app" }).check();
  await page.reload();
  await expect(page.getByText("1 of 1 milestones complete")).toBeVisible();
});
test("booking flows into practice and individual dashboards", async ({
  page,
}) => {
  await page.goto("/booking/");
  await page
    .getByRole("button", { name: "Career guidance and counselling", exact: true })
    .click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Help me choose" }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.locator(".option").first().click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByLabel("Name", { exact: true }).fill("Demo Learner");
  await page.getByLabel("Email", { exact: true }).fill("demo@example.com");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Submit simulated request" }).click();
  await expect(page.getByText(/Simulated request recorded/)).toBeVisible();
  await page.goto("/practice/appointments/");
  await page.locator("summary").filter({ hasText: "Demo Learner" }).click();
  await page
    .getByRole("combobox", { name: "Status", exact: true })
    .selectOption("Allocated");
  await page.goto("/individual/dashboard/");
  await expect(page.getByText("Allocated", { exact: true })).toBeVisible();
});
test("parent sharing, school enquiries and resource publication", async ({
  page,
}) => {
  await page.goto("/parent/dashboard/");
  await page.getByRole("checkbox").check();
  await expect(page.getByText(/Alex explored two/)).toBeVisible();
  await page.getByLabel("Sample family name").fill("Demo family");
  await page.getByLabel("Demo contact email").fill("family@example.com");
  await page.getByRole("button", { name: "Submit demo request" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Simulated request saved" }),
  ).toBeVisible();
  await page.goto("/school/dashboard/");
  await page.getByLabel("Sample organisation name").fill("Demo Academy");
  await page.getByLabel("Demo contact email").fill("school@example.com");
  await page.getByRole("button", { name: "Submit demo request" }).click();
  await page.goto("/practice/schools/");
  await expect(page.getByText("Demo Academy")).toBeVisible();
  await page.goto("/practice/content-studio/");
  await page.getByLabel("Article title").fill("Choosing a first project");
  await page.getByLabel("Article text").fill("Begin with a small task.");
  await page.getByRole("button", { name: "Save draft" }).click();
  await page.getByRole("button", { name: "Edit article" }).click();
  await page.getByLabel("Article title").fill("Your first project");
  await page.getByRole("button", { name: "Preview", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Article preview" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Publish", exact: true }).click();
  await page.goto("/resources/");
  await page.getByText("Your first project", { exact: true }).click();
  await expect(page.getByText("Begin with a small task.")).toBeVisible();
});
test("toolkit exports both PDFs", async ({ page }) => {
  await page.goto("/career-toolkit/cv-builder/");
  await page.getByLabel("Full name").fill("Alex Demo");
  await page.getByLabel("Email", { exact: true }).fill("alex@example.com");
  await page.getByLabel("Profile details").fill("Creative student");
  await page.getByLabel("CV template").selectOption("Editorial");
  const pdf = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CV as PDF" }).click();
  expect((await pdf).suggestedFilename()).toMatch(/\.pdf$/);
  await page.goto("/career-toolkit/cover-letter-builder/");
  for (const [l, v] of [
    ["Your name", "Alex Demo"],
    ["Organisation", "Sample studio"],
    ["Position or programme", "Design intern"],
    ["Relevant experience", "I designed a school poster."],
  ])
    await page.getByLabel(l, { exact: true }).fill(v);
  await page.getByRole("button", { name: "Generate draft" }).click();
  await expect(page.getByLabel("Editable draft")).toHaveValue(/Sample studio/);
  const letter = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export letter as PDF" }).click();
  expect((await letter).suggestedFilename()).toMatch(/\.pdf$/);
});
test("responsive home has no overflow or broken images", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 850 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page
      .locator(".hero-person")
      .evaluate(async (el: HTMLImageElement) => el.decode());
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(
      await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs.every((i) => (i as HTMLImageElement).naturalWidth > 0),
        ),
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});
