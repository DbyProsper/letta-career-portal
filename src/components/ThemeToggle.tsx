"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "../lib/language";

export function ThemeToggle() {
  const { t } = useLanguage();
  const [dark, setDark] = useState(false);
  function apply(isDark: boolean) {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    setDark(isDark);
  }
  useEffect(() => {
    const system = matchMedia("(prefers-color-scheme: dark)");
    function synchronize() {
      let saved;
      try { saved = localStorage.getItem("letta-theme"); } catch {}
      apply(saved === "dark" || (saved !== "light" && system.matches));
    }
    function onStorage(event: StorageEvent) {
      if (event.key === "letta-theme" || event.key === null) synchronize();
    }
    synchronize();
    system.addEventListener("change", synchronize);
    window.addEventListener("storage", onStorage);
    return () => {
      system.removeEventListener("change", synchronize);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return (
    <button
      className="theme-toggle"
      type="button"
      role="switch"
      aria-label={t("Dark mode")}
      aria-checked={dark}
      title={t(dark ? "Switch to light mode" : "Switch to dark mode")}
      onClick={() => {
        apply(!dark);
        try { localStorage.setItem("letta-theme", dark ? "light" : "dark"); } catch {}
      }}
    >
      <Moon className="theme-moon" size={18} aria-hidden="true" />
      <Sun className="theme-sun" size={18} aria-hidden="true" />
    </button>
  );
}
