import { test, expect } from "@playwright/test";
import { pathList } from "../../src/data/catalog";
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
