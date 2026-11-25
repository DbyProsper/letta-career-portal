import { describe, expect, it } from "vitest";
import zu from "../../src/i18n/zu.json";
import st from "../../src/i18n/st.json";
import tn from "../../src/i18n/tn.json";
import xh from "../../src/i18n/xh.json";
import { translate } from "../../src/lib/language";
import { services } from "../../src/data/catalog";
const fields = (s: string) => s.match(/\{\w+\}/g)?.sort() ?? [];
describe("portal languages", () => {
  for (const [locale, catalog] of Object.entries({ zu, st, tn, xh })) {
    it(locale + " covers the same messages and preserves named fields", () => {
      expect(Object.keys(catalog).sort()).toEqual(Object.keys(zu).sort());
      for (const [key, value] of Object.entries(catalog)) {
        expect(value.trim(), key).not.toBe("");
        expect(fields(value), key).toEqual(fields(key));
      }
      expect(translate(locale, services[0][1])).not.toBe(services[0][1]);
      expect(
        translate(locale, "Dear {company} team,", {
          company: "Example College",
        }),
      ).toContain("Example College");
    });
  }
});
