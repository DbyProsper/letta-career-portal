import { describe, expect, it } from "vitest";
import {
  careers,
  pathList,
  roles,
  youthLinks,
  practiceTabs,
  slug,
} from "../../src/data/catalog";
describe("portal navigation", () => {
  it("exports each route exactly once", () =>
    expect(new Set(pathList).size).toBe(pathList.length));
  it("includes all role and career destinations", () => {
    for (const path of [...roles, ...youthLinks].map((x) => x[1].slice(1)))
      expect(pathList).toContain(path);
    for (const c of careers) expect(pathList).toContain("careers/" + c.id);
  });
  it("includes all practice modules", () => {
    for (const t of practiceTabs.slice(1))
      expect(pathList).toContain("practice/" + slug(t));
  });
});
