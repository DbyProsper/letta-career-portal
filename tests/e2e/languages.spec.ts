import { test, expect } from "@playwright/test";
import zu from "../../src/i18n/zu.json";
import st from "../../src/i18n/st.json";
import tn from "../../src/i18n/tn.json";
import xh from "../../src/i18n/xh.json";

const locales = [
  ["isiZulu", "zu", zu],
  ["Sesotho", "st", st],
  ["Setswana", "tn", tn],
  ["isiXhosa", "xh", xh],
] as const;
for (const [language, code, copy] of locales) {
  test(
    language + " translates the hero, booking choices and resource text",
    async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto("/");
      await page.locator("select").first().selectOption(language);
      await expect(page.locator("html")).toHaveAttribute("lang", code);
      await expect(page.locator(".hero-description")).toHaveText(
        copy[
          "Career counselling, psychological wellness and professional support, all in one place."
        ],
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const orb = page.getByRole("button", {
        name: copy["My interests"],
        exact: true,
      });
      await orb.click();
      await expect(orb).toHaveAttribute("aria-pressed", "true");
      const box = await orb.boundingBox();
      expect(box && Math.abs(box.width - box.height)).toBeLessThan(2);
      await page.locator(".hero-actions .btn").click();
      const first = page.locator(".option").first();
      await expect(first).toHaveText(copy["Career guidance and counselling"]);
      await expect(first).toHaveAttribute("aria-pressed", "true");
      await page
        .getByRole("button", { name: copy["Next"], exact: true })
        .click();
      await expect(page.locator("main h2")).toHaveText(
        copy["Choose a sample practitioner"],
      );
      await page.goto("/resources/");
      await page
        .getByRole("searchbox", { name: copy["Search resources"] })
        .fill(copy["Give your week a little breathing room"]);
      await page.locator("main summary").click();
      await expect(page.locator("main details p")).toHaveText(
        copy[
          "Write down three things on your mind. Circle one you can influence today. Choose a small next step and make time for a break."
        ],
      );
    },
  );
}
