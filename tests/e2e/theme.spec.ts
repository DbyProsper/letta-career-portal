import { expect, test } from "@playwright/test";

test("system theme follows the device until a choice is saved", async ({ page, context }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const toggle = page.getByRole("switch", { name: "Dark mode" });
  await expect(toggle).toBeChecked();
  await page.emulateMedia({ colorScheme: "light" });
  await expect(toggle).not.toBeChecked();
  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(toggle).toBeChecked();
  await page.goto("/booking/");
  await expect(toggle).toBeChecked();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const secondTab = await context.newPage();
  await secondTab.goto("/team/");
  const otherToggle = secondTab.getByRole("switch", { name: "Dark mode" });
  await expect(otherToggle).toBeChecked();
  await otherToggle.click();
  await expect(toggle).not.toBeChecked();
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("mobile theme control leaves search, navigation and booking accessible", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.getByRole("switch", { name: "Dark mode" }).click();
  await page.getByRole("button", { name: "Search portal" }).click();
  await expect(page.getByRole("searchbox")).toBeFocused();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  await page.getByRole("button", { name: "Close menu" }).click();
  await page.locator("header").getByRole("link", { name: "Book a session" }).click();
  const option = page.getByRole("button", { name: "Career guidance and counselling", exact: true });
  await option.click();
  await expect(option).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
