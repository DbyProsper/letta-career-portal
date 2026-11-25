"use client";
import { MotionConfig } from "motion/react";
import Home from "./Home";
import { A, Footer, Header, RolePicker } from "./ui";
import { practiceTabs, services, slug, youthLinks } from "../data/catalog";
import { useLanguage } from "../lib/language";
import {
  CareerWorld,
  Discovery,
  Games,
  MyFuture,
  Opportunities,
  YouthDashboard,
} from "../features/Discovery";
import { Events, Info, Library, Services, Team } from "../features/Public";
import { PortalIndex, RoleDashboard } from "../features/Portals";
import Practice from "../features/Practice";
import BookingFlow from "../features/Booking";
import { Toolkit } from "../features/Toolkit";
const pageNames: Record<string, string> = {
  "/services": "Services",
  "/booking": "Book a session",
  "/booking/confirmation": "Request saved",
  "/contact": "Contact",
  "/about": "About",
  "/team": "Practitioner profiles",
  "/resources": "Resource library",
  "/events": "Events",
  "/terms": "Terms",
  "/privacy": "Privacy",
  "/portal": "Find your portal",
  ...Object.fromEntries(
    services.map(([name]) => ["/services/" + slug(name), name]),
  ),
};
function Content({ path: p }: { path: string }) {
  if (p === "/") return <Home />;
  if (p === "/discover") return <YouthDashboard />;
  if (p.startsWith("/discover/")) return <Discovery path={p} />;
  if (p.startsWith("/careers")) return <CareerWorld path={p} />;
  if (p === "/games") return <Games />;
  if (p === "/my-future") return <MyFuture />;
  if (p === "/opportunities") return <Opportunities />;
  if (p === "/wellness" || p === "/resources")
    return <Library wellness={p === "/wellness"} />;
  if (p.startsWith("/career-toolkit")) return <Toolkit path={p} />;
  if (p.startsWith("/booking"))
    return <BookingFlow confirmation={p.endsWith("/confirmation")} />;
  if (p.startsWith("/services")) return <Services path={p} />;
  if (p === "/team") return <Team />;
  if (p === "/events") return <Events />;
  if (p === "/portal") return <PortalIndex />;
  if (p === "/practice" || p.startsWith("/practice/"))
    return <Practice path={p} />;
  if (p.endsWith("/dashboard")) return <RoleDashboard path={p} />;
  return <Info path={p} />;
}
export default function Portal({ path }: { path: string }) {
  const practice = path.startsWith("/practice"),
    role = path.endsWith("/dashboard"),
    youth = youthLinks.some(([, p]) => path === p || path.startsWith(p + "/"));
  const workspace = practice || role || youth;
  const { t } = useLanguage();
  const links = practice
    ? practiceTabs.map((v, i) => [v, i ? "/practice/" + slug(v) : "/practice"])
    : role
      ? [
          ["Dashboard", path],
          ["Resources", "/resources"],
          ["Book a session", "/booking"],
          ["Contact", "/contact"],
        ]
      : youthLinks;
  return (
    <MotionConfig reducedMotion="user">
      <Header path={path} />
      {workspace ? (
        <div className="workspace">
          <nav className="sidebar" aria-label={t("Workspace navigation")}>
            <RolePicker path={path} />
            <h2>
              {t(
                practice
                  ? "Practice team"
                  : role
                    ? "My workspace"
                    : "Youth workspace",
              )}
            </h2>
            {links.map(([n, p]) => (
              <A
                key={p}
                href={p}
                aria-current={path === p ? "page" : undefined}
                className={path === p ? "active" : ""}
              >
                {t(n)}
              </A>
            ))}
          </nav>
          <main id="main" key={path}>
            <Content path={path} />
          </main>
        </div>
      ) : (
        <main
          id="main"
          className={path === "/" ? "" : "public-wrap"}
          key={path}
        >
          {path !== "/" && (
            <div className="crumb">
              <A href="/">{t("Home")}</A> / {t(pageNames[path] || "Home")}
            </div>
          )}
          <Content path={path} />
        </main>
      )}
      <Footer />
    </MotionConfig>
  );
}
