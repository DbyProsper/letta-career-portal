"use client";
import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useLocal } from "./store";
import zu from "../i18n/zu.json";
import st from "../i18n/st.json";
import tn from "../i18n/tn.json";
import xh from "../i18n/xh.json";
export const languages = [
  "English",
  "isiZulu",
  "Sesotho",
  "Setswana",
  "isiXhosa",
] as const;
const localeCodes: Record<string, string> = {
  English: "en",
  isiZulu: "zu",
  Sesotho: "st",
  Setswana: "tn",
  isiXhosa: "xh",
};
const messages: Record<string, Record<string, string>> = { zu, st, tn, xh };
type Params = Record<string, string | number>;
export function translate(locale: string, source: string, params?: Params) {
  const dictionary = messages[locale];
  const text =
    dictionary && Object.hasOwn(dictionary, source)
      ? dictionary[source]
      : source;
  return params
    ? text.replace(/\{(\w+)\}/g, (token, key) =>
        Object.hasOwn(params, key) ? String(params[key]) : token,
      )
    : text;
}
const LanguageContext = createContext({
  language: "English",
  locale: "en",
  set: (_language: string) => {},
  t: (source: string, params?: Params) => translate("en", source, params),
});
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useLocal("language", "English");
  const locale = localeCodes[language] || "en";
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  const value = useMemo(
    () => ({
      language,
      locale,
      set: (name: string) => {
        if (Object.hasOwn(localeCodes, name)) setLanguage(name);
      },
      t: (text: string, params?: Params) => translate(locale, text, params),
    }),
    [language, locale, setLanguage],
  );
  return createElement(LanguageContext.Provider, { value }, children);
}
export const useLanguage = () => useContext(LanguageContext);
