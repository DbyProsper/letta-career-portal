"use client";
import Link from "next/link";
import { SiteSearch } from "./SiteSearch";
import { ThemeToggle } from "./ThemeToggle";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Compass,
  Globe2,
  Menu,
  Search,
  X,
  CalendarDays,
  LayoutGrid,
} from "lucide-react";
import { languages, useLanguage } from "../lib/language";
import { roles, youthLinks, services, slug } from "../data/catalog";
export const A = Link;
export function Btn({
  href,
  children,
  light = false,
}: {
  href: string;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <Link className={"btn " + (light ? "light" : "")} href={href}>
      {children}
    </Link>
  );
}
export function PageTitle({
  group,
  title,
  desc,
}: {
  group?: string;
  title: string;
  desc?: string;
}) {
  const { t } = useLanguage();
  return (
    <div className="page-title">
      {group && (
        <span className="eyebrow">
          <Compass size={15} />
          {t(group)}
        </span>
      )}
      <h1>{t(title)}</h1>
      {desc && <p>{t(desc)}</p>}
    </div>
  );
}
export function Cards({ items }: { items: readonly (readonly string[])[] }) {
  const { t } = useLanguage();
  return (
    <div className="tiles">
      {items.map(([title, href, desc]) => (
        <Link key={title} className="tile" href={href}>
          <ArrowUpRight size={18} />
          <h3>{t(title)}</h3>
          {desc && <p>{t(desc)}</p>}
        </Link>
      ))}
    </div>
  );
}
export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div role="status" className="notice">
      {children}
    </div>
  );
}
export const navGroups: Record<string, string[][]> = {
  Services: [
    ["All services", "/services"],
    ...services.map((s) => [s[0], "/services/" + slug(s[0])]),
  ],
  Discover: [["Future Mix", "/#future-mix"], ...youthLinks],
  Resources: [
    ["Resource library", "/resources"],
    ["Upcoming events", "/events"],
    ["Career Toolkit", "/career-toolkit"],
    ["Find your portal", "/portal"],
  ],
};
export function Header({ path }: { path: string }) {
  const [open, setOpen] = useState("");
  const [mobile, setMobile] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { t, language, set } = useLanguage();
  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen("");
        setMobile(false);
      }
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen("");
        setMobile(false);
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);
  useEffect(() => {
    setOpen("");
    setMobile(false);
  }, [path]);
  const close = () => {
    setOpen("");
    setMobile(false);
  };
  return (
    <header ref={ref} className="top">
      <a className="skip" href="#main">
        {t("Skip to content")}
      </a>
      <div className="nav-inner">
        <Link className="brand" href="/" onClick={close}>
          <img
            src="/brand/letta-consulting-logo.png"
            alt={t("Letta Consulting home")}
          />
        </Link>
        <nav
          aria-label={t("Main navigation")}
          className={mobile ? "main-nav expanded" : "main-nav"}
        >
          <Link
            className={path === "/" ? "current" : ""}
            href="/"
            onClick={close}
          >
            {t("Home")}
          </Link>
          {Object.keys(navGroups).map((k) => (
            <div className="nav-group" key={k}>
              <button
                aria-expanded={open === k}
                onClick={() => setOpen(open === k ? "" : k)}
              >
                {t(k)}
                <ChevronDown size={13} />
              </button>
              {open === k && (
                <div className="dropdown">
                  {navGroups[k].map(([name, url]) => (
                    <Link key={url} onClick={close} href={url}>
                      {t(name)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {["About", "Contact"].map((k) => (
            <Link
              className={path === "/" + k.toLowerCase() ? "current" : ""}
              key={k}
              onClick={close}
              href={"/" + k.toLowerCase()}
            >
              {t(k)}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <SiteSearch />
          <ThemeToggle />
          <label className="language">
            <Globe2 size={16} />
            <select
              aria-label={t("Language")}
              value={language}
              onChange={(e) => set(e.target.value)}
            >
              {languages.map((l) => (
                <option key={l} value={l}>
                  {t(l)}
                </option>
              ))}
            </select>
          </label>
          <Link href="/booking" className="book">
            <CalendarDays size={16} />
            {t("Book a session")}
          </Link>
          <button
            className="menu"
            aria-label={t(mobile ? "Close menu" : "Open menu")}
            aria-expanded={mobile}
            onClick={() => setMobile(!mobile)}
          >
            {mobile ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
export function Footer() {
  const { t } = useLanguage();
  return (
    <footer>
      <div className="footer-in">
        <div>
          <Link href="/" className="foot-logo">
            <img
              src="/brand/letta-consulting-logo.png"
              alt={t("Letta Consulting")}
            />
          </Link>
          <p>{t("Real support. Brighter futures.")}</p>
        </div>
        <div>
          <b>{t("Explore")}</b>
          <Link href="/careers">{t("Career World")}</Link>
          <Link href="/wellness">{t("Wellness Space")}</Link>
          <Link href="/resources">{t("Resource library")}</Link>
        </div>
        <div>
          <b>{t("Get support")}</b>
          <Link href="/services">{t("Our services")}</Link>
          <Link href="/team">{t("Practitioner profiles")}</Link>
          <Link href="/portal">{t("Choose a portal")}</Link>
        </div>
        <div>
          <b>{t("Contact")}</b>
          <a href="mailto:info@lettaconsulting.co.za">
            info@lettaconsulting.co.za
          </a>
          <a href="tel:+27120042803">+27 12 004 2803</a>
          <Link href="/contact">{t("Contact details")}</Link>
        </div>
      </div>
      <div className="foot-base">
        <span>{t("Letta Consulting · Interactive prototype")}</span>
        <div>
          <Link href="/privacy">{t("Privacy")}</Link>
          <Link href="/terms">{t("Terms")}</Link>
        </div>
      </div>
    </footer>
  );
}
export function RolePicker({ path }: { path: string }) {
  const { t } = useLanguage();
  return (
    <div className="rolepicker">
      <LayoutGrid size={17} />
      <label>
        {t("Demo portal")}{" "}
        <select
          aria-label={t("Switch demo portal")}
          value={
            roles.find((r) => r[1] === path)?.[1] ||
            (["practice", "individual", "parent", "school", "corporate"].some(
              (k) => path.startsWith("/" + k),
            )
              ? path.startsWith("/practice")
                ? "/practice"
                : path
              : "/discover")
          }
          onChange={(e) => location.assign(e.target.value)}
        >
          {roles.map(([n, u]) => (
            <option key={u} value={u}>
              {t(n)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
export function SearchField({
  value,
  set,
  placeholder,
}: {
  value: string;
  set: (v: string) => void;
  placeholder: string;
}) {
  const { t } = useLanguage();
  return (
    <label className="search">
      <Search size={19} />
      <input
        type="search"
        aria-label={t(placeholder)}
        placeholder={t(placeholder)}
        value={value}
        onChange={(e) => set(e.target.value)}
      />
    </label>
  );
}
