"use client";
import { useLanguage } from "../lib/language";
import { useEffect, useRef, useState } from "react";
import { PageLink as Link } from "./PageLink";
import { Search, X } from "lucide-react";
import { careers, roles, services, slug, youthLinks } from "../data/catalog";
const destinations = [
  ...youthLinks.map(([name, href]) => ({ name, href, group: "Youth portal" })),
  ...roles.map(([name, href]) => ({
    name,
    href,
    group: "Workspaces",
  })),
  ...services.map(([name]) => ({
    name,
    href: "/services/" + slug(name),
    group: "Services",
  })),
  ...careers.map((c) => ({
    name: c.name,
    href: "/careers/" + c.id,
    group: c.category,
  })),
  ...[
    ["Book a session", "/booking"],
    ["CV Builder", "/career-toolkit/cv-builder"],
    ["Cover Letter Builder", "/career-toolkit/cover-letter-builder"],
    ["Contact details", "/contact"],
    ["Practitioner profiles", "/team"],
    ["Events and workshops", "/events"],
    ["Resource library", "/resources"],
    ["Content Studio", "/practice/content-studio"],
  ].map(([name, href]) => ({ name, href, group: "Tools and resources" })),
];
export function SiteSearch() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  function show() {
    setQuery("");
    ref.current?.showModal();
  }
  useEffect(() => {
    function shortcut(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        show();
      }
    }
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, []);
  const list = destinations
    .filter((item) =>
      [item.name, item.group, t(item.name), t(item.group)]
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
    )
    .slice(0, 12);
  return (
    <>
      <button
        className="global-search-trigger"
        aria-label={t("Search portal")}
        onClick={show}
      >
        <Search size={19} />
      </button>
      <dialog
        ref={ref}
        className="search-dialog"
        aria-labelledby="search-title"
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
      >
        <div>
          <div className="section-heading">
            <h2 id="search-title">{t("Find your next step")}</h2>
            <button
              aria-label={t("Close search")}
              onClick={() => ref.current?.close()}
            >
              <X />
            </button>
          </div>
          <label className="search">
            <Search size={18} />
            <input
              autoFocus
              type="search"
              aria-label={t("Search the portal")}
              placeholder={t("Search careers, services or tools")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="search-results">
            {list.map((item) => (
              <Link
                key={item.name + item.href}
                href={item.href}
                onClick={() => ref.current?.close()}
              >
                <b>{t(item.name)}</b>
                <small>{t(item.group)}</small>
              </Link>
            ))}
            {!list.length && (
              <p className="empty">
                {t("No matches. Try “CV”, “wellness” or “school”.")}
              </p>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
