import { test, expect } from "@playwright/test";

test("hero motion plays, can be paused, and keeps the mix interactive", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const pieces = page.locator(
    ".orb-face,.hero-art .art-star,.art-ring,.art-pearl",
  );
  await expect(pieces).toHaveCount(8);
  const positions = () =>
    pieces.evaluateAll((nodes) =>
      nodes.map((el) => el.getBoundingClientRect().top),
    );
  const initial = await positions();
  await expect
    .poll(async () => {
      const next = await positions();
      return next.every((top, i) => Math.abs(top - initial[i]) > 1);
    })
    .toBe(true);
  await page.getByRole("button", { name: "Pause floating motion" }).click();
  await expect
    .poll(() =>
      pieces.evaluateAll((nodes) =>
        nodes.every(
          (el) => getComputedStyle(el).animationPlayState === "paused",
        ),
      ),
    )
    .toBe(true);
  await page.getByRole("button", { name: "My wellbeing" }).click();
  await expect(
    page.getByRole("button", { name: "My wellbeing" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Resume floating motion" }).click();
  await expect(page.locator(".art-star.s1")).toHaveCSS(
    "animation-play-state",
    "running",
  );
});

test("scrolling reveals the words and cards, and reduced motion keeps content visible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1000, height: 600 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const heading = page.getByRole("heading", {
    name: /Support that grows with you/,
  });
  const tile = page.locator(".home-section .founder-card");
  await expect(heading).toHaveAttribute("data-reveal", "waiting");
  await expect(tile).toHaveCSS("opacity", "0");
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toHaveAttribute("data-reveal", "visible");
  await expect(heading.locator(".word-ink").first()).toHaveCSS(
    "animation-name",
    "word-rise",
  );
  await tile.scrollIntoViewIfNeeded();
  await expect(tile).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".orb-face").first()).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(tile).toHaveCSS("opacity", "1");
});

test("Letta leads the team and opens the correct demo booking", async ({
  page,
}) => {
  await page.goto("/");
  const founder = page.locator(".team-grid a").first();
  await expect(founder).toContainText("Founder and team leader");
  await expect(founder).toContainText("Clinical Psychologist");
  await founder.click();
  await expect(page).toHaveURL(/profile=letta/);
  const card = page.locator(".founder-card");
  await expect(card).toContainText("Letta founded Letta Consulting");
  await card.getByRole("link", { name: "Request a session" }).click();
  await page
    .getByRole("button", {
      name: "Career guidance and counselling",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(
    page.getByRole("button", { name: /Letta.*Clinical Psychologist/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goto("/team/?profile=0");
  await expect(
    page
      .locator(".team-grid .panel")
      .filter({ hasText: "Naledi M." })
      .getByRole("link", { name: "Request a session" }),
  ).toBeVisible();
});
