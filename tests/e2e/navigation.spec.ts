import { test, expect } from "@playwright/test";
import { pathList } from "../../src/data/catalog";

for (const width of [390, 1280]) {
  test(`page links start at the top and section links reach their target at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 680 });
    await page.goto("/resources/");
    const offset = () => page.evaluate(() => window.scrollY);
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
    expect(await offset()).toBeGreaterThan(100);
    await page.locator("header .brand").click();
    await expect(page.locator(".hero")).toBeVisible();
    await expect.poll(offset).toBe(0);

    await page.locator('a[href="#paths"]').click();
    await expect(page).toHaveURL(/#paths$/);
    await expect(page.locator("#paths h2")).toBeInViewport();
    await expect.poll(offset).toBeGreaterThan(100);
    await page.locator("header .brand").click();
    await expect(page).toHaveURL(/\/$/);
    await expect.poll(offset).toBe(0);

    await page.locator("footer .foot-logo").click();
    await expect.poll(offset).toBe(0);
    await page.locator('footer a[href^="/careers"]').click();
    await expect(page.locator(".workspace")).toBeVisible();
    await expect.poll(offset).toBe(0);

    if (width === 390) await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator("header").getByRole("button", { name: "Discover" }).click();
    await page.getByRole("link", { name: "Future Mix", exact: true }).click();
    await expect(page).toHaveURL(/#future-mix$/);
    await expect(page.locator("#future-mix")).toBeInViewport();
  });
}

test("exported routes are readable on mobile", async ({ page }) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 360, height: 800 });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const path of pathList) {
    const res = await page.goto("/" + path + "/", {
      waitUntil: "domcontentloaded",
    });
    expect(res?.status(), path).toBe(200);
    await expect(page.locator("main h1"), path).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      path,
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});
test("desktop drag and keyboard search", async ({ page }) => {
  await page.goto("/");
  const source = page.getByRole("button", { name: "My strengths" }),
    target = page.getByLabel("Drop a dimension here");
  const a = await source.boundingBox(),
    b = await target.boundingBox();
  if (!a || !b) throw Error("Missing mix controls");
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 20 });
  await page.mouse.up();
  await expect(source).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Control+k");
  await page
    .getByRole("searchbox", { name: "Search the portal" })
    .fill("cover letter");
  await page
    .getByRole("dialog")
    .getByRole("link", { name: /Cover Letter Builder/ })
    .click();
  await expect(
    page.getByRole("heading", { name: "Cover Letter Builder" }),
  ).toBeVisible();
});
test("game and saved opportunities", async ({ page }) => {
  await page.goto("/games/");
  for (let i = 0; i < 5; i++) {
    await page.locator(".option").first().click();
    await page
      .getByRole("button", { name: i === 4 ? "Finish game" : "Next round" })
      .click();
  }
  await expect(page.getByText("Explorer badge earned")).toBeVisible();
  await page.getByRole("button", { name: "Play again" }).click();
  await expect(page.getByText(/Round 1 \/ 5/)).toBeVisible();
  await page.goto("/opportunities/");
  await page.getByRole("button", { name: "Save opportunity" }).first().click();
  await page.getByRole("button", { name: "Saved", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Community study bursary" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Remove saved" })).toHaveCount(
    1,
  );
});
